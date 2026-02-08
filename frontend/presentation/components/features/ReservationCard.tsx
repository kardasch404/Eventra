'use client';

import { useMutation } from '@apollo/client';
import { CANCEL_RESERVATION } from '@/infrastructure/graphql/mutations';
import { usePermission } from '@/presentation/hooks';
import { Button } from '@/presentation/components/ui';
import { Card } from '@/presentation/components/ui';
import { useState } from 'react';

interface Reservation {
  id: string;
  eventId: string;
  quantity: number;
  ticketCode: string;
  status: string;
  confirmedAt?: string;
  canceledAt?: string;
  createdAt: string;
}

interface ReservationCardProps {
  reservation: Reservation;
  onCanceled?: () => void;
}

export function ReservationCard({ reservation, onCanceled }: ReservationCardProps) {
  const canCancel = usePermission('reservation:cancel');
  const [cancelReservation, { loading }] = useMutation(CANCEL_RESERVATION);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this reservation?')) return;

    try {
      await cancelReservation({ variables: { id: reservation.id } });
      onCanceled?.();
    } catch (error) {
      alert('Failed to cancel reservation');
    }
  };

  const downloadPDF = () => {
    alert('PDF download functionality will be implemented');
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">Event ID: {reservation.eventId}</h3>
          <p className="text-gray-600">Ticket Code: {reservation.ticketCode}</p>
          <p className="text-gray-600">Quantity: {reservation.quantity}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            reservation.status === 'CONFIRMED'
              ? 'bg-green-100 text-green-800'
              : reservation.status === 'CANCELED'
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {reservation.status}
        </span>
      </div>

      <div className="flex gap-2">
        {reservation.status === 'CONFIRMED' && (
          <Button onClick={downloadPDF}>Download Ticket</Button>
        )}

        {canCancel && reservation.status !== 'CANCELED' ? (
          <Button variant="danger" onClick={handleCancel} disabled={loading}>
            {loading ? 'Canceling...' : 'Cancel Reservation'}
          </Button>
        ) : (
          <div className="relative">
            <Button
              disabled
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              Cancel Reservation
            </Button>
            {showTooltip && (
              <div className="absolute bottom-full mb-2 left-0 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                You don't have permission to cancel
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
