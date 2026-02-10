'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/shared/store/hooks';
import { ReservationModal } from './ReservationModal';

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
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

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
      />
    </>
  );
}
