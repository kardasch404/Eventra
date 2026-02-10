'use client';

import { useAuth } from '@/presentation/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  ProfileHeader,
  ProfileFollowing,
} from '@/presentation/components/features/profile';
import { Navbar } from '@/presentation/components/layouts/Navbar';
import { Footer } from '@/presentation/components/layouts/Footer';

// Mock data for demonstration - replace with actual API calls
const mockOrganizers = [
  {
    id: 'org1',
    name: 'TechEvents Inc.',
    avatarUrl: undefined,
    followersCount: 15420,
    eventsCount: 48,
  },
  {
    id: 'org2',
    name: 'Bay Area Concerts',
    avatarUrl: undefined,
    followersCount: 89500,
    eventsCount: 125,
  },
  {
    id: 'org3',
    name: 'DevLearn Academy',
    avatarUrl: undefined,
    followersCount: 32100,
    eventsCount: 67,
  },
];

export default function ProfileFollowingPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [organizers] = useState(mockOrganizers);
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
        likesCount={0}
        followingCount={organizers.length}
        activeTab="following"
      />

      {/* Main Content */}
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Following ({organizers.length})
            </h2>
            <p className="text-gray-500 mt-1">
              Organizers you follow will appear here
            </p>
          </div>
          <ProfileFollowing organizers={organizers} isLoading={isLoading} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
