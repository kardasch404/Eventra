import { PdfService } from '@infrastructure/services/pdf.service';
import { TicketTemplateService } from '@infrastructure/services/ticket-template.service';
import { RedisService } from '@infrastructure/services/redis.service';
import { Reservation } from '@core/entities/reservation.entity';
import { Event } from '@core/entities/event.entity';
import { ReservationStatus } from '@shared/enums/reservation-status.enum';
import { EventType } from '@shared/enums/event-type.enum';
import { EventStatus } from '@shared/enums/event-status.enum';
import { DateTime } from '@core/value-objects/date-time.vo';
import { HeroImage } from '@core/value-objects/hero-image.vo';
import { Location } from '@core/value-objects/location.vo';

jest.mock('qrcode');

describe('PdfService', () => {
  let service: PdfService;
  let mockTicketTemplateService: jest.Mocked<TicketTemplateService>;
  let mockRedisService: jest.Mocked<RedisService>;

  beforeEach(() => {
    mockTicketTemplateService = {
      applyTemplate: jest.fn(),
    } as unknown as jest.Mocked<TicketTemplateService>;

    mockRedisService = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
      exists: jest.fn(),
    } as unknown as jest.Mocked<RedisService>;

    service = new PdfService(mockTicketTemplateService, mockRedisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate PDF ticket', async () => {
    const reservation = new Reservation({
      id: 'res-1',
      eventId: 'event-1',
      userId: 'user-1',
      quantity: 2,
      status: ReservationStatus.CONFIRMED,
      ticketCode: 'TKT-123',
    });

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
      organizerId: 'user-1',
      highlights: [],
    });

    mockRedisService.get.mockResolvedValue(null);

    const result = await service.generateTicket(reservation, event);

    expect(result).toBeInstanceOf(Buffer);
    expect(mockRedisService.set).toHaveBeenCalled();
  });

  it('should return cached PDF if available', async () => {
    const reservation = new Reservation({
      id: 'res-1',
      eventId: 'event-1',
      userId: 'user-1',
      quantity: 2,
      status: ReservationStatus.CONFIRMED,
      ticketCode: 'TKT-123',
    });

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
      organizerId: 'user-1',
      highlights: [],
    });

    const cachedPdf = Buffer.from('cached-pdf').toString('base64');
    mockRedisService.get.mockResolvedValue(cachedPdf);

    const result = await service.generateTicket(reservation, event);

    expect(result).toBeInstanceOf(Buffer);
    expect(mockRedisService.set).not.toHaveBeenCalled();
  });
});

describe('TicketTemplateService', () => {
  let service: TicketTemplateService;

  beforeEach(() => {
    service = new TicketTemplateService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
