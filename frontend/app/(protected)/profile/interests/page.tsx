'use client';

import { useAuth } from '@/presentation/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  ProfileHeader,
  ProfileInterests,
} from '@/presentation/components/features/profile';
import { Navbar } from '@/presentation/components/layouts/Navbar';
import { Footer } from '@/presentation/components/layouts/Footer';

export default function ProfileInterestsPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    '1',
    '9',
    '13',
  ]); // Mock: Music, Technology, Gaming
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

  const handleInterestsChange = (interests: string[]) => {
    setSelectedInterests(interests);
    // TODO: Save interests to backend
    console.log('Saving interests:', interests);
  };

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
        followingCount={0}
        activeTab="interests"
      />

      {/* Main Content */}
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProfileInterests
            selectedInterests={selectedInterests}
            onInterestsChange={handleInterestsChange}
            isLoading={isLoading}
            isEditable={true}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
