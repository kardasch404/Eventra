import { Field, ObjectType, ID, Int, registerEnumType } from '@nestjs/graphql';
import { ReservationStatus as ReservationStatusEnum } from '@shared/enums/reservation-status.enum';

registerEnumType(ReservationStatusEnum, { name: 'ReservationStatus' });

@ObjectType()
export class ReservationType {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  eventId: string;

  @Field(() => ID)
  userId: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => ReservationStatusEnum)
  status: ReservationStatusEnum;

  @Field()
  ticketCode: string;

  @Field({ nullable: true })
  confirmedAt?: string;

  @Field({ nullable: true })
  canceledAt?: string;

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;
}
