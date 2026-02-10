import { Field, ObjectType, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class UserType {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field({ nullable: true })
  avatar?: string;

  @Field()
  isEmailVerified: boolean;

  @Field(() => [String])
  roles: string[];

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;
}

@ObjectType()
export class PaginatedUsersType {
  @Field(() => [UserType])
  users: UserType[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  totalPages: number;
}

@ObjectType()
export class AuthResponseType {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field(() => UserType)
  user: UserType;
}

@ObjectType()
export class AdminStatsType {
  @Field(() => Int)
  totalUsers: number;

  @Field(() => Int)
  totalEvents: number;

  @Field(() => Int)
  totalReservations: number;

  @Field(() => Int)
  confirmedReservations: number;

  @Field(() => Int)
  pendingReservations: number;

  @Field(() => Int)
  publishedEvents: number;
}
