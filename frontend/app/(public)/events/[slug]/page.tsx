import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getServerClient } from '@/infrastructure/graphql/apollo-client-ssr';
import { GET_EVENT_BY_SLUG, GET_EVENTS } from '@/infrastructure/graphql/queries';
import { Navbar, Footer } from '@/presentation/components/layouts';
import { 
  ShareButton, 
  LikeButton, 
  FollowButton, 
  ContactButton, 
  FollowOrganizerButton, 
  ReportButton, 
  ShowMapButton,
  GetTicketsButton 
} from '@/presentation/components/features/EventActionButtons';

// Format date helpers
function formatEventDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

function formatDateRange(start: string, end: string | null) {
  const startDate = new Date(start);
  const endDate = end ? new Date(end) : null;
  
  const startStr = startDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric'
  });
  
  const timeStr = startDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  
  if (!endDate) return `${startStr} at ${timeStr}`;
  
  const endStr = endDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric'
  });
  
  const endTimeStr = endDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  
  return `${startStr} at ${timeStr} to ${endStr} at ${endTimeStr}`;
}

function calculateDuration(start: string, end: string | null) {
  if (!end) return null;
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffMs = endDate.getTime() - startDate.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  const remainingHours = diffHours % 24;
  
  if (diffDays > 0) {
    return `${diffDays} day ${remainingHours} hours`;
  }
  return `${diffHours} hours`;
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const client = getServerClient();
  const { slug } = await params;

  try {
    const { data } = await client.query({
      query: GET_EVENT_BY_SLUG,
      variables: { slug },
    });

    const event = data?.eventBySlug;
    if (!event) return notFound();

    const { data: relatedData } = await client.query({
      query: GET_EVENTS,
      variables: {
        filters: {
          organizerId: event.organizerId,
          status: 'PUBLISHED',
        },
      },
    });

    const relatedEvents = relatedData?.events?.events?.filter((e: any) => e.id !== event.id).slice(0, 3) || [];
    const availableSeats = event.availableSeats || (event.capacity - (event.bookedCount || 0));
    const isFull = availableSeats <= 0;
    const duration = event.dateTime?.end ? calculateDuration(event.dateTime.start, event.dateTime.end) : null;

    return (
      <>
        <Navbar />
        
        <div className="event-listing bg-white" role="article">
          {/* Hero Section */}
          <div className="event-hero-wrapper">
            <div className="event-hero relative">
              {/* Hero Background Blur */}
              <div 
                className="event-hero__background absolute inset-0 bg-cover bg-center blur-md scale-110"
                style={{ 
                  backgroundImage: event.hero?.url ? `url(${event.hero.url})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
              />
              
              {/* Hero Carousel */}
              <div className="relative z-10 max-w-5xl mx-auto">
                <div className="hero-carousel-viewport">
                  <div className="hero-image-container aspect-[2/1] max-h-[500px]">
                    {event.hero?.url && (
                      <img
                        src={event.hero.url}
                        alt={event.title}
                        className="w-full h-full object-cover rounded-lg shadow-2xl"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="extra-info-and-action-bar bg-white border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-4 py-3 flex justify-end items-center gap-3">
                <ShareButton />
                <LikeButton />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="event-details__wrapper max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Title */}
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                    {event.title}
                  </h1>
                </div>

                {/* Organizer Brief */}
                <div className="flex items-center justify-between pb-6 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                      {event.organizerId?.[0]?.toUpperCase() || 'O'}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">By <strong className="text-gray-900 font-semibold">Event Organizer</strong></p>
                    </div>
                  </div>
                  <FollowButton />
                </div>

                {/* Date and Location */}
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <svg className="w-6 h-6 text-gray-700 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 8.66797C9.10457 8.66797 10 7.77254 10 6.66797C10 5.5634 9.10457 4.66797 8 4.66797C6.89543 4.66797 6 5.5634 6 6.66797C6 7.77254 6.89543 8.66797 8 8.66797Z"/>
                      <path fillRule="evenodd" clipRule="evenodd" d="M14 6.66797C14 10.668 8 15.3346 8 15.3346C8 15.3346 2 10.668 2 6.66797C2 3.0013 4.68629 0.667969 8 0.667969C11.3137 0.667969 14 3.0013 14 6.66797ZM12.6667 6.66797C12.6667 7.34885 12.4052 8.15861 11.9004 9.05595C11.4026 9.94098 10.7207 10.8185 10.0089 11.6093C9.30105 12.3959 8.58882 13.069 8.05168 13.5464L8 13.5922L7.94832 13.5464C7.41118 13.069 6.69895 12.3959 5.99106 11.6093C5.2793 10.8185 4.59743 9.94098 4.0996 9.05595C3.59485 8.15861 3.33333 7.34885 3.33333 6.66797C3.33333 3.78927 5.37 2.0013 8 2.0013C10.63 2.0013 12.6667 3.78927 12.6667 6.66797Z"/>
                    </svg>
                    <div>
                      <button className="font-semibold text-gray-900 hover:underline text-left">
                        {event.location.venue || event.location.address}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <svg className="w-6 h-6 text-gray-700 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M6.00065 6.4987C6.00065 7.05098 5.55294 7.4987 5.00065 7.4987C4.44837 7.4987 4.00065 7.05098 4.00065 6.4987C4.00065 5.94641 4.44837 5.4987 5.00065 5.4987C5.55294 5.4987 6.00065 5.94641 6.00065 6.4987Z"/>
                      <path d="M8.00065 7.4987C8.55294 7.4987 9.00065 7.05098 9.00065 6.4987C9.00065 5.94641 8.55294 5.4987 8.00065 5.4987C7.44837 5.4987 7.00065 5.94641 7.00065 6.4987C7.00065 7.05098 7.44837 7.4987 8.00065 7.4987Z"/>
                      <path fillRule="evenodd" clipRule="evenodd" d="M5.00065 1.33203H6.33398V1.9987H9.66732V1.33203H11.0007V1.9987H14.6673V13.9987H1.33398V1.9987H5.00065V1.33203ZM5.00065 3.33203H2.66732V12.6654H13.334V3.33203H11.0007V3.9987H9.66732V3.33203H6.33398V3.9987H5.00065V3.33203Z"/>
                    </svg>
                    <div>
                      <time className="font-semibold text-gray-900">
                        {formatDateRange(event.dateTime.start, event.dateTime.end)} GMT+1
                      </time>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <hr className="border-gray-200" />

                {/* Overview */}
                <div>
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
                  </div>
                  <div className="prose max-w-none">
                    <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {event.description || event.summary}
                    </div>
                  </div>
                  {event.category && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <span className="text-sm text-gray-600">Category: </span>
                      <span className="text-sm font-semibold text-gray-900">{event.category}</span>
                    </div>
                  )}
                </div>

                {/* Divider */}
                <hr className="border-gray-200" />

                {/* Good to Know */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Good to know</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Highlights Card */}
                    <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                      <p className="font-semibold text-gray-900 mb-4">Highlights</p>
                      <ul className="space-y-3">
                        {duration && (
                          <li className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M0.667969 7.99996C0.667969 3.94987 3.95121 0.666626 8.0013 0.666626C8.7419 0.666626 9.45685 0.776409 10.1308 0.98059L9.74417 2.25664C9.19423 2.09003 8.60949 1.99996 8.0013 1.99996C4.68759 1.99996 2.0013 4.68625 2.0013 7.99996C2.0013 11.3137 4.68759 14 8.0013 14C8.60949 14 9.19423 13.9099 9.74417 13.7433L10.1308 15.0193C9.45685 15.2235 8.7419 15.3333 8.0013 15.3333C3.95121 15.3333 0.667969 12.05 0.667969 7.99996Z"/>
                            </svg>
                            <span className="text-sm text-gray-700">{duration}</span>
                          </li>
                        )}
                        <li className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 12 16">
                            <path d="M6 8.66663C7.10457 8.66663 8 7.7712 8 6.66663C8 5.56206 7.10457 4.66663 6 4.66663C4.89543 4.66663 4 5.56206 4 6.66663C4 7.7712 4.89543 8.66663 6 8.66663Z"/>
                            <path fillRule="evenodd" clipRule="evenodd" d="M12 6.66663C12 10.6666 6 15.3333 6 15.3333C6 15.3333 0 10.6666 0 6.66663C0 2.99996 2.68629 0.666626 6 0.666626C9.31371 0.666626 12 2.99996 12 6.66663Z"/>
                          </svg>
                          <span className="text-sm text-gray-700">In person</span>
                        </li>
                      </ul>
                    </div>

                    {/* Refund Policy Card */}
                    <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                      <p className="font-semibold text-gray-900 mb-4">Refund Policy</p>
                      <p className="text-sm text-gray-700">Refunds up to 14 days before event</p>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <hr className="border-gray-200" />

                {/* Location */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6" id="location-heading">Location</h2>
                  <div className="space-y-6">
                    <div>
                      <p className="font-semibold text-gray-900 text-lg">{event.location.venue || event.location.address}</p>
                      {event.location.address && event.location.venue && (
                        <p className="text-gray-600 mt-1">{event.location.address}</p>
                      )}
                      <p className="text-gray-600 mt-1">
                        {event.location.city}, {event.location.country}
                      </p>
                    </div>

                    {/* Map Section */}
                    <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                      <ShowMapButton />
                    </div>

                    {/* Directions */}
                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-4">How do you want to get there?</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <a href={`https://maps.google.com?daddr=${encodeURIComponent(`${event.location.address || event.location.venue}, ${event.location.city}`)}`} 
                           target="_blank" 
                           rel="noreferrer"
                           className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
                          <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 17">
                            <path fillRule="evenodd" clipRule="evenodd" d="M18 13H17.9235H13.9235H6H2V7.989C2 7.4375 2.387 7 2.9385 7H3H9.5H10.5H16.9385C17.4895 7 18 7.4375 18 7.989V13Z"/>
                          </svg>
                          <span className="text-sm font-medium text-blue-600">Driving</span>
                        </a>
                        <a href={`https://maps.google.com?daddr=${encodeURIComponent(`${event.location.address || event.location.venue}, ${event.location.city}`)}&dirflg=r`} 
                           target="_blank" 
                           rel="noreferrer"
                           className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
                          <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 18">
                            <path fillRule="evenodd" clipRule="evenodd" d="M13 11.5H16V10.5H13V11.5ZM4 11.5H7V10.5H4V11.5Z"/>
                          </svg>
                          <span className="text-sm font-medium text-blue-600">Public transport</span>
                        </a>
                        <a href={`https://maps.google.com?daddr=${encodeURIComponent(`${event.location.address || event.location.venue}, ${event.location.city}`)}&dirflg=b`} 
                           target="_blank" 
                           rel="noreferrer"
                           className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
                          <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" clipRule="evenodd" d="M18.8447 18.0002C17.1067 18.0002 15.6927 16.654 15.6927 14.9994C15.6927 13.9096 16.3077 12.9563 17.2227 12.4309L18.1552 14.7644L19.0837 14.393L18.1567 12.0725C18.3782 12.025 18.6082 11.998 18.8447 11.998C20.5827 11.998 21.9967 13.3442 21.9967 14.9994C21.9967 16.654 20.5827 18.0002 18.8447 18.0002Z"/>
                          </svg>
                          <span className="text-sm font-medium text-blue-600">Biking</span>
                        </a>
                        <a href={`https://maps.google.com?daddr=${encodeURIComponent(`${event.location.address || event.location.venue}, ${event.location.city}`)}&dirflg=w`} 
                           target="_blank" 
                           rel="noreferrer"
                           className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
                          <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 12 20">
                            <path fillRule="evenodd" clipRule="evenodd" d="M0.725205 19.4686L1.61201 20.0011L5.11996 14.6736L4.23315 14.1411L0.725205 19.4686Z"/>
                          </svg>
                          <span className="text-sm font-medium text-blue-600">Walking</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <hr className="border-gray-200" />

                {/* Organized By */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Organized by</h2>
                  <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                    <div className="flex flex-col sm:flex-row items-start gap-6">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-3xl flex-shrink-0">
                        {event.organizerId?.[0]?.toUpperCase() || 'O'}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                          <a href="#" className="hover:underline">Event Organizer</a>
                        </h3>
                        <div className="flex items-center gap-6 text-sm mb-4">
                          <div>
                            <p className="text-gray-600">Followers</p>
                            <p className="font-semibold text-gray-900">40</p>
                          </div>
                          <div className="w-px h-6 bg-gray-200"></div>
                          <div>
                            <p className="text-gray-600">Events</p>
                            <p className="font-semibold text-gray-900">--</p>
                          </div>
                          <div className="w-px h-6 bg-gray-200"></div>
                          <div>
                            <p className="text-gray-600">Hosting</p>
                            <p className="font-semibold text-gray-900">--</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-6">
                      <ContactButton />
                      <FollowOrganizerButton />
                    </div>
                  </div>
                </div>

                {/* Report Event */}
                <div className="flex justify-center">
                  <ReportButton />
                </div>

                {/* Divider */}
                <hr className="border-gray-200" />

                {/* More Events from Organizer */}
                {relatedEvents.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">More events from this organizer</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {relatedEvents.map((relatedEvent: any) => (
                        <Link key={relatedEvent.id} href={`/events/${relatedEvent.slug}`}>
                          <div className="flex flex-col border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white h-full">
                            <div className="aspect-[16/9] w-full flex-shrink-0">
                              {relatedEvent.hero?.url ? (
                                <img 
                                  src={relatedEvent.hero.url} 
                                  alt={relatedEvent.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-orange-400 to-purple-600" />
                              )}
                            </div>
                            <div className="p-4 flex-1 flex flex-col">
                              <h3 className="font-semibold text-base text-gray-900 mb-2 line-clamp-2">{relatedEvent.title}</h3>
                              <p className="text-sm text-blue-600 font-semibold mb-1">
                                {formatEventDate(relatedEvent.dateTime.start)}
                              </p>
                              <p className="text-xs text-gray-600 mb-3 line-clamp-1">
                                {relatedEvent.location.venue || relatedEvent.location.address} • {relatedEvent.location.city}
                              </p>
                              <div className="mt-auto">
                                <p className="text-sm font-semibold text-gray-900">Event Organizer</p>
                                <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 4C9.7 4 7.8 5.9 7.8 8.2s1.9 4.2 4.2 4.2 4.2-1.9 4.2-4.2S14.3 4 12 4zm0 6.4c-1.2 0-2.2-1-2.2-2.2C9.8 7 10.8 6 12 6s2.2 1 2.2 2.2c0 1.2-1 2.2-2.2 2.2z"/>
                                  </svg>
                                  <span>40 followers</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar - Sticky Ticket Card */}
              <div className="lg:col-span-1">
                <div className="sticky top-4">
                  <div className="border border-gray-200 rounded-lg bg-white shadow-lg p-6">
                    <div className="mb-6">
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-2xl font-bold text-gray-900">Free</span>
                      </div>
                      <p className="text-sm font-semibold text-blue-600">
                        {formatEventDate(event.dateTime.start)}
                      </p>
                    </div>

                    <GetTicketsButton 
                      isFull={isFull} 
                      status={event.status}
                      event={{
                        id: event.id,
                        title: event.title,
                        dateTime: event.dateTime,
                        capacity: {
                          total: event.capacity,
                          available: availableSeats,
                        },
                        hero: event.hero,
                      }}
                    />

                    {!isFull && event.status === 'PUBLISHED' && availableSeats > 0 && (
                      <p className="text-center text-sm text-gray-600 mt-4">
                        {availableSeats} tickets available
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </>
    );
  } catch (error) {
    console.error('Event detail error:', error);
    return notFound();
  }
}
