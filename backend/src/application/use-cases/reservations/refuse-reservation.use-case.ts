import { Inject, Injectable } from '@nestjs/common';
import { IReservationRepository } from '@core/interfaces/reservation.repository.interface';
import { IEventRepository } from '@core/interfaces/event.repository.interface';
import { Reservation } from '@core/entities/reservation.entity';

@Injectable()
export class RefuseReservationUseCase {
  constructor(
    @Inject('IReservationRepository')
    private readonly reservationRepository: IReservationRepository,
    @Inject('IEventRepository')
    private readonly eventRepository: IEventRepository,
  ) {}

  async execute(reservationId: string): Promise<Reservation> {
    const reservation = await this.reservationRepository.findById(reservationId);
    if (!reservation) {
      throw new Error('Reservation not found');
    }

    if (!reservation.isPending()) {
      throw new Error('Only pending reservations can be refused');
    }

    reservation.refuse();
    await this.eventRepository.decrementBookedCount(reservation.eventId, reservation.quantity);

    const updated = await this.reservationRepository.update(reservationId, {
      status: reservation.status,
      updatedAt: reservation.updatedAt,
    });

    if (!updated) {
      throw new Error('Failed to refuse reservation');
    }

    return updated;
  }
}
