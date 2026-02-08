'use client';

import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_RESERVATIONS } from '@/infrastructure/graphql/queries';
import { CONFIRM_RESERVATION, REFUSE_RESERVATION } from '@/infrastructure/graphql/mutations';
import { Button } from '@/presentation/components/ui';

export default function AdminReservationsPage() {
  const { data, loading, refetch } = useQuery(GET_ALL_RESERVATIONS);
  const [confirmReservation] = useMutation(CONFIRM_RESERVATION);
  const [refuseReservation] = useMutation(REFUSE_RESERVATION);

  const handleConfirm = async (id: string) => {
    try {
      await confirmReservation({ variables: { id } });
      refetch();
    } catch (error) {
      console.error('Error confirming reservation:', error);
    }
  };

  const handleRefuse = async (id: string) => {
    try {
      await refuseReservation({ variables: { id } });
      refetch();
    } catch (error) {
      console.error('Error refusing reservation:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  const reservations = data?.allReservations || [];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-3xl font-bold mb-6">Reservations Management</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticket Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reservations.map((reservation: any) => (
              <tr key={reservation.id}>
                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{reservation.ticketCode}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{reservation.userId.slice(0, 8)}...</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{reservation.eventId.slice(0, 8)}...</td>
                <td className="px-6 py-4 whitespace-nowrap">{reservation.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded ${
                    reservation.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                    reservation.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    reservation.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {reservation.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  {reservation.status === 'PENDING' && (
                    <>
                      <Button onClick={() => handleConfirm(reservation.id)} variant="primary" size="sm">
                        Confirm
                      </Button>
                      <Button onClick={() => handleRefuse(reservation.id)} variant="danger" size="sm">
                        Refuse
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
