import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphqlConfigModule } from '@presentation/graphql/graphql.module';
import { AuthModule } from '@presentation/graphql/auth.module';
import { EventModule } from '@presentation/graphql/event.module';
import { RedisModule } from '@infrastructure/redis.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), RedisModule, GraphqlConfigModule, AuthModule, EventModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
