import { CreateEventUseCase } from '@application/use-cases/events/create-event.use-case';
import { UpdateEventUseCase } from '@application/use-cases/events/update-event.use-case';
import { PublishEventUseCase } from '@application/use-cases/events/publish-event.use-case';
import { CancelEventUseCase } from '@application/use-cases/events/cancel-event.use-case';
import { GetEventsUseCase } from '@application/use-cases/events/get-events.use-case';
import { IEventRepository } from '@core/interfaces/event.repository.interface';
import { Event } from '@core/entities/event.entity';
import { UuidService } from '@infrastructure/services/uuid.service';
import { EventType } from '@shared/enums/event-type.enum';
import { EventStatus } from '@shared/enums/event-status.enum';
import { DateTime } from '@core/value-objects/date-time.vo';
import { HeroImage } from '@core/value-objects/hero-image.vo';
import { Location } from '@core/value-objects/location.vo';

describe('Event Use Cases', () => {
  let mockEventRepository: jest.Mocked<IEventRepository>;
  let mockUuidService: jest.Mocked<UuidService>;

  beforeEach(() => {
    mockEventRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findBySlug: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      incrementBookedCount: jest.fn(),
      decrementBookedCount: jest.fn(),
    };

    mockUuidService = {
      generate: jest.fn(),
    } as unknown as jest.Mocked<UuidService>;
  });

  describe('CreateEventUseCase', () => {
    let useCase: CreateEventUseCase;

    beforeEach(() => {
      useCase = new CreateEventUseCase(mockEventRepository, mockUuidService);
    });

    it('should create event with DRAFT status', async () => {
      const userId = 'user-123';
      const dto = {
        title: 'Test Event',
        summary: 'Summary',
        description: ['Description'],
        category: 'Tech',
        type: EventType.ONLINE,
        hero: new HeroImage({ url: 'https://example.com/image.jpg', alt: 'Hero' }),
        dateTime: new DateTime({ start: new Date('2024-12-01'), end: new Date('2024-12-02') }),
        location: new Location({ address: '123 Main St', city: 'City', country: 'Country' }),
        capacity: 100,
        highlights: [{ icon: 'icon', text: 'highlight' }],
      };

      mockUuidService.generate.mockReturnValue('event-123');
      mockEventRepository.create.mockResolvedValue(
        new Event({ id: 'event-123', ...dto, slug: 'test-event', organizerId: userId }),
      );

      const result = await useCase.execute(dto, userId);

      expect(mockUuidService.generate).toHaveBeenCalled();
      expect(mockEventRepository.create).toHaveBeenCalledWith(expect.any(Event));
      expect(result.status).toBe(EventStatus.DRAFT);
    });

    it('should throw error if end date is before start date', async () => {
      const dto = {
        title: 'Test Event',
        summary: 'Summary',
        description: ['Description'],
        category: 'Tech',
        type: EventType.ONLINE,
        hero: new HeroImage({ url: 'https://example.com/image.jpg', alt: 'Hero' }),
        dateTime: new DateTime({ start: new Date('2024-12-02'), end: new Date('2024-12-01') }),
        location: new Location({ address: '123 Main St', city: 'City', country: 'Country' }),
        capacity: 100,
        highlights: [],
      };

      await expect(useCase.execute(dto, 'user-123')).rejects.toThrow(
        'End date must be after start date',
      );
    });
  });

  describe('UpdateEventUseCase', () => {
    let useCase: UpdateEventUseCase;

    beforeEach(() => {
      useCase = new UpdateEventUseCase(mockEventRepository);
    });

    it('should update event successfully', async () => {
      const eventId = 'event-123';
      const userId = 'user-123';
      const existingEvent = new Event({
        id: eventId,
        organizerId: userId,
        title: 'Old Title',
        slug: 'old-title',
      });
      const dto = { title: 'New Title', summary: 'New Summary' };

      mockEventRepository.findById.mockResolvedValue(existingEvent);
      mockEventRepository.update.mockResolvedValue(
        new Event({ ...existingEvent, title: dto.title, slug: 'new-title', summary: dto.summary }),
      );

      const result = await useCase.execute(eventId, dto, userId);

      expect(mockEventRepository.findById).toHaveBeenCalledWith(eventId);
      expect(mockEventRepository.update).toHaveBeenCalledWith(eventId, expect.any(Object));
      expect(result.title).toBe(dto.title);
    });

    it('should throw error if event not found', async () => {
      mockEventRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute('event-123', {}, 'user-123')).rejects.toThrow('Event not found');
    });

    it('should throw error if user is not organizer', async () => {
      const event = new Event({ id: 'event-123', organizerId: 'other-user' });
      mockEventRepository.findById.mockResolvedValue(event);

      await expect(useCase.execute('event-123', {}, 'user-123')).rejects.toThrow(
        'Unauthorized to update this event',
      );
    });

    it('should throw error if end date is before start date', async () => {
      const event = new Event({ id: 'event-123', organizerId: 'user-123' });
      mockEventRepository.findById.mockResolvedValue(event);

      const dto = {
        dateTime: new DateTime({ start: new Date('2024-12-02'), end: new Date('2024-12-01') }),
      };

      await expect(useCase.execute('event-123', dto, 'user-123')).rejects.toThrow(
        'End date must be after start date',
      );
    });
  });

  describe('PublishEventUseCase', () => {
    let useCase: PublishEventUseCase;

    beforeEach(() => {
      useCase = new PublishEventUseCase(mockEventRepository);
    });

    it('should publish event successfully', async () => {
      const eventId = 'event-123';
      const userId = 'user-123';
      const event = new Event({ id: eventId, organizerId: userId, status: EventStatus.DRAFT });

      mockEventRepository.findById.mockResolvedValue(event);
      mockEventRepository.update.mockResolvedValue(
        new Event({ ...event, status: EventStatus.PUBLISHED }),
      );

      const result = await useCase.execute(eventId, userId);

      expect(mockEventRepository.findById).toHaveBeenCalledWith(eventId);
      expect(mockEventRepository.update).toHaveBeenCalledWith(eventId, expect.any(Object));
      expect(result.status).toBe(EventStatus.PUBLISHED);
    });

    it('should throw error if event not found', async () => {
      mockEventRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute('event-123', 'user-123')).rejects.toThrow('Event not found');
    });

    it('should throw error if user is not organizer', async () => {
      const event = new Event({ id: 'event-123', organizerId: 'other-user' });
      mockEventRepository.findById.mockResolvedValue(event);

      await expect(useCase.execute('event-123', 'user-123')).rejects.toThrow(
        'Unauthorized to publish this event',
      );
    });
  });

  describe('CancelEventUseCase', () => {
    let useCase: CancelEventUseCase;

    beforeEach(() => {
      useCase = new CancelEventUseCase(mockEventRepository);
    });

    it('should cancel event successfully', async () => {
      const eventId = 'event-123';
      const userId = 'user-123';
      const event = new Event({ id: eventId, organizerId: userId, status: EventStatus.PUBLISHED });

      mockEventRepository.findById.mockResolvedValue(event);
      mockEventRepository.update.mockResolvedValue(
        new Event({ ...event, status: EventStatus.CANCELED }),
      );

      const result = await useCase.execute(eventId, userId);

      expect(mockEventRepository.findById).toHaveBeenCalledWith(eventId);
      expect(mockEventRepository.update).toHaveBeenCalledWith(eventId, expect.any(Object));
      expect(result.status).toBe(EventStatus.CANCELED);
    });

    it('should throw error if event not found', async () => {
      mockEventRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute('event-123', 'user-123')).rejects.toThrow('Event not found');
    });

    it('should throw error if user is not organizer', async () => {
      const event = new Event({ id: 'event-123', organizerId: 'other-user' });
      mockEventRepository.findById.mockResolvedValue(event);

      await expect(useCase.execute('event-123', 'user-123')).rejects.toThrow(
        'Unauthorized to cancel this event',
      );
    });
  });

  describe('GetEventsUseCase', () => {
    let useCase: GetEventsUseCase;

    beforeEach(() => {
      useCase = new GetEventsUseCase(mockEventRepository);
    });

    it('should get all events without filters', async () => {
      const events = [
        new Event({ id: 'event-1', title: 'Event 1' }),
        new Event({ id: 'event-2', title: 'Event 2' }),
      ];
      mockEventRepository.findAll.mockResolvedValue(events);

      const result = await useCase.execute();

      expect(mockEventRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(events);
      expect(result).toHaveLength(2);
    });

    it('should get events with status filter', async () => {
      const events = [new Event({ id: 'event-1', status: EventStatus.PUBLISHED })];
      mockEventRepository.findAll.mockResolvedValue(events);

      const result = await useCase.execute({ status: EventStatus.PUBLISHED });

      expect(mockEventRepository.findAll).toHaveBeenCalledWith(expect.any(Object));
      expect(result).toEqual(events);
    });

    it('should get events with organizerId filter', async () => {
      const events = [new Event({ id: 'event-1', organizerId: 'user-123' })];
      mockEventRepository.findAll.mockResolvedValue(events);

      const result = await useCase.execute({ organizerId: 'user-123' });

      expect(mockEventRepository.findAll).toHaveBeenCalledWith(expect.any(Object));
      expect(result).toEqual(events);
    });

    it('should get events with multiple filters', async () => {
      const events = [
        new Event({ id: 'event-1', status: EventStatus.PUBLISHED, organizerId: 'user-123' }),
      ];
      mockEventRepository.findAll.mockResolvedValue(events);

      const result = await useCase.execute({
        status: EventStatus.PUBLISHED,
        organizerId: 'user-123',
      });

      expect(mockEventRepository.findAll).toHaveBeenCalledWith(expect.any(Object));
      expect(result).toEqual(events);
    });
  });
});
