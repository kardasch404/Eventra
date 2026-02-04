import { Field, ObjectType, Int } from '@nestjs/graphql';
import { EventType } from './event.type';

@ObjectType()
export class PaginatedEventsType {
  @Field(() => [EventType])
  events: EventType[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  totalPages: number;
}
