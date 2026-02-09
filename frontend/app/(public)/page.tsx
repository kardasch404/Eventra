import Link from 'next/link';
import { getServerClient } from '@/infrastructure/graphql/apollo-client-ssr';
import { GET_EVENTS } from '@/infrastructure/graphql/queries';
import { Navbar, Footer } from '@/presentation/components/layouts';

// Helper to format date
function formatEventDate(dateString: string | null) {
  if (!dateString) return 'Date TBD';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
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

export default async function HomePage() {
  const client = getServerClient();
  
  const { data } = await client.query({
    query: GET_EVENTS,
    variables: {
      filters: { status: 'PUBLISHED' },
    },
  });

  const events = data?.events?.events?.slice(0, 6) || [];

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-orange-500 via-orange-400 to-yellow-400 text-white py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="max-w-2xl">
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Find your next experience
              </h1>
              <p className="text-xl mb-8 text-white/90">
                Discover the best events happening near you. Music, food, conferences, and more.
              </p>
              
              {/* Search Box */}
              <div className="bg-white rounded-lg p-2 shadow-lg">
                <form className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 relative">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input 
                      type="text" 
                      placeholder="Search events" 
                      className="w-full pl-10 pr-4 py-3 text-gray-800 rounded-md focus:outline-none"
                    />
                  </div>
                  <div className="sm:w-48 relative">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <input 
                      type="text" 
                      placeholder="Location" 
                      className="w-full pl-10 pr-4 py-3 text-gray-800 rounded-md focus:outline-none"
                    />
                  </div>
                  <Link 
                    href="/events"
                    className="bg-orange-500 text-white px-8 py-3 rounded-md font-semibold hover:bg-orange-600 transition-colors text-center"
                  >
                    Search
                  </Link>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { name: 'Music', icon: '🎵', category: 'MUSIC' },
                { name: 'Food & Drink', icon: '🍕', category: 'FOOD_DRINK' },
                { name: 'Business', icon: '💼', category: 'BUSINESS' },
                { name: 'Arts', icon: '🎨', category: 'ARTS' },
                { name: 'Sports', icon: '⚽', category: 'SPORTS' },
                { name: 'Tech', icon: '💻', category: 'SCIENCE' },
              ].map((cat) => (
                <Link 
                  key={cat.category}
                  href={`/events?category=${cat.category}`}
                  className="bg-white rounded-lg p-4 text-center hover:shadow-lg transition-shadow border border-gray-200"
                >
                  <span className="text-3xl mb-2 block">{cat.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Events Section */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Popular Events</h2>
              <Link href="/events" className="text-orange-500 font-medium hover:text-orange-600">
                See all →
              </Link>
            </div>
            
            {events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event: any) => (
                  <Link key={event.id} href={`/events/${event.slug}`} className="group">
                    <article className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                      {/* Event Image */}
                      <div className="relative h-48">
                        {event.hero?.url ? (
                          <img 
                            src={event.hero.url} 
                            alt={event.hero.alt || event.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-orange-400 to-pink-500" />
                        )}
                        {/* Save Button */}
                        <button 
                          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md text-gray-400 hover:text-red-500 transition-colors"
                          onClick={(e) => e.preventDefault()}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                      </div>
                      
                      {/* Event Details */}
                      <div className="p-4">
                        <p className="text-sm text-orange-500 font-semibold mb-1">
                          {formatEventDate(event.dateTime?.start)}
                        </p>
                        <h3 className="font-semibold text-gray-900 group-hover:text-orange-500 transition-colors line-clamp-2 mb-2">
                          {event.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">
                          {event.location?.venue && `${event.location.venue} • `}
                          {event.location?.city}
                        </p>
                        {event.type === 'ONLINE' && (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            Online Event
                          </span>
                        )}
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No events available at the moment.</p>
                <Link href="/events/create" className="mt-4 inline-block text-orange-500 font-medium">
                  Create the first event →
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-[#1e0a3c] text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Create an event with Eventra</h2>
            <p className="text-gray-300 mb-8 text-lg">
              Host memorable events with our easy-to-use platform. From small meetups to large conferences.
            </p>
            <Link 
              href="/events/create"
              className="inline-block bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              Get Started - It's Free
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
