import { ReservationStatus } from '@shared/enums/reservation-status.enum';

export class Reservation {
  id: string; // UUID v7
  eventId: string; // UUID v7
  userId: string; // UUID v7
  quantity: number;
  status: ReservationStatus;
  ticketCode: string;
  createdAt: Date;
  confirmedAt?: Date;
  canceledAt?: Date;
  updatedAt: Date;

  constructor(data: Partial<Reservation>) {
    Object.assign(this, data);
    this.status = data.status ?? ReservationStatus.PENDING;
    this.createdAt = data.createdAt ?? new Date();
    this.updatedAt = data.updatedAt ?? new Date();
  }

  isPending(): boolean {
    return this.status === ReservationStatus.PENDING;
  }

  isConfirmed(): boolean {
    return this.status === ReservationStatus.CONFIRMED;
  }

  isCanceled(): boolean {
    return this.status === ReservationStatus.CANCELED;
  }

  canCancel(): boolean {
    return this.isConfirmed() || this.isPending();
  }

  confirm(): void {
    this.status = ReservationStatus.CONFIRMED;
    this.confirmedAt = new Date();
    this.updatedAt = new Date();
  }

  cancel(): void {
    this.status = ReservationStatus.CANCELED;
    this.canceledAt = new Date();
    this.updatedAt = new Date();
  }

  refuse(): void {
    this.status = ReservationStatus.REFUSED;
    this.updatedAt = new Date();
  }
}
