import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { RegisterUseCase } from '@application/use-cases/auth/register.use-case';
import { LoginUseCase } from '@application/use-cases/auth/login.use-case';
import { RefreshTokenUseCase } from '@application/use-cases/auth/refresh-token.use-case';
import { AuthResponseType, UserType } from '@presentation/graphql/types/auth.type';
import {
  RegisterInput,
  LoginInput,
  RefreshTokenInput,
} from '@presentation/graphql/types/auth.input';
import { GqlAuthGuard } from '@presentation/guards/gql-auth.guard';
import { CurrentUser } from '@presentation/decorators/current-user.decorator';
import { TokenPayload } from '@infrastructure/services/jwt.service';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
  ) {}

  @Mutation(() => AuthResponseType)
  async register(@Args('input') input: RegisterInput): Promise<any> {
    return this.registerUseCase.execute(input);
  }

  @Mutation(() => AuthResponseType)
  async login(@Args('input') input: LoginInput): Promise<any> {
    return this.loginUseCase.execute(input);
  }

  @Mutation(() => AuthResponseType)
  async refreshToken(@Args('input') input: RefreshTokenInput): Promise<any> {
    return this.refreshTokenUseCase.execute(input);
  }

  @Query(() => UserType)
  @UseGuards(GqlAuthGuard)
  me(@CurrentUser() user: TokenPayload): UserType {
    return {
      id: user.sub,
      email: '',
      firstName: '',
      lastName: '',
      isEmailVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}
