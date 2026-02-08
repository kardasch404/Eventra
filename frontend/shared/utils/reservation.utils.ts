'use client';

export function canCancelReservation(status: string, hasPermission: boolean): boolean {
  return hasPermission && status !== 'CANCELED';
}

export function getReservationStatusColor(status: string): string {
  switch (status) {
    case 'CONFIRMED':
      return 'bg-green-100 text-green-800';
    case 'CANCELED':
      return 'bg-red-100 text-red-800';
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}
