import { CreateReservationUseCase } from '@application/use-cases/reservations/create-reservation.use-case';
import { ConfirmReservationUseCase } from '@application/use-cases/reservations/confirm-reservation.use-case';
import { RefuseReservationUseCase } from '@application/use-cases/reservations/refuse-reservation.use-case';
import { CancelReservationUseCase } from '@application/use-cases/reservations/cancel-reservation.use-case';
import { GetMyReservationsUseCase } from '@application/use-cases/reservations/get-my-reservations.use-case';
import { IReservationRepository } from '@core/interfaces/reservation.repository.interface';
import { IEventRepository } from '@core/interfaces/event.repository.interface';
import { IUserRepository } from '@core/interfaces/user.repository.interface';
import { Reservation } from '@core/entities/reservation.entity';
import { Event } from '@core/entities/event.entity';
import { User } from '@core/entities/user.entity';
import { UuidService } from '@infrastructure/services/uuid.service';
import { ReservationStatus } from '@shared/enums/reservation-status.enum';
import { EventStatus } from '@shared/enums/event-status.enum';
import { EventType } from '@shared/enums/event-type.enum';
import { DateTime } from '@core/value-objects/date-time.vo';
import { HeroImage } from '@core/value-objects/hero-image.vo';
import { Location } from '@core/value-objects/location.vo';

