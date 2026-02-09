'use client';

import Link from 'next/link';
import { useAppSelector } from '@/shared/store/hooks';
import { useState } from 'react';

export function Navbar() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-orange-500">eventra</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/events" className="text-gray-700 hover:text-orange-500 font-medium transition-colors">
              Find Events
            </Link>
            <Link href="/events/create" className="text-gray-700 hover:text-orange-500 font-medium transition-colors">
              Create Events
            </Link>
            <Link href="/help" className="text-gray-700 hover:text-orange-500 font-medium transition-colors">
              Help Center
            </Link>
          </div>

          {/* Auth Links */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link href="/reservations" className="text-gray-700 hover:text-orange-500 font-medium">
                  Tickets
                </Link>
                <Link href="/favorites" className="text-gray-400 hover:text-red-500 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </Link>
                <div className="relative group">
                  <button className="flex items-center gap-2 text-gray-700 hover:text-orange-500 font-medium">
                    <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">
                      {user?.firstName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block border border-gray-200">
                    <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Profile
                    </Link>
                    <Link href="/reservations" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      My Tickets
                    </Link>
                    <Link href="/events/manage" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Manage Events
                    </Link>
                    <hr className="my-2" />
                    <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Log Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-orange-500 font-medium transition-colors">
                  Log In
                </Link>
                <Link 
                  href="/register" 
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-3">
            <Link href="/events" className="block text-gray-700 hover:text-orange-500 font-medium py-2">
              Find Events
            </Link>
            <Link href="/events/create" className="block text-gray-700 hover:text-orange-500 font-medium py-2">
              Create Events
            </Link>
            <Link href="/help" className="block text-gray-700 hover:text-orange-500 font-medium py-2">
              Help Center
            </Link>
            <hr />
            {isAuthenticated ? (
              <>
                <Link href="/reservations" className="block text-gray-700 hover:text-orange-500 font-medium py-2">
                  My Tickets
                </Link>
                <Link href="/profile" className="block text-gray-700 hover:text-orange-500 font-medium py-2">
                  Profile
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="block text-gray-700 hover:text-orange-500 font-medium py-2">
                  Log In
                </Link>
                <Link 
                  href="/register" 
                  className="block bg-orange-500 text-white px-4 py-2 rounded-lg font-medium text-center hover:bg-orange-600"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
