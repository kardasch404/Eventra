import { Inject, Injectable, ForbiddenException } from '@nestjs/common';
import { IReservationRepository } from '@core/interfaces/reservation.repository.interface';
import { IEventRepository } from '@core/interfaces/event.repository.interface';
import { IUserRepository } from '@core/interfaces/user.repository.interface';
import { Reservation } from '@core/entities/reservation.entity';

@Injectable()
export class CancelReservationUseCase {
  constructor(
    @Inject('IReservationRepository')
    private readonly reservationRepository: IReservationRepository,
    @Inject('IEventRepository')
    private readonly eventRepository: IEventRepository,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(reservationId: string, userId: string): Promise<Reservation> {
    const reservation = await this.reservationRepository.findById(reservationId);
    if (!reservation) {
      throw new Error('Reservation not found');
    }

    if (reservation.userId !== userId) {
      throw new Error('Reservation does not belong to user');
    }

    if (!reservation.canCancel()) {
      throw new Error('Reservation cannot be canceled');
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const hasPermission = this.checkCancelPermission();
    if (!hasPermission) {
      throw new ForbiddenException('User does not have permission to cancel reservations');
    }

    reservation.cancel();
    await this.eventRepository.decrementBookedCount(reservation.eventId, reservation.quantity);

    const updated = await this.reservationRepository.update(reservationId, {
      status: reservation.status,
      canceledAt: reservation.canceledAt,
      updatedAt: reservation.updatedAt,
    });

    if (!updated) {
      throw new Error('Failed to cancel reservation');
    }

    return updated;
  }

  private checkCancelPermission(): boolean {
    return true;
  }
}
