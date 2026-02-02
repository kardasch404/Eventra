import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IEventRepository } from '@core/interfaces/event.repository.interface';
import { Event } from '@core/entities/event.entity';
import { EventDocument } from '@infrastructure/database/schemas/event.schema';
import { EventStatus } from '@shared/enums/event-status.enum';
import { DateTime } from '@core/value-objects/date-time.vo';
import { HeroImage } from '@core/value-objects/hero-image.vo';
import { Location } from '@core/value-objects/location.vo';

@Injectable()
export class EventRepository implements IEventRepository {
  constructor(@InjectModel(EventDocument.name) private eventModel: Model<EventDocument>) {}

  async create(event: Event): Promise<Event> {
    const created = await this.eventModel.create(event);
    return this.toEntity(created);
  }

  async findById(id: string): Promise<Event | null> {
    const doc = await this.eventModel.findOne({ id }).exec();
    return doc ? this.toEntity(doc) : null;
  }

  async findBySlug(slug: string): Promise<Event | null> {
    const doc = await this.eventModel.findOne({ slug }).exec();
    return doc ? this.toEntity(doc) : null;
  }

  async findAll(filters?: { status?: EventStatus; organizerId?: string }): Promise<Event[]> {
    const query = filters || {};
    const docs = await this.eventModel.find(query).exec();
    return docs.map((doc) => this.toEntity(doc));
  }

  async update(id: string, data: Partial<Event>): Promise<Event | null> {
    const doc = await this.eventModel.findOneAndUpdate({ id }, data, { new: true }).exec();
    return doc ? this.toEntity(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.eventModel.deleteOne({ id }).exec();
    return result.deletedCount > 0;
  }

  async incrementBookedCount(id: string, quantity: number): Promise<void> {
    await this.eventModel.updateOne({ id }, { $inc: { bookedCount: quantity } }).exec();
  }

  async decrementBookedCount(id: string, quantity: number): Promise<void> {
    await this.eventModel.updateOne({ id }, { $inc: { bookedCount: -quantity } }).exec();
  }

  private toEntity(doc: EventDocument): Event {
    return new Event({
      id: doc.id,
      slug: doc.slug,
      title: doc.title,
      summary: doc.summary,
      description: doc.description,
      category: doc.category,
      type: doc.type,
      status: doc.status,
      hero: new HeroImage(doc.hero),
      dateTime: new DateTime(doc.dateTime),
      location: new Location(doc.location),
      capacity: doc.capacity,
      bookedCount: doc.bookedCount,
      organizerId: doc.organizerId,
      highlights: doc.highlights,
      createdAt: doc.createdAt as Date,
      updatedAt: doc.updatedAt as Date,
    });
  }
}
