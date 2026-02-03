import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphqlConfigModule } from '@presentation/graphql/graphql.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), GraphqlConfigModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
