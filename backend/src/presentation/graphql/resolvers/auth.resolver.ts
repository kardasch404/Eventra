import { Resolver, Mutation, Args, Query, Int } from '@nestjs/graphql';
import { UseGuards, Inject } from '@nestjs/common';
import { RegisterUseCase } from '@application/use-cases/auth/register.use-case';
import { LoginUseCase } from '@application/use-cases/auth/login.use-case';
import { RefreshTokenUseCase } from '@application/use-cases/auth/refresh-token.use-case';
import { AuthResponseType, UserType, PaginatedUsersType, AdminStatsType } from '@presentation/graphql/types/auth.type';
import {
  RegisterInput,
  LoginInput,
  RefreshTokenInput,
} from '@presentation/graphql/types/auth.input';
import { GqlAuthGuard } from '@presentation/guards/gql-auth.guard';
import { AdminGuard } from '@presentation/guards/admin.guard';
import { CurrentUser } from '@presentation/decorators/current-user.decorator';
import { TokenPayload } from '@infrastructure/services/jwt.service';
import { IUserRepository } from '@core/interfaces/user.repository.interface';
import { IEventRepository } from '@core/interfaces/event.repository.interface';
import { IReservationRepository } from '@core/interfaces/reservation.repository.interface';
import { EventStatus } from '@shared/enums/event-status.enum';
import { ReservationStatus } from '@shared/enums/reservation-status.enum';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    @Inject('IEventRepository') private readonly eventRepository: IEventRepository,
    @Inject('IReservationRepository') private readonly reservationRepository: IReservationRepository,
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
  async me(@CurrentUser() tokenPayload: TokenPayload): Promise<UserType> {
    const user = await this.userRepository.findById(tokenPayload.sub);
    
    if (!user) {
      return {
        id: tokenPayload.sub,
        email: '',
        firstName: '',
        lastName: '',
        isEmailVerified: false,
        roles: tokenPayload.roles || ['participant'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isEmailVerified: user.isEmailVerified,
      roles: user.roles || ['participant'],
      createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: user.updatedAt?.toISOString() || new Date().toISOString(),
    };
  }

  // Admin: Get all users with pagination
  @Query(() => PaginatedUsersType)
  @UseGuards(GqlAuthGuard, AdminGuard)
  async users(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
    @Args('search', { type: () => String, nullable: true }) search?: string,
    @Args('role', { type: () => String, nullable: true }) role?: string,
  ): Promise<PaginatedUsersType> {
    const result = await this.userRepository.findWithFilters(
      { search, role },
      { page, limit },
    );

    return {
      users: result.data.map((user) => ({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
        roles: user.roles || ['participant'],
        createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
        updatedAt: user.updatedAt?.toISOString() || new Date().toISOString(),
      })),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  // Admin: Get single user by ID
  @Query(() => UserType, { nullable: true })
  @UseGuards(GqlAuthGuard, AdminGuard)
  async user(@Args('id') id: string): Promise<UserType | null> {
    const user = await this.userRepository.findById(id);
    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      isEmailVerified: user.isEmailVerified,
      roles: user.roles || ['participant'],
      createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: user.updatedAt?.toISOString() || new Date().toISOString(),
    };
  }

  // Admin: Update user roles
  @Mutation(() => UserType)
  @UseGuards(GqlAuthGuard, AdminGuard)
  async updateUserRoles(
    @Args('userId') userId: string,
    @Args('roles', { type: () => [String] }) roles: string[],
  ): Promise<UserType> {
    const user = await this.userRepository.updateRoles(userId, roles);
    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      isEmailVerified: user.isEmailVerified,
      roles: user.roles || ['participant'],
      createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: user.updatedAt?.toISOString() || new Date().toISOString(),
    };
  }

  // Admin: Delete user
  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard, AdminGuard)
  async deleteUser(@Args('userId') userId: string): Promise<boolean> {
    return this.userRepository.delete(userId);
  }

  // Admin: Get dashboard statistics
  @Query(() => AdminStatsType)
  @UseGuards(GqlAuthGuard, AdminGuard)
  async adminStats(): Promise<AdminStatsType> {
    const [users, events, reservations] = await Promise.all([
      this.userRepository.count(),
      this.eventRepository.findAll(),
      this.reservationRepository.findAll(),
    ]);

    const publishedEvents = events.filter((e) => e.status === EventStatus.PUBLISHED).length;
    const confirmedReservations = reservations.filter((r) => r.status === ReservationStatus.CONFIRMED).length;
    const pendingReservations = reservations.filter((r) => r.status === ReservationStatus.PENDING).length;

    return {
      totalUsers: users,
      totalEvents: events.length,
      totalReservations: reservations.length,
      confirmedReservations,
      pendingReservations,
      publishedEvents,
    };
  }
}
