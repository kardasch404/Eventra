import { Field, InputType, Int, Float } from '@nestjs/graphql';
import { EventType as EventTypeEnum } from '@shared/enums/event-type.enum';
import { EventStatus as EventStatusEnum } from '@shared/enums/event-status.enum';

@InputType()
export class HeroImageInput {
  @Field()
  url: string;

  @Field()
  alt: string;

  @Field(() => Int, { nullable: true })
  width?: number;

  @Field(() => Int, { nullable: true })
  height?: number;
}

@InputType()
export class DateTimeInput {
  @Field()
  start: string;

  @Field()
  end: string;

  @Field()
  timezone: string;
}

@InputType()
export class CoordinatesInput {
  @Field(() => Float)
  lat: number;

  @Field(() => Float)
  lng: number;
}

@InputType()
export class LocationInput {
  @Field()
  country: string;

  @Field()
  city: string;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  venue?: string;

  @Field(() => CoordinatesInput, { nullable: true })
  coordinates?: CoordinatesInput;
}

@InputType()
export class HighlightInput {
  @Field()
  icon: string;

  @Field()
  text: string;
}

@InputType()
export class CreateEventInput {
  @Field()
  title: string;

  @Field()
  summary: string;

  @Field(() => [String])
  description: string[];

  @Field()
  category: string;

  @Field(() => EventTypeEnum)
  type: EventTypeEnum;

  @Field(() => HeroImageInput)
  hero: HeroImageInput;

  @Field(() => DateTimeInput)
  dateTime: DateTimeInput;

  @Field(() => LocationInput)
  location: LocationInput;

  @Field(() => Int)
  capacity: number;

  @Field(() => [HighlightInput])
  highlights: HighlightInput[];
}

@InputType()
export class UpdateEventInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  summary?: string;

  @Field(() => [String], { nullable: true })
  description?: string[];

  @Field({ nullable: true })
  category?: string;

  @Field(() => EventTypeEnum, { nullable: true })
  type?: EventTypeEnum;

  @Field(() => EventStatusEnum, { nullable: true })
  status?: EventStatusEnum;

  @Field(() => HeroImageInput, { nullable: true })
  hero?: HeroImageInput;

  @Field(() => DateTimeInput, { nullable: true })
  dateTime?: DateTimeInput;

  @Field(() => LocationInput, { nullable: true })
  location?: LocationInput;

  @Field(() => Int, { nullable: true })
  capacity?: number;

  @Field(() => [HighlightInput], { nullable: true })
  highlights?: HighlightInput[];
}

@InputType()
export class EventFiltersInput {
  @Field(() => EventStatusEnum, { nullable: true })
  status?: EventStatusEnum;

  @Field({ nullable: true })
  organizerId?: string;

  @Field({ nullable: true })
  category?: string;

  @Field(() => EventTypeEnum, { nullable: true })
  type?: EventTypeEnum;

  @Field({ nullable: true })
  search?: string;

  @Field(() => Int, { nullable: true, defaultValue: 1 })
  page?: number;

  @Field(() => Int, { nullable: true, defaultValue: 10 })
  limit?: number;
}
