import { Inject, Injectable } from '@nestjs/common';
import { IEventRepository } from '@core/interfaces/event.repository.interface';
import { Event } from '@core/entities/event.entity';

@Injectable()
export class CancelEventUseCase {
  constructor(
    @Inject('IEventRepository')
    private readonly eventRepository: IEventRepository,
  ) {}

  async execute(eventId: string, userId: string): Promise<Event> {
    const event = await this.eventRepository.findById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    if (event.organizerId !== userId) {
      throw new Error('Unauthorized to cancel this event');
    }

    event.cancel();
    const updated = await this.eventRepository.update(eventId, {
      status: event.status,
      updatedAt: event.updatedAt,
    });

    if (!updated) {
      throw new Error('Failed to cancel event');
    }

    return updated;
  }
}
