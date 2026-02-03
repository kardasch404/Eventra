import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthResolver } from '@presentation/graphql/resolvers/auth.resolver';
import { RegisterUseCase } from '@application/use-cases/auth/register.use-case';
import { LoginUseCase } from '@application/use-cases/auth/login.use-case';
import { RefreshTokenUseCase } from '@application/use-cases/auth/refresh-token.use-case';
import { JwtService as CustomJwtService } from '@infrastructure/services/jwt.service';
import { UuidService } from '@infrastructure/services/uuid.service';
import { JwtStrategy } from '@infrastructure/services/jwt.strategy';

@Module({
  imports: [PassportModule, JwtModule.register({})],
  providers: [
    AuthResolver,
    RegisterUseCase,
    LoginUseCase,
    RefreshTokenUseCase,
    CustomJwtService,
    UuidService,
    JwtStrategy,
  ],
  exports: [CustomJwtService],
})
export class AuthModule {}
