import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthResolver } from '@presentation/graphql/resolvers/auth.resolver';
import { RegisterUseCase } from '@application/use-cases/auth/register.use-case';
import { LoginUseCase } from '@application/use-cases/auth/login.use-case';
import { RefreshTokenUseCase } from '@application/use-cases/auth/refresh-token.use-case';
import { JwtService as CustomJwtService } from '@infrastructure/services/jwt.service';
import { UuidService } from '@infrastructure/services/uuid.service';
import { JwtStrategy } from '@infrastructure/services/jwt.strategy';
import { RefreshTokenStrategy } from '@infrastructure/services/refresh-token.strategy';
import { UserSchema, UserDocument } from '@infrastructure/database/schemas/user.schema';
import { UserRepository } from '@infrastructure/database/repositories/user.repository';
import { EventSchema, EventDocument } from '@infrastructure/database/schemas/event.schema';
import { EventRepository } from '@infrastructure/database/repositories/event.repository';
import { ReservationSchema, ReservationDocument } from '@infrastructure/database/schemas/reservation.schema';
import { ReservationRepository } from '@infrastructure/database/repositories/reservation.repository';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
    MongooseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
      { name: EventDocument.name, schema: EventSchema },
      { name: ReservationDocument.name, schema: ReservationSchema },
    ]),
  ],
  providers: [
    AuthResolver,
    RegisterUseCase,
    LoginUseCase,
    RefreshTokenUseCase,
    CustomJwtService,
    UuidService,
    JwtStrategy,
    RefreshTokenStrategy,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    {
      provide: 'IEventRepository',
      useClass: EventRepository,
    },
    {
      provide: 'IReservationRepository',
      useClass: ReservationRepository,
    },
  ],
  exports: [CustomJwtService],
})
export class AuthModule {}
