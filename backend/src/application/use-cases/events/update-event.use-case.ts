import { Inject, Injectable } from '@nestjs/common';
import { IEventRepository } from '@core/interfaces/event.repository.interface';
import { Event } from '@core/entities/event.entity';
import { UpdateEventDto } from '@application/dto/events/update-event.dto';
import { generateSlug } from '@shared/utils/slug.util';

@Injectable()
export class UpdateEventUseCase {
  constructor(
    @Inject('IEventRepository')
    private readonly eventRepository: IEventRepository,
  ) {}

  async execute(eventId: string, dto: UpdateEventDto, userId: string): Promise<Event> {
    const event = await this.eventRepository.findById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    if (event.organizerId !== userId) {
      throw new Error('Unauthorized to update this event');
    }

    if (dto.dateTime && dto.dateTime.end <= dto.dateTime.start) {
      throw new Error('End date must be after start date');
    }

    const updateData: Partial<Event> = { ...dto };
    if (dto.title) {
      updateData.slug = generateSlug(dto.title);
    }

    const updated = await this.eventRepository.update(eventId, updateData);
    if (!updated) {
      throw new Error('Failed to update event');
    }

    return updated;
  }
}
