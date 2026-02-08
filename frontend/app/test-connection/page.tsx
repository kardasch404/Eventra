'use client';

import { useQuery } from '@apollo/client';
import { GET_EVENTS } from '@/infrastructure/graphql/queries';

export default function TestConnection() {
  const { data, loading, error } = useQuery(GET_EVENTS, {
    variables: {
      pagination: { page: 1, limit: 10 },
    },
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">GraphQL Connection Test</h1>
      <div className="bg-green-100 p-4 rounded">
        <p className="text-green-800">✓ Connected to GraphQL API</p>
        <p className="text-sm mt-2">Events found: {data?.getEvents?.total || 0}</p>
      </div>
      {data?.getEvents?.events?.length > 0 && (
        <div className="mt-4">
          <h2 className="font-semibold mb-2">Events:</h2>
          <ul className="space-y-2">
            {data.getEvents.events.map((event: any) => (
              <li key={event.id} className="border p-2 rounded">
                {event.title} - {event.status}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
