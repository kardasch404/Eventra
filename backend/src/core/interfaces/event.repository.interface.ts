import { Event } from '@core/entities/event.entity';
import { EventStatus } from '@shared/enums/event-status.enum';

export interface IEventRepository {
  create(event: Event): Promise<Event>;
  findById(id: string): Promise<Event | null>;
  findBySlug(slug: string): Promise<Event | null>;
  findAll(filters?: { status?: EventStatus; organizerId?: string }): Promise<Event[]>;
  update(id: string, data: Partial<Event>): Promise<Event | null>;
  delete(id: string): Promise<boolean>;
  incrementBookedCount(id: string, quantity: number): Promise<void>;
  decrementBookedCount(id: string, quantity: number): Promise<void>;
}
