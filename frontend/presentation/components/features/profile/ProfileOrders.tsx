'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { OrderCard } from './OrderCard';

interface Reservation {
  id: string;
  ticketCode: string;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'USED';
  event: {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    location?: string;
    imageUrl?: string;
    organizer?: string;
  };
  price?: string;
  createdAt: string;
}

interface ProfileOrdersProps {
  reservations: Reservation[];
  isLoading?: boolean;
}

const ProfileOrders: React.FC<ProfileOrdersProps> = ({
  reservations,
  isLoading = false,
}) => {
  const [showPastOrders, setShowPastOrders] = useState(false);
  
  // Separate upcoming and past events
  const now = new Date();
  const upcomingOrders = reservations.filter(
    (r) => new Date(r.event.startDate) >= now
  );
  const pastOrders = reservations.filter(
    (r) => new Date(r.event.startDate) < now
  );

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse"
          >
            <div className="flex gap-4">
              <div className="w-16 h-20 bg-gray-200 rounded-lg"></div>
              <div className="w-32 h-32 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No orders yet
        </h3>
        <p className="text-gray-500 mb-6">
          When you purchase tickets to events, they&apos;ll appear here.
        </p>
        <Link
          href="/events"
          className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors"
        >
          Browse Events
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upcoming Events */}
      {upcomingOrders.length > 0 && (
        <section>
          <div className="space-y-4">
            {upcomingOrders.map((reservation, index) => (
              <OrderCard
                key={reservation.id}
                id={reservation.id}
                ticketCode={reservation.ticketCode}
                eventTitle={reservation.event.title}
                eventImage={reservation.event.imageUrl}
                eventDate={reservation.event.startDate}
                eventTime={formatTime(reservation.event.startDate)}
                location={reservation.event.location}
                orderDate={new Date(reservation.createdAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                price={reservation.price}
                status={reservation.status}
                isHero={index === 0}
              />
            ))}
          </div>
        </section>
      )}

      {/* Past Events Toggle */}
      {pastOrders.length > 0 && (
        <div className="past-orders">
          {/* Toggle Button */}
          <div className="flex justify-center pt-3">
            <button
              onClick={() => setShowPastOrders(!showPastOrders)}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
            >
              {showPastOrders ? 'Hide past orders' : 'See past orders'}
            </button>
          </div>

          {/* Past Orders List */}
          {showPastOrders && (
            <section className="pt-6 mt-4 border-t border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Past orders</h2>
              <div className="space-y-4">
                {pastOrders.map((reservation) => (
                  <OrderCard
                    key={reservation.id}
                    id={reservation.id}
                    ticketCode={reservation.ticketCode}
                    eventTitle={reservation.event.title}
                    eventImage={reservation.event.imageUrl}
                    eventDate={reservation.event.startDate}
                    eventTime={formatTime(reservation.event.startDate)}
                    location={reservation.event.location}
                    orderDate={new Date(reservation.createdAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                    price={reservation.price}
                    status={reservation.status}
                  />
                ))}
              </div>
              
              {/* Hide Button at Bottom */}
              <div className="flex justify-center pt-6">
                <button
                  onClick={() => setShowPastOrders(false)}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                >
                  Hide past orders
                </button>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export { ProfileOrders };
