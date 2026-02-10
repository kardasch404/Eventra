'use client';

import { useQuery, useMutation } from '@apollo/client/react';
import { GET_MY_RESERVATIONS } from '@/infrastructure/graphql/queries';
import { CANCEL_RESERVATION } from '@/infrastructure/graphql/mutations';

export function useReservations() {
  const { data, loading, error, refetch } = useQuery(GET_MY_RESERVATIONS);
  const [cancelReservation, { loading: canceling }] = useMutation(CANCEL_RESERVATION);

  const cancel = async (id: string) => {
    await cancelReservation({ variables: { id } });
    await refetch();
  };

  return {
    reservations: data?.myReservations || [],
    loading,
    error,
    cancel,
    canceling,
    refetch,
  };
}
