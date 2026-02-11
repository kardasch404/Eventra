'use client';

import { useQuery, useMutation } from '@apollo/client/react';
import { GET_MY_RESERVATIONS } from '@/infrastructure/graphql/queries/reservation.queries';
import { CANCEL_RESERVATION } from '@/infrastructure/graphql/mutations/reservation.mutations';
import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import Image from 'next/image';
import { useAppSelector } from '@/shared/store/hooks';
import { useSearchParams } from 'next/navigation';
import jsPDF from 'jspdf';

interface Reservation {
  id: string;
  eventId: string;
  ticketCode: string;
  status: string;
  quantity: number;
  createdAt: string;
}

interface MyReservationsData {
  myReservations: Reservation[];
}

export default function MyTicketsPage() {
  const { data, loading, error, refetch } = useQuery<MyReservationsData>(GET_MY_RESERVATIONS);
  const { user } = useAppSelector((state) => state.auth);
  const searchParams = useSearchParams();
  const eventId = searchParams.get('eventId');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your tickets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-md">
          <p className="text-red-600 mb-4">Error loading tickets: {error.message}</p>
          <a href="/events" className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
            Browse Events
          </a>
        </div>
      </div>
    );
  }

  const allReservations: Reservation[] = data?.myReservations || [];
  
  // Filter by eventId if provided in URL
  const reservations = eventId 
    ? allReservations.filter(r => r.eventId === eventId)
    : allReservations;

  if (reservations.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {eventId ? 'Event Tickets' : 'My Tickets'}
            </h1>
            {eventId && (
              <a 
                href="/account/tickets"
                className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
              >
                View all tickets
              </a>
            )}
          </div>
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            <p className="text-gray-600 text-lg mb-6">
              {eventId 
                ? "You don't have any tickets for this event." 
                : "You don't have any tickets yet."}
            </p>
            <a href="/events" className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium">
              Browse Events
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {eventId ? 'Event Tickets' : 'My Tickets'}
          </h1>
          {eventId && (
            <a 
              href="/account/tickets"
              className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
            >
              View all tickets
            </a>
          )}
        </div>
        
        <div className="space-y-8">
          {reservations.map((reservation) => (
            <TicketCard key={reservation.id} reservation={reservation} user={user} onCancel={refetch} />
          ))}
        </div>
      </div>
    </div>
  );
}


