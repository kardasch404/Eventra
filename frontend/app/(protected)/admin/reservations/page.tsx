'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_ALL_RESERVATIONS } from '@/infrastructure/graphql/queries/admin.queries';
import { CONFIRM_RESERVATION, REFUSE_RESERVATION, CANCEL_RESERVATION } from '@/infrastructure/graphql/mutations';

interface Reservation {
  id: string;
  eventId: string;
  userId: string;
  quantity: number;
  status: string;
  ticketCode: string;
  confirmedAt?: string;
  canceledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ReservationsManagementPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const { data, loading, error, refetch } = useQuery(GET_ALL_RESERVATIONS);

  const [confirmReservation] = useMutation(CONFIRM_RESERVATION, {
    onCompleted: () => refetch(),
  });

  const [refuseReservation] = useMutation(REFUSE_RESERVATION, {
    onCompleted: () => refetch(),
  });

  const [cancelReservation] = useMutation(CANCEL_RESERVATION, {
    onCompleted: () => refetch(),
  });

  const handleConfirm = async (id: string) => {
    if (confirm('Confirm this reservation?')) {
      await confirmReservation({ variables: { id } });
    }
  };

  const handleRefuse = async (id: string) => {
    if (confirm('Refuse this reservation?')) {
      await refuseReservation({ variables: { id } });
    }
  };

  const handleCancel = async (id: string) => {
    if (confirm('Cancel this reservation?')) {
      await cancelReservation({ variables: { id } });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-600 text-white';
      case 'CANCELED':
        return 'bg-red-600 text-white';
      case 'REFUSED':
        return 'bg-gray-600 text-white';
      case 'PENDING':
      default:
        return 'bg-yellow-600 text-white';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg">
        Error loading reservations: {error.message}
      </div>
    );
  }

  const allReservations: Reservation[] = data?.allReservations || [];
  const reservations = statusFilter
    ? allReservations.filter((r) => r.status === statusFilter)
    : allReservations;

  const statusCounts = {
    total: allReservations.length,
    PENDING: allReservations.filter((r) => r.status === 'PENDING').length,
    CONFIRMED: allReservations.filter((r) => r.status === 'CONFIRMED').length,
    CANCELED: allReservations.filter((r) => r.status === 'CANCELED').length,
    REFUSED: allReservations.filter((r) => r.status === 'REFUSED').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Reservations Management</h1>
          <p className="text-gray-400 mt-1">Manage all event reservations</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <button
          onClick={() => setStatusFilter('')}
          className={`p-4 rounded-lg text-center transition-colors ${
            statusFilter === '' ? 'bg-orange-600' : 'bg-[#2a2a2a] hover:bg-[#3a3a3a]'
          }`}
        >
          <div className="text-2xl font-bold text-white">{statusCounts.total}</div>
          <div className="text-sm text-gray-300">All</div>
        </button>
        <button
          onClick={() => setStatusFilter('PENDING')}
          className={`p-4 rounded-lg text-center transition-colors ${
            statusFilter === 'PENDING' ? 'bg-yellow-600' : 'bg-[#2a2a2a] hover:bg-[#3a3a3a]'
          }`}
        >
          <div className="text-2xl font-bold text-white">{statusCounts.PENDING}</div>
          <div className="text-sm text-gray-300">Pending</div>
        </button>
        <button
          onClick={() => setStatusFilter('CONFIRMED')}
          className={`p-4 rounded-lg text-center transition-colors ${
            statusFilter === 'CONFIRMED' ? 'bg-green-600' : 'bg-[#2a2a2a] hover:bg-[#3a3a3a]'
          }`}
        >
          <div className="text-2xl font-bold text-white">{statusCounts.CONFIRMED}</div>
          <div className="text-sm text-gray-300">Confirmed</div>
        </button>
        <button
          onClick={() => setStatusFilter('CANCELED')}
          className={`p-4 rounded-lg text-center transition-colors ${
            statusFilter === 'CANCELED' ? 'bg-red-600' : 'bg-[#2a2a2a] hover:bg-[#3a3a3a]'
          }`}
        >
          <div className="text-2xl font-bold text-white">{statusCounts.CANCELED}</div>
          <div className="text-sm text-gray-300">Canceled</div>
        </button>
        <button
          onClick={() => setStatusFilter('REFUSED')}
          className={`p-4 rounded-lg text-center transition-colors ${
            statusFilter === 'REFUSED' ? 'bg-gray-600' : 'bg-[#2a2a2a] hover:bg-[#3a3a3a]'
          }`}
        >
          <div className="text-2xl font-bold text-white">{statusCounts.REFUSED}</div>
          <div className="text-sm text-gray-300">Refused</div>
        </button>
      </div>

      {/* Reservations Table */}
      <div className="bg-[#2a2a2a] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#1a1a1a]">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Ticket Code</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Event ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">User ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Qty</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Created</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {reservations.map((reservation) => (
              <tr key={reservation.id} className="hover:bg-[#3a3a3a] transition-colors">
                <td className="px-6 py-4">
                  <span className="font-mono text-orange-400">{reservation.ticketCode}</span>
                </td>
                <td className="px-6 py-4 text-gray-300 text-sm">
                  {reservation.eventId.slice(0, 8)}...
                </td>
                <td className="px-6 py-4 text-gray-300 text-sm">
                  {reservation.userId.slice(0, 8)}...
                </td>
                <td className="px-6 py-4 text-white font-medium">{reservation.quantity}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusBadge(reservation.status)}`}>
                    {reservation.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-400 text-sm">
                  {new Date(reservation.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    {reservation.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleConfirm(reservation.id)}
                          className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleRefuse(reservation.id)}
                          className="px-3 py-1 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
                        >
                          Refuse
                        </button>
                      </>
                    )}
                    {reservation.status === 'CONFIRMED' && (
                      <button
                        onClick={() => handleCancel(reservation.id)}
                        className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                    {(reservation.status === 'CANCELED' || reservation.status === 'REFUSED') && (
                      <span className="text-gray-500 text-sm">No actions</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {reservations.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No reservations found {statusFilter && `with status "${statusFilter}"`}
          </div>
        )}
      </div>
    </div>
  );
}
