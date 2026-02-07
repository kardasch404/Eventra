import Link from 'next/link';
import { getServerClient } from '@/infrastructure/graphql/apollo-client-ssr';
import { GET_EVENTS } from '@/infrastructure/graphql/queries';
import { Button } from '@/presentation/components/ui';
import { Navbar, Footer } from '@/presentation/components/layouts';

export default async function HomePage() {
  const client = getServerClient();
  
  const { data } = await client.query({
    query: GET_EVENTS,
    variables: {
      filters: { status: 'PUBLISHED' },
      pagination: { page: 1, limit: 6 },
    },
  });

  const events = data?.getEvents?.events || [];

  return (
    <>
      <Navbar />
      <main>
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">Discover Amazing Events</h1>
            <p className="text-xl mb-8">Find and book tickets for the best events in your area</p>
            <Link href="/events">
              <Button size="lg">Browse Events</Button>
            </Link>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold mb-8">Featured Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event: any) => (
              <Link key={event.id} href={`/events/${event.slug}`} className="group">
                <div className="border rounded-lg overflow-hidden hover:shadow-lg transition">
                  {event.heroImage && (
                    <img src={event.heroImage.url} alt={event.heroImage.alt} className="w-full h-48 object-cover" />
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600">{event.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{event.location.city}, {event.location.country}</p>
                    <p className="text-sm text-gray-500">{new Date(event.startDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