function TicketCard({ reservation, user, onCancel }: { reservation: Reservation; user: any; onCancel?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [cancelReservation, { loading: canceling }] = useMutation(CANCEL_RESERVATION);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    sendConfirmation: false,
  });

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, reservation.ticketCode, {
        width: 152,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
    }
  }, [reservation.ticketCode]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      sendConfirmation: false,
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement save functionality with GraphQL mutation
    console.log('Saving ticket info:', formData);
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleDownloadTicket = async () => {
    try {
      const pdf = new jsPDF();
      
      // Add title
      pdf.setFontSize(20);
      pdf.text('Event Ticket', 105, 20, { align: 'center' });
      
      // Add ticket details
      pdf.setFontSize(12);
      pdf.text(`Ticket Code: ${reservation.ticketCode}`, 20, 40);
      pdf.text(`Order ID: ${reservation.id.slice(0, 11)}`, 20, 50);
      pdf.text(`Quantity: ${reservation.quantity}`, 20, 60);
      pdf.text(`Status: ${reservation.status}`, 20, 70);
      pdf.text(`Date: ${new Date(reservation.createdAt).toLocaleDateString()}`, 20, 80);
      
      // Generate QR code as data URL
      if (canvasRef.current) {
        const qrDataUrl = canvasRef.current.toDataURL('image/png');
        pdf.addImage(qrDataUrl, 'PNG', 70, 100, 70, 70);
      }
      
      // Add footer
      pdf.setFontSize(10);
      pdf.text('Present this ticket at the event entrance', 105, 190, { align: 'center' });
      
      // Download
      pdf.save(`ticket-${reservation.ticketCode}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to download ticket. Please try again.');
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      return;
    }

    try {
      await cancelReservation({
        variables: { id: reservation.id }
      });
      alert('Order cancelled successfully');
      onCancel?.();
    } catch (error: any) {
      console.error('Error cancelling order:', error);
      alert(error.message || 'Failed to cancel order. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="lg:flex">
        {/* Sidebar */}
        <aside className="lg:w-1/3 bg-white border-r border-gray-200">
          {/* Event Image */}
          <div className="relative w-full aspect-[2/1] bg-gradient-to-br from-orange-400 to-pink-500">
            <Image
              src="/img/event.png"
              alt="Event"
              fill
              className="object-cover"
            />
          </div>

          {/* Event Info */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-3">
              <a href={`/events/${reservation.eventId}`} className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 hover:text-orange-600 transition-colors">
                  Event Ticket
                </h3>
              </a>
              <button
                type="button"
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Share event"
                title="Share event"
              >
                <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4 7 9l1.414 1.414L11 7.829V16h2V7.828l2.586 2.585L16.999 9zm6 12v2H5.999v-2H4v4h16v-4z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-1">
              {new Date(reservation.createdAt).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })} • {new Date(reservation.createdAt).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
            <p className="text-sm text-gray-600 mb-6">Location TBD</p>

            {/* QR Code */}
            <div className="my-8">
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block mx-auto">
                <canvas ref={canvasRef} />
              </div>
              <p className="text-sm font-semibold text-gray-700 mt-4 text-center">
                Event Ticket • Ticket 1 of {reservation.quantity}
              </p>
            </div>

            {/* Download Button */}
            <div className="mb-3">
              <button
                type="button"
                onClick={handleDownloadTicket}
                className="w-full py-3 px-4 bg-white border-2 border-gray-300 rounded-md text-gray-900 font-semibold hover:bg-gray-50 transition-colors"
              >
                Download tickets
              </button>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 mb-6">
              <button
                type="button"
                onClick={handleCancelOrder}
                disabled={canceling || reservation.status === 'CANCELED'}
                className="w-full py-3 px-4 bg-white border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {canceling ? 'Canceling...' : reservation.status === 'CANCELED' ? 'Order Canceled' : 'Cancel Order'}
              </button>

              <button
                type="button"
                className="w-full py-3 px-4 text-orange-600 font-medium hover:bg-orange-50 rounded-md transition-colors"
              >
                Contact the organizer
              </button>
            </div>

            {/* Order Details */}
            <div className="pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-900 font-medium mb-1">
                Free Order {reservation.id.slice(0, 11)}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                {new Date(reservation.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
              <a href="#" className="text-sm font-semibold text-gray-900 hover:text-orange-600 transition-colors">
                Report this event
              </a>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="lg:w-2/3 p-6 sm:p-8">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 border-b border-gray-200 bg-white">
              <h3 className="text-xl font-semibold text-gray-900 mb-2 sm:mb-0">
                Event Ticket
              </h3>
              <button
                type="button"
                onClick={handleEdit}
                disabled={isEditing}
                className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                </svg>
                Edit
              </button>
            </div>

            {/* Form */}
            <div className="p-6">
              <form onSubmit={handleSave}>
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div>
                    <label htmlFor="firstName" className="block text-sm text-gray-600 mb-2">
                      First Name <span className="text-red-600">*</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-400">{formData.firstName || '-'}</p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label htmlFor="lastName" className="block text-sm text-gray-600 mb-2">
                      Last Name <span className="text-red-600">*</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-400">{formData.lastName || '-'}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm text-gray-600 mb-2">
                      Email <span className="text-red-600">*</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-400">{formData.email || '-'}</p>
                    )}
                  </div>

                  {/* Delivery Method */}
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Delivery Method</label>
                    <p className="text-gray-400">eTicket</p>
                  </div>
                </div>

                {/* Send Confirmation Checkbox */}
                {isEditing && (
                  <div className="mt-4">
                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        name="sendConfirmation"
                        checked={formData.sendConfirmation}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                      />
                      Send confirmation email to new attendee
                    </label>
                  </div>
                )}

                {/* Ticket Code Display */}
                <div className="mt-8 p-6 bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg border border-orange-200">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Your Ticket Code</p>
                    <p className="text-2xl md:text-3xl font-bold text-orange-600 tracking-wider font-mono break-all">
                      {reservation.ticketCode}
                    </p>
                    <p className="text-xs text-gray-500 mt-3">Present this code at the event entrance</p>
                  </div>
                </div>

                {/* Status and Quantity */}
                <div className="flex flex-wrap items-center gap-3 mt-6">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    reservation.status === 'CONFIRMED' 
                      ? 'bg-green-100 text-green-800' 
                      : reservation.status === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {reservation.status}
                  </span>
                  <span className="text-sm text-gray-600 font-medium">
                    Quantity: {reservation.quantity}
                  </span>
                </div>

                {/* Action Buttons for Edit Mode */}
                {isEditing && (
                  <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-orange-600 text-white rounded-md font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
