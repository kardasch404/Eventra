'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface OrderCardProps {
  id: string;
  eventId: string; // Event ID for filtering tickets
  ticketCode: string;
  eventTitle: string;
  eventImage?: string;
  eventDate: string;
  eventTime?: string;
  location?: string;
  orderDate?: string;
  price?: string;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'USED';
  isHero?: boolean; // First/featured card - larger size
}

const OrderCard: React.FC<OrderCardProps> = ({
  id,
  eventId,
  ticketCode,
  eventTitle,
  eventImage,
  eventDate,
  eventTime,
  location,
  orderDate,
  price = 'Free',
  status,
  isHero = false,
}) => {
  // Parse date for the thumbnail
  const date = new Date(eventDate);
  const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const day = date.getDate();

  // Format full date
  const fullDate = date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  // Format time if provided
  const time = eventTime || date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  // Determine if event is upcoming or past
  const isUpcoming = date > new Date();
  const isPast = !isUpcoming;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="flex flex-col sm:flex-row">
        {/* Date Thumbnail - Desktop */}
        <div className={`hidden sm:flex flex-shrink-0 w-20 items-start justify-center pl-4 ${isHero ? 'pt-8' : 'pt-6'}`}>
          <div className="text-center">
            <p className={`font-bold text-orange-500 tracking-wide ${isHero ? 'text-base' : 'text-sm'}`}>{month}</p>
            <p className={`font-bold text-gray-800 ${isHero ? 'text-4xl' : 'text-3xl'}`}>{day}</p>
          </div>
        </div>

        {/* Event Image */}
        <Link 
          href={`/account/tickets?eventId=${eventId}`}
          className={`flex-shrink-0 relative overflow-hidden ${
            isHero 
              ? 'sm:w-[280px] h-44 sm:h-auto sm:my-4' 
              : 'sm:w-[200px] h-32 sm:h-auto sm:my-4'
          }`}
        >
          <div className="relative w-full h-full sm:rounded-lg overflow-hidden">
            {eventImage ? (
              <Image
                src={eventImage}
                alt={eventTitle}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center">
                <svg
                  className={`text-white/80 ${isHero ? 'w-16 h-16' : 'w-12 h-12'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
          </div>
          
          {/* Mobile Date Badge */}
          <div className="sm:hidden absolute top-2 left-2 bg-white rounded-lg px-2 py-1 shadow-md">
            <p className="text-xs font-bold text-orange-500">{month}</p>
            <p className="text-lg font-bold text-gray-800 leading-tight">{day}</p>
          </div>
        </Link>

        {/* Content */}
        <div className={`flex-1 min-w-0 ${isHero ? 'p-5 sm:pl-5' : 'p-4 sm:pl-4'}`}>
          <div className="flex flex-col h-full">
            {/* Title */}
            <Link href={`/account/tickets?eventId=${eventId}`}>
              <h3 className={`font-semibold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 mb-2 ${
                isHero ? 'text-xl' : 'text-lg'
              }`}>
                {eventTitle}
              </h3>
            </Link>

            {/* Date & Time */}
            <p className={`text-gray-600 mb-1 ${isHero ? 'text-base' : 'text-sm'}`}>
              {isUpcoming && date.getTime() - new Date().getTime() < 86400000 * 2 
                ? 'Tomorrow' 
                : fullDate} at {time}
            </p>

            {/* Order Info */}
            <div className={`text-gray-500 space-y-0.5 ${isHero ? 'text-base' : 'text-sm'}`}>
              <p>
                {price === 'Free' || price === '$0.00' 
                  ? `Free order #${ticketCode}` 
                  : `Order #${ticketCode} of (${price})`}
                {orderDate && ` placed on ${orderDate}`}
              </p>
              {location && (
                <p className="text-gray-400">{location}</p>
              )}
            </div>

            {/* Status Badge for past/cancelled events */}
            {(isPast || status === 'CANCELLED') && (
              <div className="mt-3">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                  status === 'CANCELLED' 
                    ? 'bg-red-50 text-red-700'
                    : status === 'USED'
                    ? 'bg-gray-100 text-gray-600'
                    : 'bg-green-50 text-green-700'
                }`}>
                  {status === 'CANCELLED' ? 'Cancelled' : status === 'USED' ? 'Attended' : 'Completed'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { OrderCard };
