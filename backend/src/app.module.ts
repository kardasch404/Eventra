import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphqlConfigModule } from '@presentation/graphql/graphql.module';
import { AuthModule } from '@presentation/graphql/auth.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), GraphqlConfigModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
