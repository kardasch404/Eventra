'use client';

import { useAuth } from '@/presentation/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ProfileHeader } from '@/presentation/components/features/profile';
import { Navbar } from '@/presentation/components/layouts/Navbar';
import { Footer } from '@/presentation/components/layouts/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { DateThumbnail } from '@/presentation/components/features/profile/DateThumbnail';

interface LikedEvent {
  id: string;
  title: string;
  startDate: string;
  location?: string;
  imageUrl?: string;
  organizer?: string;
  price?: number;
  isFree?: boolean;
}

// Mock data for demonstration
const mockLikedEvents: LikedEvent[] = [
  {
    id: 'e1',
    title: 'Summer Jazz Festival 2026',
    startDate: '2026-06-15T18:00:00Z',
    location: 'Central Park, New York',
    organizer: 'NYC Jazz Society',
    isFree: true,
  },
  {
    id: 'e2',
    title: 'Startup Pitch Night',
    startDate: '2026-03-28T19:00:00Z',
    location: 'Tech Hub, San Francisco',
    organizer: 'Founders Network',
    price: 25,
  },
  {
    id: 'e3',
    title: 'Modern Art Exhibition',
    startDate: '2026-04-05T10:00:00Z',
    location: 'Contemporary Art Museum',
    organizer: 'Art Collective SF',
    price: 15,
  },
];

export default function ProfileLikesPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [likedEvents] = useState<LikedEvent[]>(mockLikedEvents);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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

      {/* Profile Header */}
      <ProfileHeader
        firstName={user.firstName}
        lastName={user.lastName}
        email={user.email}
        ordersCount={0}
        likesCount={likedEvents.length}
        followingCount={0}
        activeTab="likes"
      />

      {/* Main Content */}
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Liked Events ({likedEvents.length})
            </h2>
            <p className="text-gray-500 mt-1">
              Events you&apos;ve saved will appear here
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse"
                >
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : likedEvents.length === 0 ? (
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
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No liked events yet
              </h3>
              <p className="text-gray-500 mb-6">
                When you like events, they&apos;ll appear here.
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {likedEvents.map((event) => (
                <LikedEventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

interface LikedEventCardProps {
  event: LikedEvent;
}

const LikedEventCard: React.FC<LikedEventCardProps> = ({ event }) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <Link href={`/events/${event.id}`}>
      <article className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
        {/* Image */}
        <div className="relative h-48 bg-gradient-to-br from-orange-400 to-orange-600">
          {event.imageUrl ? (
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-16 h-16 text-white/50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {/* Like button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              // Handle unlike
            }}
            className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
          >
            <svg
              className="w-5 h-5 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Price badge */}
          <div className="absolute bottom-3 right-3">
            <span className="px-3 py-1 bg-white rounded-full text-sm font-semibold text-gray-900 shadow-md">
              {event.isFree ? 'Free' : `$${event.price}`}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex gap-3">
            <DateThumbnail date={event.startDate} size="sm" />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2">
                {event.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {formatTime(event.startDate)}
              </p>
              {event.location && (
                <p className="text-sm text-gray-500 truncate">{event.location}</p>
              )}
              {event.organizer && (
                <p className="text-sm text-gray-400 mt-1">
                  by {event.organizer}
                </p>
              )}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};
