'use client';

import { useAuth } from '@/presentation/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import React from 'react';
import {
  ProfileHeader,
  ProfileStickyHeader,
  ProfileOrders,
  useScrollDetection,
} from '@/presentation/components/features/profile';
import { Navbar } from '@/presentation/components/layouts/Navbar';
import { Footer } from '@/presentation/components/layouts/Footer';
import { useQuery } from '@apollo/client/react';
import { GET_MY_RESERVATIONS } from '@/infrastructure/graphql/queries/reservation.queries';
import { GET_EVENTS } from '@/infrastructure/graphql/queries/event.queries';

interface Event {
  id: string;
  title: string;
  slug: string;
  dateTime: {
    start: string;
    end: string;
  };
  location?: {
    venue?: string;
    city?: string;
  };
  hero?: {
    url: string;
  };
}

interface Reservation {
  id: string;
  eventId: string;
  ticketCode: string;
  status: string;
  quantity: number;
  createdAt: string;
}

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const hasScrolled = useScrollDetection(150);

  // Fetch user's reservations
  const { data: reservationsData, loading: loadingReservations } = useQuery(GET_MY_RESERVATIONS);
  
  // Fetch all events to match with reservations
  const { data: eventsData, loading: loadingEvents } = useQuery(GET_EVENTS);

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

  // Transform data to match ProfileOrders expected format
  const transformedReservations = React.useMemo(() => {
    if (!reservationsData?.myReservations || !eventsData?.events) return [];

    const events: Event[] = Array.isArray(eventsData.events) ? eventsData.events : [];
    const reservations: Reservation[] = Array.isArray(reservationsData.myReservations) 
      ? reservationsData.myReservations 
      : [];

    return reservations.map((reservation) => {
      const event = events.find((e) => e.id === reservation.eventId);
      
      return {
        id: reservation.id,
        ticketCode: reservation.ticketCode,
        status: reservation.status as 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'USED',
        event: {
          id: event?.id || reservation.eventId,
          title: event?.title || 'Event',
          startDate: event?.dateTime?.start || new Date().toISOString(),
          endDate: event?.dateTime?.end || new Date().toISOString(),
          location: event?.location?.venue || event?.location?.city || 'TBD',
          imageUrl: event?.hero?.url || '/img/event.png',
          organizer: 'Organizer',
        },
        price: 'Free',
        createdAt: reservation.createdAt,
      };
    });
  }, [reservationsData, eventsData]);

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
        ordersCount={transformedReservations.length}
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
              ordersCount={transformedReservations.length}
              likesCount={0}
              followingCount={5}
              isVisible={hasScrolled}
            />

            {/* Orders Section */}
            <section className={`flex-1 min-w-0 ${hasScrolled ? 'lg:ml-0' : ''}`}>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Orders</h2>
              <ProfileOrders
                reservations={transformedReservations}
                isLoading={loadingReservations || loadingEvents}
              />
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
