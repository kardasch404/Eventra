import Link from 'next/link';
import { getServerClient } from '@/infrastructure/graphql/apollo-client-ssr';
import { GET_EVENTS } from '@/infrastructure/graphql/queries';
import { Navbar, Footer } from '@/presentation/components/layouts';
import { EventFilters } from '@/presentation/components/features/EventFilters';
import { Pagination } from '@/presentation/components/features/Pagination';

interface SearchParams {
  search?: string;
  category?: string;
  city?: string;
  type?: string;
  page?: string;
}

export default async function EventsPage({ searchParams }: { searchParams: SearchParams }) {
  const client = getServerClient();
  const page = parseInt(searchParams.page || '1');
  const limit = 20;

  const { data } = await client.query({
    query: GET_EVENTS,
    variables: {
      filters: {
        search: searchParams.search,
        category: searchParams.category,
        city: searchParams.city,
        type: searchParams.type,
        status: 'PUBLISHED',
      },
      pagination: { page, limit },
    },
  });

  const events = data?.getEvents?.events || [];
  const total = data?.getEvents?.total || 0;
  const totalPages = Math.ceil(total / limit);

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Browse Events</h1>
        
        <EventFilters />

        <div className="mb-4 text-gray-600">
          Found {total} event{total !== 1 ? 's' : ''}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.map((event: any) => (
            <Link key={event.id} href={`/events/${event.slug}`} className="group">
              <div className="border rounded-lg overflow-hidden hover:shadow-lg transition">
                {event.heroImage && (
                  <img src={event.heroImage.url} alt={event.heroImage.alt} className="w-full h-40 object-cover" />
                )}
                <div className="p-4">
                  <h3 className="font-semibold mb-2 group-hover:text-blue-600">{event.title}</h3>
                  <p className="text-sm text-gray-600 mb-1">{event.location.city}, {event.location.country}</p>
                  <p className="text-sm text-gray-500 mb-2">{new Date(event.startDate).toLocaleDateString()}</p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{event.currentAttendees}/{event.maxAttendees} attending</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded">{event.status}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No events found. Try adjusting your filters.
          </div>
        )}

        {totalPages > 1 && <Pagination currentPage={page} totalPages={totalPages} />}
      </main>
      <Footer />
    </>
  );
}
