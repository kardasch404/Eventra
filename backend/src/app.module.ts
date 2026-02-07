import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphqlConfigModule } from '@presentation/graphql/graphql.module';
import { AuthModule } from '@presentation/graphql/auth.module';
import { EventModule } from '@presentation/graphql/event.module';
import { ReservationModule } from '@presentation/graphql/reservation.module';
import { RedisModule } from '@infrastructure/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RedisModule,
    GraphqlConfigModule,
    AuthModule,
    EventModule,
    ReservationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
