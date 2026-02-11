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
  const limit = 7; // Events per page

  // Fetch all published events (with high limit to get all events)
  const { data } = await client.query({
    query: GET_EVENTS,
    variables: {
      filters: {
        category: params.category,
        type: params.type,
        status: 'PUBLISHED',
        limit: 1000, // Fetch up to 1000 events to ensure we get all
        page: 1,
      },
    },
  });

  // Get all events from GraphQL response
  let allEvents = (data?.events as any)?.events || [];
  
  console.log('=== EVENTS PAGE DEBUG ===');
  console.log('Total events from GraphQL:', allEvents.length);
  console.log('URL Params:', { city: params.city, category: params.category, search: params.search });
  console.log('All unique cities in events:', [...new Set(allEvents.map((e: any) => e.location?.city))]);
  
  // Filter by city if specified (case-insensitive match)
  if (params.city) {
    const cityFilter = params.city.trim().toLowerCase();
    console.log('Filtering by city:', cityFilter);
    const beforeFilter = allEvents.length;
    allEvents = allEvents.filter((event: any) => {
      const eventCity = event.location?.city?.toLowerCase();
      const matches = eventCity === cityFilter;
      if (!matches && beforeFilter < 5) {
        console.log(`Event city "${eventCity}" does not match filter "${cityFilter}"`);
      }
      return matches;
    });
    console.log('Events after city filter:', allEvents.length);
  }
  
  // Smart search: filter by search term (matches event name, description, or location)
  if (params.search) {
    const searchTerm = params.search.trim().toLowerCase();
    
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

  // Calculate pagination
  const total = allEvents.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  // Slice events for current page
  const events = allEvents.slice(startIndex, endIndex);

  return (
    <>
      <Navbar />
      <EventsPageClient events={events} total={total} totalPages={totalPages} currentPage={page} />
      <Footer />
    </>
  );
}
