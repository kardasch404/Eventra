import { Field, ObjectType, ID, Int, Float, registerEnumType } from '@nestjs/graphql';
import { EventType as EventTypeEnum } from '@shared/enums/event-type.enum';
import { EventStatus as EventStatusEnum } from '@shared/enums/event-status.enum';

registerEnumType(EventTypeEnum, { name: 'EventTypeEnum' });
registerEnumType(EventStatusEnum, { name: 'EventStatusEnum' });

@ObjectType()
export class HeroImageType {
  @Field({ nullable: true })
  url?: string;

  @Field({ nullable: true })
  alt?: string;

  @Field(() => Int, { nullable: true })
  width?: number;

  @Field(() => Int, { nullable: true })
  height?: number;
}

@ObjectType()
export class DateTimeType {
  @Field()
  start: string;

  @Field()
  end: string;

  @Field()
  timezone: string;

  @Field()
  display: string;

  @Field()
  duration: string;
}

@ObjectType()
export class CoordinatesType {
  @Field(() => Float)
  lat: number;

  @Field(() => Float)
  lng: number;
}

@ObjectType()
export class LocationType {
  @Field({ nullable: true })
  mode?: string;

  @Field({ nullable: true })
  country?: string;

  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  venue?: string;

  @Field(() => CoordinatesType, { nullable: true })
  coordinates?: CoordinatesType;
}

@ObjectType()
export class HighlightType {
  @Field()
  icon: string;

  @Field()
  text: string;
}

@ObjectType()
export class EventType {
  @Field(() => ID)
  id: string;

  @Field()
  slug: string;

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

  @Field(() => EventStatusEnum)
  status: EventStatusEnum;

  @Field(() => HeroImageType, { nullable: true })
  hero?: HeroImageType;

  @Field(() => DateTimeType)
  dateTime: DateTimeType;

  @Field(() => LocationType, { nullable: true })
  location?: LocationType;

  @Field(() => Int)
  capacity: number;

  @Field(() => Int)
  bookedCount: number;

  @Field(() => ID)
  organizerId: string;

  @Field(() => [HighlightType])
  highlights: HighlightType[];

  @Field(() => Int)
  availableSeats: number;

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;
}
