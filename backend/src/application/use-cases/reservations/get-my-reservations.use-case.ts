import { Inject, Injectable } from '@nestjs/common';
import { IReservationRepository } from '@core/interfaces/reservation.repository.interface';
import { Reservation } from '@core/entities/reservation.entity';

@Injectable()
export class GetMyReservationsUseCase {
  constructor(
    @Inject('IReservationRepository')
    private readonly reservationRepository: IReservationRepository,
  ) {}

  async execute(userId: string): Promise<Reservation[]> {
    return this.reservationRepository.findByUserId(userId);
  }
}
