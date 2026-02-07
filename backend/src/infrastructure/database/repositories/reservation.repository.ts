import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IReservationRepository } from '@core/interfaces/reservation.repository.interface';
import { Reservation } from '@core/entities/reservation.entity';
import { ReservationDocument } from '@infrastructure/database/schemas/reservation.schema';
import { ReservationStatus } from '@shared/enums/reservation-status.enum';

@Injectable()
export class ReservationRepository implements IReservationRepository {
  constructor(
    @InjectModel(ReservationDocument.name) private reservationModel: Model<ReservationDocument>,
  ) {}

  async create(reservation: Reservation): Promise<Reservation> {
    const created = await this.reservationModel.create(reservation);
    return this.toEntity(created);
  }

  async findById(id: string): Promise<Reservation | null> {
    const doc = await this.reservationModel.findOne({ id }).exec();
    return doc ? this.toEntity(doc) : null;
  }

  async findByTicketCode(ticketCode: string): Promise<Reservation | null> {
    const doc = await this.reservationModel.findOne({ ticketCode }).exec();
    return doc ? this.toEntity(doc) : null;
  }

  async findByUserId(userId: string): Promise<Reservation[]> {
    const docs = await this.reservationModel.find({ userId }).exec();
    return docs.map((doc) => this.toEntity(doc));
  }

  async findByEventId(eventId: string): Promise<Reservation[]> {
    const docs = await this.reservationModel.find({ eventId }).exec();
    return docs.map((doc) => this.toEntity(doc));
  }

  async findAll(): Promise<Reservation[]> {
    const docs = await this.reservationModel.find().exec();
    return docs.map((doc) => this.toEntity(doc));
  }

  async update(id: string, data: Partial<Reservation>): Promise<Reservation | null> {
    const doc = await this.reservationModel.findOneAndUpdate({ id }, data, { new: true }).exec();
    return doc ? this.toEntity(doc) : null;
  }

  async updateStatus(id: string, status: ReservationStatus): Promise<Reservation | null> {
    const doc = await this.reservationModel
      .findOneAndUpdate({ id }, { status }, { new: true })
      .exec();
    return doc ? this.toEntity(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.reservationModel.deleteOne({ id }).exec();
    return result.deletedCount > 0;
  }

  private toEntity(doc: ReservationDocument): Reservation {
    return new Reservation({
      id: doc.id,
      eventId: doc.eventId,
      userId: doc.userId,
      quantity: doc.quantity,
      status: doc.status,
      ticketCode: doc.ticketCode,
      confirmedAt: doc.confirmedAt,
      canceledAt: doc.canceledAt,
      createdAt: doc.createdAt as Date,
      updatedAt: doc.updatedAt as Date,
    });
  }
}
