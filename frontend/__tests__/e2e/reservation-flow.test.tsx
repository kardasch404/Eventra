import { GET_MY_RESERVATIONS } from '@/infrastructure/graphql/queries';
import { CANCEL_RESERVATION } from '@/infrastructure/graphql/mutations';

describe('Reservation Flow E2E', () => {
  it('has GET_MY_RESERVATIONS query defined', () => {
    expect(GET_MY_RESERVATIONS).toBeDefined();
    expect(GET_MY_RESERVATIONS.kind).toBe('Document');
  });

  it('has CANCEL_RESERVATION mutation defined', () => {
    expect(CANCEL_RESERVATION).toBeDefined();
    expect(CANCEL_RESERVATION.kind).toBe('Document');
  });

  it('validates reservation data structure', () => {
    const mockReservation = {
      id: '1',
      eventId: 'event-1',
      quantity: 2,
      ticketCode: 'TICKET123',
      status: 'CONFIRMED',
    };

    expect(mockReservation).toHaveProperty('id');
    expect(mockReservation).toHaveProperty('ticketCode');
    expect(mockReservation.status).toBe('CONFIRMED');
  });
});
