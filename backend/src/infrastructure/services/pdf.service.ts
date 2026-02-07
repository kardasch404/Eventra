import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import { Reservation } from '@core/entities/reservation.entity';
import { Event } from '@core/entities/event.entity';
import { TicketTemplateService } from './ticket-template.service';
import { RedisService } from './redis.service';

@Injectable()
export class PdfService {
  constructor(
    private readonly ticketTemplateService: TicketTemplateService,
    private readonly redisService: RedisService,
  ) {}

  async generateTicket(reservation: Reservation, event: Event): Promise<Buffer> {
    const cacheKey = `ticket:${reservation.id}`;
    const cached = await this.redisService.get(cacheKey);

    if (cached) {
      return Buffer.from(cached, 'base64');
    }

    const qrCodeUrl = await QRCode.toDataURL(reservation.ticketCode, { width: 200 });

    const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      this.ticketTemplateService.applyTemplate(doc, reservation, event, qrCodeUrl);
      doc.end();
    });

    await this.redisService.set(cacheKey, pdfBuffer.toString('base64'), 86400);

    return pdfBuffer;
  }
}
