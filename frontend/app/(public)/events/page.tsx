import Link from 'next/link';
import { getServerClient } from '@/infrastructure/graphql/apollo-client-ssr';
import { GET_EVENTS } from '@/infrastructure/graphql/queries';
import { EventSearchBar } from '@/presentation/components/features/EventSearchBar';
import { Navbar, Footer } from '@/presentation/components/layouts';

interface SearchParams {
  search?: string;
  category?: string;
  city?: string;
  type?: string;
  page?: string;
}

// Helper to format date
function formatEventDate(dateString: string | null) {
  if (!dateString) return 'Date TBD';
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  };
  return date.toLocaleDateString('en-US', options);
}

// Helper to get month abbreviation
function getMonthAbbr(dateString: string | null) {
  if (!dateString) return 'TBD';
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
}

// Helper to get day number
function getDayNum(dateString: string | null) {
  if (!dateString) return '--';
  return new Date(dateString).getDate();
}

export default async function EventsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const client = getServerClient();
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const limit = 20;

  const { data } = await client.query({
    query: GET_EVENTS,
    variables: {
      filters: {
        search: params.search,
        category: params.category,
        city: params.city,
        type: params.type,
        status: 'PUBLISHED',
      },
    },
  });

  const events = data?.events?.events || [];
  const total = data?.events?.total || 0;
  const totalPages = Math.ceil(total / limit);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Events</h1>
            <p className="text-gray-600">Discover events happening around you</p>
          </div>

          {/* Search & Filters */}
          <EventSearchBar />

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            {total > 0 ? `${total} event${total !== 1 ? 's' : ''} found` : 'No events found'}
          </p>
          <div className="flex gap-2">
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
              <option>Date</option>
              <option>This week</option>
              <option>This month</option>
              <option>Next month</option>
            </select>
          </div>
        </div>

        {/* Events List */}
        {events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event: any) => (
              <Link 
                key={event.id} 
                href={`/events/${event.slug}`}
                className="block"
              >
                <article className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
                  <div className="flex">
                    {/* Date Thumbnail */}
                    <div className="hidden sm:flex flex-col items-center justify-center w-20 px-4 py-6 border-r border-gray-100">
                      <span className="text-orange-500 text-xs font-semibold uppercase">
                        {getMonthAbbr(event.dateTime?.start)}
                      </span>
                      <span className="text-2xl font-bold text-gray-800">
                        {getDayNum(event.dateTime?.start)}
                      </span>
                    </div>

                    {/* Event Image */}
                    <div className="w-32 sm:w-48 flex-shrink-0">
                      <div className="relative h-full min-h-[120px]">
                        {event.hero?.url ? (
                          <img 
                            src={event.hero.url} 
                            alt={event.hero.alt || event.title}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-pink-500" />
                        )}
                      </div>
                    </div>

                    {/* Event Details */}
                    <div className="flex-1 p-4">
                      <div className="flex flex-col h-full justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
                            {event.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {formatEventDate(event.dateTime?.start)}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {event.location?.venue && `${event.location.venue} • `}
                            {event.location?.city}{event.location?.country && `, ${event.location.country}`}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            {event.type === 'ONLINE' && (
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                Online
                              </span>
                            )}
                            {event.category && (
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                                {event.category}
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {event.bookedCount || 0} attending
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="hidden md:flex items-start p-4">
                      <button 
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        onClick={(e) => e.preventDefault()}
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No events found</h3>
            <p className="mt-2 text-gray-500">Try adjusting your search or filters to find events.</p>
            <Link 
              href="/events"
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600"
            >
              Clear filters
            </Link>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {page > 1 && (
              <Link
                href={`/events?page=${page - 1}`}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Previous
              </Link>
            )}
            <span className="px-4 py-2 text-sm text-gray-700">
              Page {page} of {totalPages}
            </span>
            {page < totalPages && (
              <Link
                href={`/events?page=${page + 1}`}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Next
              </Link>
            )}
          </div>
        )}
        </main>
      </div>
      <Footer />
    </>
  );
}
