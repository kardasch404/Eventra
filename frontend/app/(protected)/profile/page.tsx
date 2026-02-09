'use client';

import { useAuth } from '@/presentation/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  ProfileHeader,
  ProfileStickyHeader,
  ProfileOrders,
  useScrollDetection,
} from '@/presentation/components/features/profile';
import { Navbar } from '@/presentation/components/layouts/Navbar';
import { Footer } from '@/presentation/components/layouts/Footer';

// Mock data for demonstration - replace with actual API calls
const mockReservations = [
  {
    id: '1',
    ticketCode: '13932854783',
    status: 'CONFIRMED' as const,
    event: {
      id: 'e1',
      title: 'Odoo Business Show Casablanca',
      startDate: '2026-02-10T18:00:00Z',
      endDate: '2026-02-10T22:00:00Z',
      location: 'Casablanca Convention Center',
      imageUrl: '/img/evnt.png',
      organizer: 'Odoo Morocco',
    },
    price: 'Free',
    createdAt: '2025-12-18T17:53:00Z',
  },
  {
    id: '2',
    ticketCode: '14142627173',
    status: 'CONFIRMED' as const,
    event: {
      id: 'e2',
      title: 'Admission Day - Casablanca',
      startDate: '2026-03-14T10:00:00Z',
      endDate: '2026-03-14T18:00:00Z',
      location: 'Casablanca, Morocco',
      imageUrl: '/img/evnt.png',
      organizer: 'Education Fair Morocco',
    },
    price: 'Free',
    createdAt: '2026-01-27T09:14:00Z',
  },
  {
    id: '3',
    ticketCode: '13932841953',
    status: 'CONFIRMED' as const,
    event: {
      id: 'e3',
      title: 'Jobs Fair Casablanca - 2026',
      startDate: '2026-05-30T10:00:00Z',
      endDate: '2026-05-30T18:00:00Z',
      location: 'Hyatt Regency Casablanca',
      imageUrl: '/img/evnt.png',
      organizer: 'Morocco Job Events',
    },
    price: 'Free',
    createdAt: '2025-12-18T17:50:00Z',
  },
  {
    id: '4',
    ticketCode: '14142709483',
    status: 'CONFIRMED' as const,
    event: {
      id: 'e4',
      title: 'iTrading Expo Morocco 2026 - June 6-7 (Financial Event)',
      startDate: '2026-06-06T10:00:00Z',
      endDate: '2026-06-07T18:00:00Z',
      location: 'Sofitel Casablanca',
      imageUrl: '/img/evnt.png',
      organizer: 'iTrading Global',
    },
    price: '$0.00',
    createdAt: '2026-01-27T09:39:00Z',
  },
  {
    id: '5',
    ticketCode: '14142729963',
    status: 'CONFIRMED' as const,
    event: {
      id: 'e5',
      title: 'MOROCCO SIEMA EXPO 2026',
      startDate: '2026-09-22T10:00:00Z',
      endDate: '2026-09-24T18:00:00Z',
      location: 'OFEC Casablanca',
      imageUrl: '/img/evnt.png',
      organizer: 'SIEMA Organization',
    },
    price: 'Free',
    createdAt: '2026-01-27T09:45:00Z',
  },
  {
    id: '6',
    ticketCode: '14142760903',
    status: 'USED' as const,
    event: {
      id: 'e6',
      title: 'STICKS & STONES Köln \'26 - Die Job- & Karrieremesse',
      startDate: '2026-01-31T10:00:00Z',
      endDate: '2026-01-31T18:00:00Z',
      location: 'Köln, Germany',
      imageUrl: '/img/evnt.png',
      organizer: 'STICKS & STONES',
    },
    price: '€0.00',
    createdAt: '2026-01-27T09:54:00Z',
  },
  {
    id: '7',
    ticketCode: '12660427613',
    status: 'USED' as const,
    event: {
      id: 'e7',
      title: 'New York City Hiring Event',
      startDate: '2025-10-28T09:30:00Z',
      endDate: '2025-10-28T16:00:00Z',
      location: 'New York, NY',
      imageUrl: '/img/evnt.png',
      organizer: 'NYC Career Events',
    },
    price: 'Free',
    createdAt: '2025-06-13T17:16:00Z',
  },
];

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [reservations] = useState(mockReservations);
  const [isLoadingOrders] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const hasScrolled = useScrollDetection(150);

  useEffect(() => {
    // Small delay to check auth state
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (!isAuthenticated) {
        router.push('/login');
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600">Loading profile...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* Profile Header - Standard (visible when not scrolled) */}
      <ProfileHeader
        firstName={user.firstName}
        lastName={user.lastName}
        ordersCount={reservations.length}
        likesCount={0}
        followingCount={5}
      />

      {/* Main Content with Sticky Sidebar */}
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {/* Sticky Sidebar - Appears when scrolled (detached header) */}
            <ProfileStickyHeader
              firstName={user.firstName}
              lastName={user.lastName}
              ordersCount={reservations.length}
              likesCount={0}
              followingCount={5}
              isVisible={hasScrolled}
            />

            {/* Orders Section */}
            <section className={`flex-1 min-w-0 ${hasScrolled ? 'lg:ml-0' : ''}`}>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Orders</h2>
              <ProfileOrders
                reservations={reservations}
                isLoading={isLoadingOrders}
              />
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
