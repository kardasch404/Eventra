import { Inject, Injectable } from '@nestjs/common';
import { IEventRepository } from '@core/interfaces/event.repository.interface';
import { Event } from '@core/entities/event.entity';
import { CreateEventDto } from '@application/dto/events/create-event.dto';
import { UuidService } from '@infrastructure/services/uuid.service';
import { generateSlug } from '@shared/utils/slug.util';
import { EventStatus } from '@shared/enums/event-status.enum';

@Injectable()
export class CreateEventUseCase {
  constructor(
    @Inject('IEventRepository')
    private readonly eventRepository: IEventRepository,
    private readonly uuidService: UuidService,
  ) {}

  async execute(dto: CreateEventDto, userId: string): Promise<Event> {
    if (dto.dateTime.end <= dto.dateTime.start) {
      throw new Error('End date must be after start date');
    }

    const event = new Event({
      id: this.uuidService.generate(),
      slug: generateSlug(dto.title),
      title: dto.title,
      summary: dto.summary,
      description: dto.description,
      category: dto.category,
      type: dto.type,
      status: EventStatus.DRAFT,
      hero: dto.hero,
      dateTime: dto.dateTime,
      location: dto.location,
      capacity: dto.capacity,
      organizerId: userId,
      highlights: dto.highlights,
    });

    return this.eventRepository.create(event);
  }
}
