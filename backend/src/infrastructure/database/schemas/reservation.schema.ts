import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ReservationStatus } from '@shared/enums/reservation-status.enum';

@Schema({ timestamps: true })
export class ReservationDocument extends Document {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  eventId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true, enum: ReservationStatus, default: ReservationStatus.PENDING })
  status: ReservationStatus;

  @Prop({ required: true, unique: true })
  ticketCode: string;

  @Prop()
  confirmedAt?: Date;

  @Prop()
  canceledAt?: Date;
}

export const ReservationSchema = SchemaFactory.createForClass(ReservationDocument);

ReservationSchema.index({ id: 1 }, { unique: true });
ReservationSchema.index({ eventId: 1 });
ReservationSchema.index({ userId: 1 });
ReservationSchema.index({ ticketCode: 1 }, { unique: true });
ReservationSchema.index({ status: 1 });
