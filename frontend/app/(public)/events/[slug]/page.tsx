import { notFound } from 'next/navigation';
import { getServerClient } from '@/infrastructure/graphql/apollo-client-ssr';
import { GET_EVENT_BY_SLUG } from '@/infrastructure/graphql/queries';
import { Navbar, Footer } from '@/presentation/components/layouts';
import { Button } from '@/presentation/components/ui';

export default async function EventDetailPage({ params }: { params: { slug: string } }) {
  const client = getServerClient();

  try {
    const { data } = await client.query({
      query: GET_EVENT_BY_SLUG,
      variables: { slug: params.slug },
    });

    const event = data?.getEventBySlug;
    if (!event) return notFound();

    const availableSeats = event.maxAttendees - event.currentAttendees;
    const isFull = availableSeats <= 0;

    return (
      <>
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8">
          {event.heroImage && (
            <img
              src={event.heroImage.url}
              alt={event.heroImage.alt}
              className="w-full h-96 object-cover rounded-lg mb-8"
            />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
              
              <div className="flex items-center gap-4 mb-6 text-gray-600">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{new Date(event.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{event.location.city}, {event.location.country}</span>
                </div>
              </div>

              <div className="prose max-w-none mb-8">
                <h2 className="text-2xl font-semibold mb-4">About this event</h2>
                <p className="text-gray-700">{event.description}</p>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white border rounded-lg p-6 sticky top-4">
                <div className="mb-6">
                  <div className="text-sm text-gray-600 mb-2">Availability</div>
                  <div className="text-2xl font-bold mb-1">
                    {availableSeats} / {event.maxAttendees}
                  </div>
                  <div className="text-sm text-gray-600">seats available</div>
                </div>

                <div className="mb-6">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(event.currentAttendees / event.maxAttendees) * 100}%` }}
                    />
                  </div>
                </div>

                <Button
                  className="w-full"
                  disabled={isFull || event.status !== 'PUBLISHED'}
                >
                  {isFull ? 'Event Full' : event.status !== 'PUBLISHED' ? 'Not Available' : 'Reserve Ticket'}
                </Button>

                {event.location.address && (
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="font-semibold mb-2">Location</h3>
                    <p className="text-sm text-gray-600">{event.location.address}</p>
                    <p className="text-sm text-gray-600">{event.location.city}, {event.location.country}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  } catch (error) {
    return notFound();
  }
}
