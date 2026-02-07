import { ReservationResolver } from '@presentation/graphql/resolvers/reservation.resolver';
import { CreateReservationUseCase } from '@application/use-cases/reservations/create-reservation.use-case';
import { ConfirmReservationUseCase } from '@application/use-cases/reservations/confirm-reservation.use-case';
import { RefuseReservationUseCase } from '@application/use-cases/reservations/refuse-reservation.use-case';
import { CancelReservationUseCase } from '@application/use-cases/reservations/cancel-reservation.use-case';
import { GetMyReservationsUseCase } from '@application/use-cases/reservations/get-my-reservations.use-case';
import { IReservationRepository } from '@core/interfaces/reservation.repository.interface';
import { Reservation } from '@core/entities/reservation.entity';
import { ReservationStatus } from '@shared/enums/reservation-status.enum';

describe('ReservationResolver', () => {
  let resolver: ReservationResolver;
  let mockCreateReservationUseCase: jest.Mocked<CreateReservationUseCase>;
  let mockConfirmReservationUseCase: jest.Mocked<ConfirmReservationUseCase>;
  let mockRefuseReservationUseCase: jest.Mocked<RefuseReservationUseCase>;
  let mockCancelReservationUseCase: jest.Mocked<CancelReservationUseCase>;
  let mockGetMyReservationsUseCase: jest.Mocked<GetMyReservationsUseCase>;
  let mockReservationRepository: jest.Mocked<IReservationRepository>;

  beforeEach(() => {
    mockCreateReservationUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CreateReservationUseCase>;

    mockConfirmReservationUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<ConfirmReservationUseCase>;

    mockRefuseReservationUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<RefuseReservationUseCase>;

    mockCancelReservationUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CancelReservationUseCase>;

    mockGetMyReservationsUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<GetMyReservationsUseCase>;

    mockReservationRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByTicketCode: jest.fn(),
      findByUserId: jest.fn(),
      findByEventId: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      updateStatus: jest.fn(),
      delete: jest.fn(),
    };

    resolver = new ReservationResolver(
      mockCreateReservationUseCase,
      mockConfirmReservationUseCase,
      mockRefuseReservationUseCase,
      mockCancelReservationUseCase,
      mockGetMyReservationsUseCase,
      mockReservationRepository,
    );
  });

  describe('myReservations', () => {
    it('should return user reservations', async () => {
      const reservations = [
        new Reservation({
          id: 'res-1',
          eventId: 'event-1',
          userId: 'user-1',
          quantity: 2,
          status: ReservationStatus.CONFIRMED,
          ticketCode: 'TKT-123',
        }),
      ];

      mockGetMyReservationsUseCase.execute.mockResolvedValue(reservations);

      const result = await resolver.myReservations({ userId: 'user-1' });

      expect(result).toHaveLength(1);
      expect(result[0].userId).toBe('user-1');
    });
  });

  describe('allReservations', () => {
    it('should return all reservations', async () => {
      const reservations = [
        new Reservation({
          id: 'res-1',
          eventId: 'event-1',
          userId: 'user-1',
          quantity: 2,
          status: ReservationStatus.CONFIRMED,
          ticketCode: 'TKT-123',
        }),
        new Reservation({
          id: 'res-2',
          eventId: 'event-2',
          userId: 'user-2',
          quantity: 1,
          status: ReservationStatus.PENDING,
          ticketCode: 'TKT-456',
        }),
      ];

      mockReservationRepository.findAll.mockResolvedValue(reservations);

      const result = await resolver.allReservations();

      expect(result).toHaveLength(2);
    });
  });

  describe('reservation', () => {
    it('should return reservation by id', async () => {
      const reservation = new Reservation({
        id: 'res-1',
        eventId: 'event-1',
        userId: 'user-1',
        quantity: 2,
        status: ReservationStatus.CONFIRMED,
        ticketCode: 'TKT-123',
      });

      mockReservationRepository.findById.mockResolvedValue(reservation);

      const result = await resolver.reservation('res-1');

      expect(result).toBeDefined();
      expect(result?.id).toBe('res-1');
    });

    it('should return null if reservation not found', async () => {
      mockReservationRepository.findById.mockResolvedValue(null);

      const result = await resolver.reservation('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('createReservation', () => {
    it('should create reservation', async () => {
      const input = { eventId: 'event-1', quantity: 2 };
      const reservation = new Reservation({
        id: 'res-1',
        eventId: input.eventId,
        userId: 'user-1',
        quantity: input.quantity,
        status: ReservationStatus.PENDING,
        ticketCode: 'TKT-123',
      });

      mockCreateReservationUseCase.execute.mockResolvedValue(reservation);

      const result = await resolver.createReservation(input, { userId: 'user-1' });

      expect(result.status).toBe(ReservationStatus.PENDING);
      expect(mockCreateReservationUseCase.execute).toHaveBeenCalled();
    });
  });

  describe('confirmReservation', () => {
    it('should confirm reservation', async () => {
      const reservation = new Reservation({
        id: 'res-1',
        eventId: 'event-1',
        userId: 'user-1',
        quantity: 2,
        status: ReservationStatus.CONFIRMED,
        ticketCode: 'TKT-123',
      });

      mockConfirmReservationUseCase.execute.mockResolvedValue(reservation);

      const result = await resolver.confirmReservation('res-1');

      expect(result.status).toBe(ReservationStatus.CONFIRMED);
    });
  });

  describe('refuseReservation', () => {
    it('should refuse reservation', async () => {
      const reservation = new Reservation({
        id: 'res-1',
        eventId: 'event-1',
        userId: 'user-1',
        quantity: 2,
        status: ReservationStatus.REFUSED,
        ticketCode: 'TKT-123',
      });

      mockRefuseReservationUseCase.execute.mockResolvedValue(reservation);

      const result = await resolver.refuseReservation('res-1');

      expect(result.status).toBe(ReservationStatus.REFUSED);
    });
  });

  describe('cancelReservation', () => {
    it('should cancel reservation', async () => {
      const reservation = new Reservation({
        id: 'res-1',
        eventId: 'event-1',
        userId: 'user-1',
        quantity: 2,
        status: ReservationStatus.CANCELED,
        ticketCode: 'TKT-123',
      });

      mockCancelReservationUseCase.execute.mockResolvedValue(reservation);

      const result = await resolver.cancelReservation('res-1', { userId: 'user-1' });

      expect(result.status).toBe(ReservationStatus.CANCELED);
    });
  });
});
