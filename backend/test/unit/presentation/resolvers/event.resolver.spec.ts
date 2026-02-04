import { EventResolver } from '@presentation/graphql/resolvers/event.resolver';
import { CreateEventUseCase } from '@application/use-cases/events/create-event.use-case';
import { UpdateEventUseCase } from '@application/use-cases/events/update-event.use-case';
import { PublishEventUseCase } from '@application/use-cases/events/publish-event.use-case';
import { CancelEventUseCase } from '@application/use-cases/events/cancel-event.use-case';
import { GetEventsUseCase } from '@application/use-cases/events/get-events.use-case';
import { IEventRepository } from '@core/interfaces/event.repository.interface';
import { Event } from '@core/entities/event.entity';
import { EventStatus } from '@shared/enums/event-status.enum';
import { EventType } from '@shared/enums/event-type.enum';
import { DateTime } from '@core/value-objects/date-time.vo';
import { HeroImage } from '@core/value-objects/hero-image.vo';
import { Location } from '@core/value-objects/location.vo';

describe('EventResolver', () => {
  let resolver: EventResolver;
  let mockCreateEventUseCase: jest.Mocked<CreateEventUseCase>;
  let mockUpdateEventUseCase: jest.Mocked<UpdateEventUseCase>;
  let mockPublishEventUseCase: jest.Mocked<PublishEventUseCase>;
  let mockCancelEventUseCase: jest.Mocked<CancelEventUseCase>;
  let mockGetEventsUseCase: jest.Mocked<GetEventsUseCase>;
  let mockEventRepository: jest.Mocked<IEventRepository>;

  beforeEach(() => {
    mockCreateEventUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CreateEventUseCase>;

    mockUpdateEventUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<UpdateEventUseCase>;

    mockPublishEventUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<PublishEventUseCase>;

    mockCancelEventUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CancelEventUseCase>;

    mockGetEventsUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<GetEventsUseCase>;

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

    resolver = new EventResolver(
      mockCreateEventUseCase,
      mockUpdateEventUseCase,
      mockPublishEventUseCase,
      mockCancelEventUseCase,
      mockGetEventsUseCase,
      mockEventRepository,
    );
  });

  describe('events', () => {
    it('should return paginated events', async () => {
      const mockEvents = [
        new Event({
          id: 'event-1',
          title: 'Event 1',
          slug: 'event-1',
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
          organizerId: 'user-1',
          highlights: [],
        }),
      ];

      mockEventRepository.findWithFilters.mockResolvedValue({
        data: mockEvents,
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });

      const result = await resolver.events({ page: 1, limit: 10 });

      expect(result.events).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    it('should apply filters', async () => {
      mockEventRepository.findWithFilters.mockResolvedValue({
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      });

      await resolver.events({
        status: EventStatus.PUBLISHED,
        category: 'Tech',
        search: 'test',
        page: 1,
        limit: 10,
      });

      expect(mockEventRepository.findWithFilters).toHaveBeenCalled();
    });
  });

  describe('event', () => {
    it('should return event by id', async () => {
      const mockEvent = new Event({
        id: 'event-1',
        title: 'Event 1',
        slug: 'event-1',
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
        organizerId: 'user-1',
        highlights: [],
      });

      mockEventRepository.findById.mockResolvedValue(mockEvent);

      const result = await resolver.event('event-1');

      expect(result).toBeDefined();
      expect(result?.id).toBe('event-1');
    });

    it('should return null if event not found', async () => {
      mockEventRepository.findById.mockResolvedValue(null);

      const result = await resolver.event('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('createEvent', () => {
    it('should create event', async () => {
      const input = {
        title: 'New Event',
        summary: 'Summary',
        description: ['Description'],
        category: 'Tech',
        type: EventType.ONLINE,
        hero: { url: 'https://example.com/image.jpg', alt: 'Hero' },
        dateTime: { start: '2024-12-01', end: '2024-12-02', timezone: 'UTC' },
        location: { country: 'US', city: 'NYC' },
        capacity: 100,
        highlights: [],
      };

      const mockEvent = new Event({
        id: 'event-1',
        slug: 'new-event',
        title: input.title,
        summary: input.summary,
        description: input.description,
        category: input.category,
        type: input.type,
        hero: new HeroImage(input.hero),
        dateTime: new DateTime({
          start: new Date(input.dateTime.start),
          end: new Date(input.dateTime.end),
          timezone: input.dateTime.timezone,
        }),
        location: new Location(input.location),
        capacity: input.capacity,
        highlights: input.highlights,
        status: EventStatus.DRAFT,
        organizerId: 'user-1',
      });

      mockCreateEventUseCase.execute.mockResolvedValue(mockEvent);

      const result = await resolver.createEvent(input, { userId: 'user-1' });

      expect(result.title).toBe('New Event');
      expect(mockCreateEventUseCase.execute).toHaveBeenCalled();
    });
  });

  describe('publishEvent', () => {
    it('should publish event', async () => {
      const mockEvent = new Event({
        id: 'event-1',
        title: 'Event 1',
        slug: 'event-1',
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
        organizerId: 'user-1',
        highlights: [],
      });

      mockPublishEventUseCase.execute.mockResolvedValue(mockEvent);

      const result = await resolver.publishEvent('event-1', { userId: 'user-1' });

      expect(result.status).toBe(EventStatus.PUBLISHED);
    });
  });

  describe('cancelEvent', () => {
    it('should cancel event', async () => {
      const mockEvent = new Event({
        id: 'event-1',
        title: 'Event 1',
        slug: 'event-1',
        summary: 'Summary',
        description: ['Description'],
        category: 'Tech',
        type: EventType.ONLINE,
        status: EventStatus.CANCELED,
        hero: new HeroImage({ url: 'https://example.com/image.jpg', alt: 'Hero' }),
        dateTime: new DateTime({
          start: new Date('2024-12-01'),
          end: new Date('2024-12-02'),
          timezone: 'UTC',
        }),
        location: new Location({ country: 'US', city: 'NYC' }),
        capacity: 100,
        organizerId: 'user-1',
        highlights: [],
      });

      mockCancelEventUseCase.execute.mockResolvedValue(mockEvent);

      const result = await resolver.cancelEvent('event-1', { userId: 'user-1' });

      expect(result.status).toBe(EventStatus.CANCELED);
    });
  });
});
