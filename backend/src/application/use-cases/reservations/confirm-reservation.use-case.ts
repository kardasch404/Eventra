import { Inject, Injectable } from '@nestjs/common';
import { IReservationRepository } from '@core/interfaces/reservation.repository.interface';
import { Reservation } from '@core/entities/reservation.entity';

@Injectable()
export class ConfirmReservationUseCase {
  constructor(
    @Inject('IReservationRepository')
    private readonly reservationRepository: IReservationRepository,
  ) {}

  async execute(reservationId: string): Promise<Reservation> {
    const reservation = await this.reservationRepository.findById(reservationId);
    if (!reservation) {
      throw new Error('Reservation not found');
    }

    if (!reservation.isPending()) {
      throw new Error('Only pending reservations can be confirmed');
    }

    reservation.confirm();
    const updated = await this.reservationRepository.update(reservationId, {
      status: reservation.status,
      confirmedAt: reservation.confirmedAt,
      updatedAt: reservation.updatedAt,
    });

    if (!updated) {
      throw new Error('Failed to confirm reservation');
    }

    return updated;
  }
}
