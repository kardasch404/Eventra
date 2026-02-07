import { Reservation } from '@core/entities/reservation.entity';
import { ReservationStatus } from '@shared/enums/reservation-status.enum';

export interface IReservationRepository {
  create(reservation: Reservation): Promise<Reservation>;
  findById(id: string): Promise<Reservation | null>;
  findByTicketCode(ticketCode: string): Promise<Reservation | null>;
  findByUserId(userId: string): Promise<Reservation[]>;
  findByEventId(eventId: string): Promise<Reservation[]>;
  findAll(): Promise<Reservation[]>;
  update(id: string, data: Partial<Reservation>): Promise<Reservation | null>;
  updateStatus(id: string, status: ReservationStatus): Promise<Reservation | null>;
  delete(id: string): Promise<boolean>;
}
