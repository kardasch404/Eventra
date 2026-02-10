import { getServerClient } from '@/infrastructure/graphql/apollo-client-ssr';
import { GET_EVENTS } from '@/infrastructure/graphql/queries';
import { Navbar, Footer } from '@/presentation/components/layouts';
import { EventsPageClient } from '@/presentation/components/features/EventsPageClient';

interface SearchParams {
  search?: string;
  category?: string;
  city?: string;
  type?: string;
  page?: string;
}

export default async function EventsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const client = getServerClient();
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const limit = 20;

  // Fetch all published events
  const { data } = await client.query({
    query: GET_EVENTS,
    variables: {
      filters: {
        category: params.category,
        type: params.type,
        status: 'PUBLISHED',
      },
    },
  });

  // Get all events from GraphQL response
  let allEvents = (data?.events as any)?.events || [];
  
  // Smart search: filter by search term OR city (matches event name, description, or location)
  if (params.search || params.city) {
    const searchTerm = (params.search || params.city || '').trim().toLowerCase();
    
    allEvents = allEvents.filter((event: { 
      title?: string; 
      description?: string | { text?: string; content?: string };
      summary?: string;
      location?: { city?: string; country?: string; venue?: string; address?: string };
    }) => {
      const matchesTitle = event.title?.toLowerCase().includes(searchTerm);
      
      // Handle description - it might be a string, object, or null
      const descriptionStr = typeof event.description === 'string' 
        ? event.description 
        : event.description?.text || event.description?.content || '';
      const matchesDescription = descriptionStr.toLowerCase().includes(searchTerm);
      
      const matchesSummary = event.summary?.toLowerCase().includes(searchTerm);
      const matchesCity = event.location?.city?.toLowerCase().includes(searchTerm);
      const matchesCountry = event.location?.country?.toLowerCase().includes(searchTerm);
      const matchesVenue = event.location?.venue?.toLowerCase().includes(searchTerm);
      const matchesAddress = event.location?.address?.toLowerCase().includes(searchTerm);
      
      return matchesTitle || matchesDescription || matchesSummary || matchesCity || matchesCountry || matchesVenue || matchesAddress;
    });
  }

  const events = allEvents;
  const total = events.length;
  const totalPages = Math.ceil(total / limit);

  return (
    <>
      <Navbar />
      <EventsPageClient events={events} total={total} totalPages={totalPages} currentPage={page} />
      <Footer />
    </>
  );
}