describe('Reservation Use Cases', () => {
  let mockReservationRepository: jest.Mocked<IReservationRepository>;
  let mockEventRepository: jest.Mocked<IEventRepository>;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockUuidService: jest.Mocked<UuidService>;

  beforeEach(() => {
    mockReservationRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByTicketCode: jest.fn(),
      findByUserId: jest.fn(),
      findByEventId: jest.fn(),
      update: jest.fn(),
      updateStatus: jest.fn(),
      delete: jest.fn(),
    };

    mockEventRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findBySlug: jest.fn(),
      findAll: jest.fn(),
      findWithFilters: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      incrementBookedCount: jest.fn(),
      decrementBookedCount: jest.fn(),
    };

    mockUserRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockUuidService = {
      generate: jest.fn(),
    } as unknown as jest.Mocked<UuidService>;
  });

  describe('CreateReservationUseCase', () => {
    let useCase: CreateReservationUseCase;

    beforeEach(() => {
      useCase = new CreateReservationUseCase(
        mockReservationRepository,
        mockEventRepository,
        mockUuidService,
      );
    });

    it('should create reservation successfully', async () => {
      const event = new Event({
        id: 'event-1',
        title: 'Test Event',
        slug: 'test-event',
        summary: 'Summary',
        description: ['Description'],
        category: 'Tech',
        type: EventType.ONLINE,
        status: EventStatus.PUBLISHED,
        hero: new HeroImage({ url: 'https://example.com/image.jpg', alt: 'Hero' }),
        dateTime: new DateTime({
          start: new Date('2024-12-01'),
          end: new Date('2024-12-02'),
          timezone: 'UTC',
        }),
        location: new Location({ country: 'US', city: 'NYC' }),
        capacity: 100,
        bookedCount: 50,
        organizerId: 'user-1',
        highlights: [],
      });

      mockEventRepository.findById.mockResolvedValue(event);
      mockReservationRepository.findByUserId.mockResolvedValue([]);
      mockUuidService.generate.mockReturnValue('reservation-1');
      mockReservationRepository.create.mockResolvedValue(
        new Reservation({
          id: 'reservation-1',
          eventId: 'event-1',
          userId: 'user-1',
          quantity: 2,
          status: ReservationStatus.PENDING,
          ticketCode: 'TKT-123',
        }),
      );

      const result = await useCase.execute({ eventId: 'event-1', quantity: 2 }, 'user-1');

      expect(result.status).toBe(ReservationStatus.PENDING);
      expect(mockEventRepository.incrementBookedCount).toHaveBeenCalledWith('event-1', 2);
    });

    it('should throw error if event not found', async () => {
      mockEventRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute({ eventId: 'event-1', quantity: 2 }, 'user-1')).rejects.toThrow(
        'Event not found',
      );
    });

    it('should throw error if event is not published', async () => {
      const event = new Event({
        id: 'event-1',
        status: EventStatus.DRAFT,
        capacity: 100,
        bookedCount: 0,
      });

      mockEventRepository.findById.mockResolvedValue(event);

      await expect(useCase.execute({ eventId: 'event-1', quantity: 2 }, 'user-1')).rejects.toThrow(
        'Event is not published',
      );
    });

    it('should throw error if event is full', async () => {
      const event = new Event({
        id: 'event-1',
        status: EventStatus.PUBLISHED,
        capacity: 100,
        bookedCount: 99,
      });

      mockEventRepository.findById.mockResolvedValue(event);

      await expect(useCase.execute({ eventId: 'event-1', quantity: 2 }, 'user-1')).rejects.toThrow(
        'Event is full',
      );
    });

    it('should throw error if user has active reservation', async () => {
      const event = new Event({
        id: 'event-1',
        status: EventStatus.PUBLISHED,
        capacity: 100,
        bookedCount: 50,
      });

      const existingReservation = new Reservation({
        id: 'res-1',
        eventId: 'event-1',
        userId: 'user-1',
        quantity: 1,
        status: ReservationStatus.PENDING,
        ticketCode: 'TKT-123',
      });

      mockEventRepository.findById.mockResolvedValue(event);
      mockReservationRepository.findByUserId.mockResolvedValue([existingReservation]);

      await expect(useCase.execute({ eventId: 'event-1', quantity: 2 }, 'user-1')).rejects.toThrow(
        'User already has an active reservation for this event',
      );
    });
  });

  describe('ConfirmReservationUseCase', () => {
    let useCase: ConfirmReservationUseCase;

    beforeEach(() => {
      useCase = new ConfirmReservationUseCase(mockReservationRepository);
    });

    it('should confirm pending reservation', async () => {
      const reservation = new Reservation({
        id: 'res-1',
        eventId: 'event-1',
        userId: 'user-1',
        quantity: 2,
        status: ReservationStatus.PENDING,
        ticketCode: 'TKT-123',
      });

      mockReservationRepository.findById.mockResolvedValue(reservation);
      mockReservationRepository.update.mockResolvedValue(
        new Reservation({ ...reservation, status: ReservationStatus.CONFIRMED }),
      );

      const result = await useCase.execute('res-1');

      expect(result.status).toBe(ReservationStatus.CONFIRMED);
    });

    it('should throw error if reservation not found', async () => {
      mockReservationRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute('res-1')).rejects.toThrow('Reservation not found');
    });

    it('should throw error if reservation is not pending', async () => {
      const reservation = new Reservation({
        id: 'res-1',
        status: ReservationStatus.CONFIRMED,
      });

      mockReservationRepository.findById.mockResolvedValue(reservation);

      await expect(useCase.execute('res-1')).rejects.toThrow(
        'Only pending reservations can be confirmed',
      );
    });
  });

  describe('RefuseReservationUseCase', () => {
    let useCase: RefuseReservationUseCase;

    beforeEach(() => {
      useCase = new RefuseReservationUseCase(mockReservationRepository, mockEventRepository);
    });

    it('should refuse pending reservation', async () => {
      const reservation = new Reservation({
        id: 'res-1',
        eventId: 'event-1',
        userId: 'user-1',
        quantity: 2,
        status: ReservationStatus.PENDING,
        ticketCode: 'TKT-123',
      });

      mockReservationRepository.findById.mockResolvedValue(reservation);
      mockReservationRepository.update.mockResolvedValue(
        new Reservation({ ...reservation, status: ReservationStatus.REFUSED }),
      );

      const result = await useCase.execute('res-1');

      expect(result.status).toBe(ReservationStatus.REFUSED);
      expect(mockEventRepository.decrementBookedCount).toHaveBeenCalledWith('event-1', 2);
    });

    it('should throw error if reservation not found', async () => {
      mockReservationRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute('res-1')).rejects.toThrow('Reservation not found');
    });
  });

  describe('CancelReservationUseCase', () => {
    let useCase: CancelReservationUseCase;

    beforeEach(() => {
      useCase = new CancelReservationUseCase(
        mockReservationRepository,
        mockEventRepository,
        mockUserRepository,
      );
    });

    it('should cancel reservation with permission', async () => {
      const reservation = new Reservation({
        id: 'res-1',
        eventId: 'event-1',
        userId: 'user-1',
        quantity: 2,
        status: ReservationStatus.CONFIRMED,
        ticketCode: 'TKT-123',
      });

      const user = new User({ id: 'user-1', email: 'test@example.com' });

      mockReservationRepository.findById.mockResolvedValue(reservation);
      mockUserRepository.findById.mockResolvedValue(user);
      mockReservationRepository.update.mockResolvedValue(
        new Reservation({ ...reservation, status: ReservationStatus.CANCELED }),
      );

      const result = await useCase.execute('res-1', 'user-1');

      expect(result.status).toBe(ReservationStatus.CANCELED);
      expect(mockEventRepository.decrementBookedCount).toHaveBeenCalledWith('event-1', 2);
    });

    it('should throw error if reservation not found', async () => {
      mockReservationRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute('res-1', 'user-1')).rejects.toThrow('Reservation not found');
    });

    it('should throw error if reservation does not belong to user', async () => {
      const reservation = new Reservation({
        id: 'res-1',
        userId: 'user-2',
      });

      mockReservationRepository.findById.mockResolvedValue(reservation);

      await expect(useCase.execute('res-1', 'user-1')).rejects.toThrow(
        'Reservation does not belong to user',
      );
    });
  });

  describe('GetMyReservationsUseCase', () => {
    let useCase: GetMyReservationsUseCase;

    beforeEach(() => {
      useCase = new GetMyReservationsUseCase(mockReservationRepository);
    });

    it('should get user reservations', async () => {
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
          userId: 'user-1',
          quantity: 1,
          status: ReservationStatus.PENDING,
          ticketCode: 'TKT-456',
        }),
      ];

      mockReservationRepository.findByUserId.mockResolvedValue(reservations);

      const result = await useCase.execute('user-1');

      expect(result).toHaveLength(2);
      expect(result[0].userId).toBe('user-1');
    });
  });
});
