import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReservationResolver } from './resolvers/reservation.resolver';
import { CreateReservationUseCase } from '@application/use-cases/reservations/create-reservation.use-case';
import { ConfirmReservationUseCase } from '@application/use-cases/reservations/confirm-reservation.use-case';
import { RefuseReservationUseCase } from '@application/use-cases/reservations/refuse-reservation.use-case';
import { CancelReservationUseCase } from '@application/use-cases/reservations/cancel-reservation.use-case';
import { GetMyReservationsUseCase } from '@application/use-cases/reservations/get-my-reservations.use-case';
import { ReservationSchema } from '@infrastructure/database/schemas/reservation.schema';
import { EventSchema } from '@infrastructure/database/schemas/event.schema';
import { UserSchema } from '@infrastructure/database/schemas/user.schema';
import { ReservationRepository } from '@infrastructure/database/repositories/reservation.repository';
import { EventRepository } from '@infrastructure/database/repositories/event.repository';
import { UserRepository } from '@infrastructure/database/repositories/user.repository';
import { UuidService } from '@infrastructure/services/uuid.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Reservation', schema: ReservationSchema },
      { name: 'Event', schema: EventSchema },
      { name: 'User', schema: UserSchema },
    ]),
  ],
  providers: [
    ReservationResolver,
    CreateReservationUseCase,
    ConfirmReservationUseCase,
    RefuseReservationUseCase,
    CancelReservationUseCase,
    GetMyReservationsUseCase,
    UuidService,
    {
      provide: 'IReservationRepository',
      useClass: ReservationRepository,
    },
    {
      provide: 'IEventRepository',
      useClass: EventRepository,
    },
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
  ],
})
export class ReservationModule {}
