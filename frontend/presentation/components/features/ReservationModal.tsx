'use client';

import React, { useState } from 'react';
import { useAuth } from '@/presentation/hooks/useAuth';

// Icon components
const X = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

interface Event {
  id: string;
  title: string;
  hero?: { url: string };
  dateTime: {
    start: string;
    end?: string | null;
  };
  location?: {
    venue?: string;
    city?: string;
  };
  pricing?: {
    currency: string;
    basePrice: number;
  };
  capacity: {
    total: number;
    available: number;
  };
}

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
  onSubmit?: (reservationData: any) => void;
}

interface TicketType {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

// Format date helper
function formatEventDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'long',
    month: 'long', 
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  event,
  onSubmit
}) => {
  const { user } = useAuth();
  
  // Default pricing for free events
  const basePrice = event.pricing?.basePrice ?? 0;
  const currency = event.pricing?.currency ?? 'MAD';
  
  const [tickets, setTickets] = useState<TicketType[]>([
    { id: 'general', name: `${event.title} Ticket`, price: basePrice, quantity: 0 }
  ]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculations
  const totalTickets = tickets.reduce((sum, t) => sum + t.quantity, 0);
  const subtotal = tickets.reduce((sum, t) => sum + (t.price * t.quantity), 0);
  const serviceFee = subtotal > 0 ? subtotal * 0.1 : 0;
  const total = subtotal + serviceFee;

  const handleTicketChange = (ticketId: string, change: number) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const newQuantity = Math.max(0, Math.min(10, t.quantity + change));
        return { ...t, quantity: newQuantity };
      }
      return t;
    }));
  };

  const handleSubmit = () => {
    if (isSubmitting || totalTickets === 0 || !user) return;
    
    setIsSubmitting(true);
    
    const reservationData = {
      eventId: event.id,
      tickets: tickets.filter(t => t.quantity > 0),
      customerInfo: {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email,
        phone: user.phone || ''
      },
      totals: { subtotal, serviceFee, total }
    };

    console.log('Reservation submitted:', reservationData);
    onSubmit?.(reservationData);
    
    // Close modal after submission
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Slide-in Panel */}
      <div className="relative w-full max-w-lg bg-white shadow-2xl flex flex-col ml-0 animate-slide-in-left">
        {/* Header */}
        <div className="flex-shrink-0 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Checkout</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Event Details at Top */}
            <div className="border-b border-gray-200 pb-6">
              {event.hero?.url && (
                <div className="w-full h-48 rounded-lg overflow-hidden mb-4">
                  <img
                    src={event.hero.url}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h3>
                <p className="text-sm text-gray-600">
                  {formatEventDate(event.dateTime.start)}
                </p>
                {event.location?.venue && (
                  <p className="text-sm text-gray-600 mt-1">
                    {event.location.venue}
                    {event.location.city && `, ${event.location.city}`}
                  </p>
                )}
              </div>
            </div>

            {/* Tickets Section */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Tickets</h4>
              
              {tickets.map(ticket => (
                <div key={ticket.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">{ticket.name}</h5>
                      <p className="text-lg font-bold text-gray-900 mt-1">
                        {ticket.price === 0 ? 'Free' : `${currency} ${ticket.price.toFixed(2)}`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label htmlFor={`quantity-${ticket.id}`} className="text-sm text-gray-600">
                      Quantity
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleTicketChange(ticket.id, -1)}
                        disabled={ticket.quantity === 0}
                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-bold text-gray-700 transition-colors"
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-semibold text-gray-900">{ticket.quantity}</span>
                      <button
                        type="button"
                        onClick={() => handleTicketChange(ticket.id, 1)}
                        disabled={ticket.quantity >= 10 || ticket.quantity >= event.capacity.available}
                        className="w-8 h-8 rounded-full bg-orange-500 hover:bg-orange-600 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-bold text-white transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  {event.capacity.available <= 10 && (
                    <p className="text-xs text-red-600 mt-2">
                      Only {event.capacity.available} tickets remaining
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Order Summary */}
            {totalTickets > 0 && (
              <div className="border-t border-gray-200 pt-6 space-y-4">
                <h4 className="font-semibold text-gray-900">Order Summary</h4>
                
                <div className="space-y-2">
                  {tickets.filter(t => t.quantity > 0).map(ticket => (
                    <div key={ticket.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {ticket.quantity} x {ticket.name}
                      </span>
                      <span className="text-gray-900 font-medium">
                        {ticket.price === 0 ? 'Free' : `${currency} ${(ticket.price * ticket.quantity).toFixed(2)}`}
                      </span>
                    </div>
                  ))}
                  
                  {subtotal > 0 && (
                    <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                      <span className="text-gray-600">Service Fee</span>
                      <span className="text-gray-900 font-medium">
                        {currency} {serviceFee.toFixed(2)}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-300">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">
                      {total === 0 ? 'Free' : `${currency} ${total.toFixed(2)}`}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer with CTA */}
        <div className="flex-shrink-0 border-t border-gray-200 bg-white p-6">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={totalTickets === 0 || isSubmitting}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors text-base"
          >
            {isSubmitting ? 'Processing...' : (total === 0 ? 'Register for Free' : `Checkout ${currency} ${total.toFixed(2)}`)}
          </button>
          <p className="text-xs text-gray-500 text-center mt-3">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export { ReservationModal };
export default ReservationModal;
