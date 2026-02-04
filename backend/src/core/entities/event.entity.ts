import { EventStatus } from '@shared/enums/event-status.enum';
import { EventType } from '@shared/enums/event-type.enum';
import { DateTime } from '@core/value-objects/date-time.vo';
import { HeroImage } from '@core/value-objects/hero-image.vo';
import { Location } from '@core/value-objects/location.vo';

export interface Highlight {
  icon: string;
  text: string;
}

export class Event {
  id: string; // UUID v7
  slug: string;
  title: string;
  summary: string;
  description: string[];
  category: string;
  type: EventType;
  status: EventStatus;
  hero: HeroImage;
  dateTime: DateTime;
  location: Location;
  capacity: number;
  bookedCount: number;
  organizerId: string; // UUID v7
  highlights: Highlight[];
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<Event>) {
    Object.assign(this, data);
    this.bookedCount = data.bookedCount ?? 0;
    this.status = data.status ?? EventStatus.DRAFT;
    this.createdAt = data.createdAt ?? new Date();
    this.updatedAt = data.updatedAt ?? new Date();
  }

  isPublished(): boolean {
    return this.status === EventStatus.PUBLISHED;
  }

  isFull(): boolean {
    return this.bookedCount >= this.capacity;
  }

  canReserve(): boolean {
    return this.isPublished() && !this.isFull();
  }

  availableSeats(): number {
    return this.capacity - this.bookedCount;
  }

  publish(): void {
    this.status = EventStatus.PUBLISHED;
    this.updatedAt = new Date();
  }

  cancel(): void {
    this.status = EventStatus.CANCELED;
    this.updatedAt = new Date();
  }

  incrementBookedCount(quantity: number): void {
    this.bookedCount += quantity;
    this.updatedAt = new Date();
  }

  decrementBookedCount(quantity: number): void {
    this.bookedCount = Math.max(0, this.bookedCount - quantity);
    this.updatedAt = new Date();
  }
}
