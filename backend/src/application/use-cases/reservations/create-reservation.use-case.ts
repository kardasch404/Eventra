import { Inject, Injectable } from '@nestjs/common';
import { IReservationRepository } from '@core/interfaces/reservation.repository.interface';
import { IEventRepository } from '@core/interfaces/event.repository.interface';
import { Reservation } from '@core/entities/reservation.entity';
import { CreateReservationDto } from '@application/dto/reservations/create-reservation.dto';
import { UuidService } from '@infrastructure/services/uuid.service';
import { ReservationStatus } from '@shared/enums/reservation-status.enum';
import { EventStatus } from '@shared/enums/event-status.enum';

@Injectable()
export class CreateReservationUseCase {
  constructor(
    @Inject('IReservationRepository')
    private readonly reservationRepository: IReservationRepository,
    @Inject('IEventRepository')
    private readonly eventRepository: IEventRepository,
    private readonly uuidService: UuidService,
  ) {}

  async execute(dto: CreateReservationDto, userId: string): Promise<Reservation> {
    const event = await this.eventRepository.findById(dto.eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    if (event.status !== EventStatus.PUBLISHED) {
      throw new Error('Event is not published');
    }

    if ((event.status as any) === EventStatus.CANCELED) {
      throw new Error('Event is canceled');
    }

    if (event.bookedCount + dto.quantity > event.capacity) {
      throw new Error('Event is full');
    }

    const userReservations = await this.reservationRepository.findByUserId(userId);
    const activeReservation = userReservations.find(
      (r) =>
        r.eventId === dto.eventId &&
        (r.status === ReservationStatus.PENDING || r.status === ReservationStatus.CONFIRMED),
    );

    if (activeReservation) {
      throw new Error('User already has an active reservation for this event');
    }

    const reservation = new Reservation({
      id: this.uuidService.generate(),
      eventId: dto.eventId,
      userId,
      quantity: dto.quantity,
      status: ReservationStatus.PENDING,
      ticketCode: this.generateTicketCode(),
    });

    await this.eventRepository.incrementBookedCount(dto.eventId, dto.quantity);
    return this.reservationRepository.create(reservation);
  }

  private generateTicketCode(): string {
    return `TKT-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  }
}
