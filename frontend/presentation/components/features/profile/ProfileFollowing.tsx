'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Organizer {
  id: string;
  name: string;
  avatarUrl?: string;
  followersCount: number;
  eventsCount: number;
}

interface ProfileFollowingProps {
  organizers: Organizer[];
  isLoading?: boolean;
}

const ProfileFollowing: React.FC<ProfileFollowingProps> = ({
  organizers,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (organizers.length === 0) {
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
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Not following anyone yet
        </h3>
        <p className="text-gray-500 mb-6">
          Follow event organizers to stay updated on their latest events.
        </p>
        <Link
          href="/events"
          className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors"
        >
          Discover Organizers
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {organizers.map((organizer) => (
        <OrganizerCard key={organizer.id} organizer={organizer} />
      ))}
    </div>
  );
};

interface OrganizerCardProps {
  organizer: Organizer;
}

const OrganizerCard: React.FC<OrganizerCardProps> = ({ organizer }) => {
  const initials = organizer.name
    .split(' ')
    .map((n) => n.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Link href={`/organizers/${organizer.id}`}>
      <article className="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          {organizer.avatarUrl ? (
            <Image
              src={organizer.avatarUrl}
              alt={organizer.name}
              width={64}
              height={64}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center flex-shrink-0">
              <span className="text-xl font-bold text-white">{initials}</span>
            </div>
          )}

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors truncate">
              {organizer.name}
            </h3>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
              <span>{organizer.followersCount.toLocaleString()} followers</span>
              <span>•</span>
              <span>{organizer.eventsCount} events</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={(e) => {
              e.preventDefault();
              // Handle unfollow
            }}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Following
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              // Handle view events
            }}
            className="px-4 py-2 text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
          >
            View Events
          </button>
        </div>
      </article>
    </Link>
  );
};

export { ProfileFollowing };
