import { Inject, Injectable } from '@nestjs/common';
import { IEventRepository } from '@core/interfaces/event.repository.interface';
import { Event } from '@core/entities/event.entity';
import { GetEventsDto } from '@application/dto/events/get-events.dto';

@Injectable()
export class GetEventsUseCase {
  constructor(
    @Inject('IEventRepository')
    private readonly eventRepository: IEventRepository,
  ) {}

  async execute(filters?: GetEventsDto): Promise<Event[]> {
    return this.eventRepository.findAll(filters);
  }
}
