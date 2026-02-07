import { Injectable } from '@nestjs/common';
import { Reservation } from '@core/entities/reservation.entity';
import { Event } from '@core/entities/event.entity';

@Injectable()
export class TicketTemplateService {
  applyTemplate(
    doc: PDFKit.PDFDocument,
    reservation: Reservation,
    event: Event,
    qrCodeUrl: string,
  ): void {
    this.addHeader(doc);
    this.addEventDetails(doc, event);
    this.addReservationDetails(doc, reservation);
    this.addQRCode(doc, qrCodeUrl);
    this.addFooter(doc);
  }

  private addHeader(doc: PDFKit.PDFDocument): void {
    doc.fontSize(28).fillColor('#2563eb').text('EVENTRA', { align: 'center' });
    doc.fontSize(16).fillColor('#64748b').text('Event Ticket', { align: 'center' });
    doc.moveDown(2);
  }

  private addEventDetails(doc: PDFKit.PDFDocument, event: Event): void {
    doc.fontSize(20).fillColor('#1e293b').text(event.title, { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).fillColor('#475569');
    doc.text(`Category: ${event.category}`);
    doc.text(`Type: ${event.type}`);
    doc.text(
      `Date: ${event.dateTime.start.toLocaleDateString()} - ${event.dateTime.end.toLocaleDateString()}`,
    );
    doc.text(`Location: ${event.location.city}, ${event.location.country}`);
    if (event.location.venue) {
      doc.text(`Venue: ${event.location.venue}`);
    }
    doc.moveDown(2);
  }

  private addReservationDetails(doc: PDFKit.PDFDocument, reservation: Reservation): void {
    doc.fontSize(14).fillColor('#1e293b').text('Reservation Details', { underline: true });
    doc.moveDown(0.5);

    doc.fontSize(12).fillColor('#475569');
    doc.text(`Ticket Code: ${reservation.ticketCode}`);
    doc.text(`Quantity: ${reservation.quantity} ticket(s)`);
    doc.text(`Status: ${reservation.status}`);
    doc.text(`Booked: ${reservation.createdAt.toLocaleDateString()}`);
    doc.moveDown(2);
  }

  private addQRCode(doc: PDFKit.PDFDocument, qrCodeUrl: string): void {
    const x = (doc.page.width - 150) / 2;
    doc.image(qrCodeUrl, x, doc.y, { width: 150, height: 150 });
    doc.moveDown(10);
  }

  private addFooter(doc: PDFKit.PDFDocument): void {
    doc
      .fontSize(10)
      .fillColor('#94a3b8')
      .text('Please present this ticket at the event entrance', { align: 'center' });
    doc.text('Powered by Eventra', { align: 'center' });
  }
}
