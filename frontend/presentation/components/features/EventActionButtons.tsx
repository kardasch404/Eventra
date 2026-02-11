'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/shared/store/hooks';
import { ReservationModal } from './ReservationModal';
import { useMutation } from '@apollo/client/react';
import { CREATE_RESERVATION } from '@/infrastructure/graphql/mutations/reservation.mutations';

export function ShareButton() {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: document.title,
        url: window.location.href,
      }).catch(console.error);
    }
  };

  return (
    <button 
      onClick={handleShare}
      className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
      aria-label="Share event"
    >
      <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L8 10H2L7 14L5 22L12 17L19 22L17 14L22 10H16L12 2Z"/>
      </svg>
    </button>
  );
}

export function LikeButton() {
  const handleLike = () => {
    // Add like functionality here
    console.log('Like button clicked');
  };

  return (
    <button 
      onClick={handleLike}
      className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
      aria-label="Like event"
    >
      <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" clipRule="evenodd" d="M18.8 6.2C18.1 5.4 17 5 16 5c-1 0-2 .4-2.8 1.2L12 7.4l-1.2-1.2C10 5.4 9 5 8 5c-1 0-2 .4-2.8 1.2-1.5 1.6-1.5 4.2 0 5.8l6.8 7 6.8-7c1.6-1.6 1.6-4.2 0-5.8zm-1.4 4.4L12 16.1l-5.4-5.5c-.8-.8-.8-2.2 0-3C7 7.2 7.5 7 8 7c.5 0 1 .2 1.4.6l2.6 2.7 2.7-2.7c.3-.4.8-.6 1.3-.6s1 .2 1.4.6c.8.8.8 2.2 0 3z"/>
      </svg>
    </button>
  );
}

export function FollowButton() {
  const handleFollow = () => {
    // Add follow functionality here
    console.log('Follow button clicked');
  };

  return (
    <button 
      onClick={handleFollow}
      className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors"
    >
      Follow
    </button>
  );
}

export function ContactButton() {
  const handleContact = () => {
    // Add contact functionality here
    console.log('Contact button clicked');
  };

  return (
    <button 
      onClick={handleContact}
      className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors"
    >
      Contact
    </button>
  );
}

export function FollowOrganizerButton() {
  const handleFollow = () => {
    // Add follow functionality here
    console.log('Follow organizer button clicked');
  };

  return (
    <button 
      onClick={handleFollow}
      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors"
    >
      Follow
    </button>
  );
}

export function ReportButton() {
  const handleReport = () => {
    // Add report functionality here
    console.log('Report button clicked');
  };

  return (
    <button 
      onClick={handleReport}
      className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"/>
      </svg>
      Report this event
    </button>
  );
}

export function ShowMapButton() {
  const handleShowMap = () => {
    // Add map functionality here
    console.log('Show map button clicked');
  };

  return (
    <button 
      onClick={handleShowMap}
      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
    >
      Show map
    </button>
  );
}

interface GetTicketsButtonProps {
  isFull: boolean;
  status: string;
  event: {
    id: string;
    title: string;
    dateTime: {
      start: string | null;
      end: string | null;
    };
    pricing?: {
      price: number;
      currency: string;
    };
    capacity: {
      total: number;
      available: number;
    };
    hero?: {
      url: string;
      alt?: string;
    };
  };
}

export function GetTicketsButton({ isFull, status, event }: GetTicketsButtonProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [ticketInfo, setTicketInfo] = useState<{ ticketCode: string; id: string } | null>(null);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const [createReservation, { loading }] = useMutation(CREATE_RESERVATION, {
    onCompleted: (data) => {
      console.log('Reservation created:', data);
      setTicketInfo({
        ticketCode: data.createReservation.ticketCode,
        id: data.createReservation.id
      });
      setIsModalOpen(false);
      setShowSuccessModal(true);
    },
    onError: (error) => {
      console.error('Reservation error:', error);
      alert(`Failed to create reservation: ${error.message}`);
    }
  });

  const handleGetTickets = () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Redirect to login page with return URL
      router.push(`/login?redirect=/events/${event.id}`);
      return;
    }

    // Check if user has permission (is a member/user)
    if (!user) {
      alert('You need to be logged in to reserve tickets.');
      return;
    }

    // Open reservation modal
    setIsModalOpen(true);
  };

  const handleReservationSubmit = async (reservationData: any) => {
    // Calculate total quantity from all ticket types
    const totalQuantity = reservationData.tickets.reduce(
      (sum: number, ticket: any) => sum + ticket.quantity,
      0
    );

    if (totalQuantity === 0) {
      alert('Please select at least one ticket');
      return;
    }

    try {
      await createReservation({
        variables: {
          input: {
            eventId: reservationData.eventId,
            quantity: totalQuantity
          }
        }
      });
    } catch (error) {
      console.error('Error submitting reservation:', error);
    }
  };

  const isDisabled = isFull || status !== 'PUBLISHED';

  return (
    <>
      <button
        disabled={isDisabled}
        onClick={handleGetTickets}
        className="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors text-lg"
      >
        {isFull ? 'Sold Out' : status !== 'PUBLISHED' ? 'Not Available' : 'Get tickets'}
      </button>

      {/* Reservation Modal */}
      <ReservationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        event={event}
        onSubmit={handleReservationSubmit}
      />

      {/* Success Modal */}
      {showSuccessModal && ticketInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowSuccessModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8">
            <div className="text-center">
              {/* Success Icon */}
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Reservation Confirmed!</h3>
              <p className="text-gray-600 mb-6">Your ticket has been successfully reserved.</p>
              
              {/* Ticket Code Display */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <p className="text-sm text-gray-600 mb-2">Your Ticket Code</p>
                <p className="text-3xl font-bold text-blue-600 tracking-wider">{ticketInfo.ticketCode}</p>
                <p className="text-xs text-gray-500 mt-2">Save this code for event entry</p>
              </div>

              {/* Event Details */}
              <div className="text-left bg-blue-50 rounded-lg p-4 mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-1">{event.title}</p>
                <p className="text-xs text-gray-600">
                  {event.dateTime?.start && new Date(event.dateTime.start).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/account/tickets')}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                  View My Tickets
                </button>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
