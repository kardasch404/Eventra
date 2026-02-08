'use client';

import Link from 'next/link';
import { useAppSelector } from '@/shared/store/hooks';

export function Navbar() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Eventra
          </Link>
          
          <div className="flex items-center gap-6">
            <Link href="/events" className="text-gray-700 hover:text-blue-600">
              Events
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link href="/reservations" className="text-gray-700 hover:text-blue-600">
                  My Reservations
                </Link>
                <Link href="/profile" className="text-gray-700 hover:text-blue-600">
                  {user?.firstName || 'Profile'}
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-blue-600">
                  Login
                </Link>
                <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
