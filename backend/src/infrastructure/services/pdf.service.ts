import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import { Reservation } from '@core/entities/reservation.entity';
import { Event } from '@core/entities/event.entity';

@Injectable()
export class PdfService {
  async generateTicket(reservation: Reservation, event: Event): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      this.addTicketContent(doc, reservation, event);
      doc.end();
    });
  }

  private addTicketContent(doc: PDFKit.PDFDocument, reservation: Reservation, event: Event): void {
    doc.fontSize(24).text('EVENT TICKET', { align: 'center' });
    doc.moveDown();

    doc.fontSize(18).text(event.title, { align: 'center' });
    doc.moveDown();

    doc.fontSize(12);
    doc.text(`Ticket Code: ${reservation.ticketCode}`);
    doc.text(`Quantity: ${reservation.quantity}`);
    doc.text(`Status: ${reservation.status}`);
    doc.moveDown();

    doc.text(`Date: ${event.dateTime.start.toLocaleDateString()}`);
    doc.text(`Location: ${event.location.city}, ${event.location.country}`);
    doc.moveDown();

    this.addQRCode(doc, reservation.ticketCode);
  }

  private addQRCode(doc: PDFKit.PDFDocument, ticketCode: string): void {
    QRCode.toDataURL(ticketCode, { width: 200 })
      .then((url) => {
        doc.image(url, { fit: [200, 200], align: 'center' });
      })
      .catch(() => {
        doc.text('QR Code generation failed');
      });
  }
}
