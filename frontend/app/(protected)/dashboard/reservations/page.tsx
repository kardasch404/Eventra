'use client';

import { useQuery } from '@apollo/client/react';
import { GET_MY_RESERVATIONS } from '@/infrastructure/graphql/queries';
import { ReservationCard } from '@/presentation/components/features/ReservationCard';
import { ReservationCardSkeleton } from '@/presentation/components/ui';

export default function MyReservationsPage() {
  const { data, loading, error, refetch } = useQuery(GET_MY_RESERVATIONS);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold mb-6">My Reservations</h1>
        <div className="space-y-4">
          <ReservationCardSkeleton />
          <ReservationCardSkeleton />
          <ReservationCardSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold mb-4">My Reservations</h1>
        <p className="text-red-600">Error loading reservations: {error.message}</p>
      </div>
    );
  }

  const reservations = data?.myReservations || [];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-3xl font-bold mb-6">My Reservations</h1>

      {reservations.length === 0 ? (
        <p className="text-gray-600">You don't have any reservations yet.</p>
      ) : (
        <div className="space-y-4">
          {reservations.map((reservation: any) => (
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
              onCanceled={() => refetch()}
            />
          ))}
        </div>
      )}
    </div>
  );
}
