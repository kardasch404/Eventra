'use client';

import { useQuery } from '@apollo/client';
import { GET_ALL_RESERVATIONS } from '@/infrastructure/graphql/queries';

export default function ReservationsManagementPage() {
  const { data, loading } = useQuery(GET_ALL_RESERVATIONS);

  if (loading) return <div>Loading...</div>;

  const reservations = data?.allReservations || [];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Reservations Management</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticket Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reservations.map((reservation: any) => (
              <tr key={reservation.id}>
                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{reservation.ticketCode}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{reservation.eventId}</td>
                <td className="px-6 py-4 whitespace-nowrap">{reservation.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded ${
                    reservation.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                    reservation.status === 'CANCELED' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {reservation.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(reservation.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
