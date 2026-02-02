import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EventStatus } from '@shared/enums/event-status.enum';
import { EventType } from '@shared/enums/event-type.enum';

@Schema({ _id: false })
class HeroImageSchema {
  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  alt: string;

  @Prop()
  width?: number;

  @Prop()
  height?: number;
}

@Schema({ _id: false })
class DateTimeSchema {
  @Prop({ required: true })
  start: Date;

  @Prop({ required: true })
  end: Date;

  @Prop({ required: true })
  timezone: string;

  @Prop({ required: true })
  display: string;

  @Prop({ required: true })
  duration: string;
}

@Schema({ _id: false })
class LocationSchema {
  @Prop({ required: true })
  mode: string;

  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  city: string;

  @Prop()
  address?: string;

  @Prop()
  venue?: string;

  @Prop({ type: Object })
  coordinates?: { lat: number; lng: number };
}

@Schema({ _id: false })
class HighlightSchema {
  @Prop({ required: true })
  icon: string;

  @Prop({ required: true })
  text: string;
}

@Schema({ timestamps: true })
export class EventDocument extends Document {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  summary: string;

  @Prop({ type: [String], required: true })
  description: string[];

  @Prop({ required: true })
  category: string;

  @Prop({ required: true, enum: EventType })
  type: EventType;

  @Prop({ required: true, enum: EventStatus, default: EventStatus.DRAFT })
  status: EventStatus;

  @Prop({ type: HeroImageSchema, required: true })
  hero: HeroImageSchema;

  @Prop({ type: DateTimeSchema, required: true })
  dateTime: DateTimeSchema;

  @Prop({ type: LocationSchema, required: true })
  location: LocationSchema;

  @Prop({ required: true })
  capacity: number;

  @Prop({ default: 0 })
  bookedCount: number;

  @Prop({ required: true })
  organizerId: string;

  @Prop({ type: [HighlightSchema], default: [] })
  highlights: HighlightSchema[];
}

export const EventSchema = SchemaFactory.createForClass(EventDocument);

EventSchema.index({ slug: 1 }, { unique: true });
EventSchema.index({ id: 1 }, { unique: true });
EventSchema.index({ status: 1 });
EventSchema.index({ organizerId: 1 });
EventSchema.index({ 'dateTime.start': 1 });
EventSchema.index({ category: 1 });
