import { Event } from '@core/entities/event.entity';
import { EventStatus } from '@shared/enums/event-status.enum';
import { EventType } from '@shared/enums/event-type.enum';

export interface EventFilters {
  status?: EventStatus;
  organizerId?: string;
  category?: string;
  type?: EventType;
  search?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IEventRepository {
  create(event: Event): Promise<Event>;
  findById(id: string): Promise<Event | null>;
  findBySlug(slug: string): Promise<Event | null>;
  findAll(filters?: { status?: EventStatus; organizerId?: string }): Promise<Event[]>;
  findWithFilters(filters: EventFilters, pagination: PaginationOptions): Promise<PaginatedResult<Event>>;
  update(id: string, data: Partial<Event>): Promise<Event | null>;
  delete(id: string): Promise<boolean>;
  incrementBookedCount(id: string, quantity: number): Promise<void>;
  decrementBookedCount(id: string, quantity: number): Promise<void>;
}
