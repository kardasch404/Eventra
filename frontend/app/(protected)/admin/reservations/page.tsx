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

  if (loading) return <div className="text-white">Loading...</div>;

  const reservations = data?.allReservations || [];

  return (
    <div className="bg-[#2a2a2a] rounded-lg border border-gray-800">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-3xl font-bold text-white">Reservations Management</h1>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#1a1a1a]">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Ticket Code
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                User ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Event ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {reservations.map((reservation: { id: string; ticketCode: string; userId: string; eventId: string; quantity: number; status: string }) => (
              <tr key={reservation.id} className="hover:bg-[#1a1a1a]">
                <td className="px-6 py-4 font-mono text-sm text-orange-400">{reservation.ticketCode}</td>
                <td className="px-6 py-4 text-sm text-gray-300">{reservation.userId.slice(0, 8)}...</td>
                <td className="px-6 py-4 text-sm text-gray-300">{reservation.eventId.slice(0, 8)}...</td>
                <td className="px-6 py-4 text-gray-300">{reservation.quantity}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      reservation.status === 'CONFIRMED'
                        ? 'bg-green-900/30 text-green-400'
                        : reservation.status === 'PENDING'
                          ? 'bg-yellow-900/30 text-yellow-400'
                          : reservation.status === 'CANCELLED'
                            ? 'bg-red-900/30 text-red-400'
                            : 'bg-gray-900/30 text-gray-400'
                    }`}
                  >
                    {reservation.status}
                  </span>
                </td>
                <td className="px-6 py-4 space-x-2">
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
