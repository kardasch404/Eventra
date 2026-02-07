import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ReservationType } from '../types/reservation.type';
import { CreateReservationInput } from '../types/reservation.input';
import { CreateReservationUseCase } from '@application/use-cases/reservations/create-reservation.use-case';
import { ConfirmReservationUseCase } from '@application/use-cases/reservations/confirm-reservation.use-case';
import { RefuseReservationUseCase } from '@application/use-cases/reservations/refuse-reservation.use-case';
import { CancelReservationUseCase } from '@application/use-cases/reservations/cancel-reservation.use-case';
import { GetMyReservationsUseCase } from '@application/use-cases/reservations/get-my-reservations.use-case';
import { GqlAuthGuard } from '@presentation/guards/gql-auth.guard';
import { AdminGuard } from '@presentation/guards/admin.guard';
import { CurrentUser } from '@presentation/decorators/current-user.decorator';
import { Reservation } from '@core/entities/reservation.entity';
import { Inject } from '@nestjs/common';
import { IReservationRepository } from '@core/interfaces/reservation.repository.interface';

@Resolver(() => ReservationType)
export class ReservationResolver {
  constructor(
    private readonly createReservationUseCase: CreateReservationUseCase,
    private readonly confirmReservationUseCase: ConfirmReservationUseCase,
    private readonly refuseReservationUseCase: RefuseReservationUseCase,
    private readonly cancelReservationUseCase: CancelReservationUseCase,
    private readonly getMyReservationsUseCase: GetMyReservationsUseCase,
    @Inject('IReservationRepository')
    private readonly reservationRepository: IReservationRepository,
  ) {}

  @Query(() => [ReservationType])
  @UseGuards(GqlAuthGuard)
  async myReservations(@CurrentUser() user: { userId: string }): Promise<ReservationType[]> {
    const reservations = await this.getMyReservationsUseCase.execute(user.userId);
    return reservations.map(this.mapReservationToGraphQL);
  }

  @Query(() => [ReservationType])
  @UseGuards(GqlAuthGuard, AdminGuard)
  async allReservations(): Promise<ReservationType[]> {
    const reservations = await this.reservationRepository.findByUserId('');
    return reservations.map(this.mapReservationToGraphQL);
  }

  @Query(() => ReservationType, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async reservation(@Args('id') id: string): Promise<ReservationType | null> {
    const reservation = await this.reservationRepository.findById(id);
    return reservation ? this.mapReservationToGraphQL(reservation) : null;
  }

  @Mutation(() => ReservationType)
  @UseGuards(GqlAuthGuard)
  async createReservation(
    @Args('input') input: CreateReservationInput,
    @CurrentUser() user: { userId: string },
  ): Promise<ReservationType> {
    const reservation = await this.createReservationUseCase.execute(
      {
        eventId: input.eventId,
        quantity: input.quantity,
      },
      user.userId,
    );

    return this.mapReservationToGraphQL(reservation);
  }

  @Mutation(() => ReservationType)
  @UseGuards(GqlAuthGuard)
  async confirmReservation(@Args('id') id: string): Promise<ReservationType> {
    const reservation = await this.confirmReservationUseCase.execute(id);
    return this.mapReservationToGraphQL(reservation);
  }

  @Mutation(() => ReservationType)
  @UseGuards(GqlAuthGuard)
  async refuseReservation(@Args('id') id: string): Promise<ReservationType> {
    const reservation = await this.refuseReservationUseCase.execute(id);
    return this.mapReservationToGraphQL(reservation);
  }

  @Mutation(() => ReservationType)
  @UseGuards(GqlAuthGuard)
  async cancelReservation(
    @Args('id') id: string,
    @CurrentUser() user: { userId: string },
  ): Promise<ReservationType> {
    const reservation = await this.cancelReservationUseCase.execute(id, user.userId);
    return this.mapReservationToGraphQL(reservation);
  }

  private mapReservationToGraphQL(reservation: Reservation): ReservationType {
    return {
      id: reservation.id,
      eventId: reservation.eventId,
      userId: reservation.userId,
      quantity: reservation.quantity,
      status: reservation.status,
      ticketCode: reservation.ticketCode,
      confirmedAt: reservation.confirmedAt?.toISOString(),
      canceledAt: reservation.canceledAt?.toISOString(),
      createdAt: reservation.createdAt.toISOString(),
      updatedAt: reservation.updatedAt.toISOString(),
    };
  }
}
