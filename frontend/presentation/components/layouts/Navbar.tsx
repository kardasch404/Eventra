'use client';

import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/shared/store/hooks';
import { logout } from '@/shared/store/slices/auth.slice';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/infrastructure/services/auth-cookie.service';

// SVG Icons
const SearchIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M10 14c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm3.5.9c-1 .7-2.2 1.1-3.5 1.1-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6c0 1.3-.4 2.5-1.1 3.4l5.1 5.1-1.5 1.5-5-5.1z"/>
  </svg>
);

const LocationIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M11.6 11.6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm0-7.6C8.5 4 6 6.5 6 9.6 6 13.8 11.6 20 11.6 20s5.6-6.2 5.6-10.4c0-3.1-2.5-5.6-5.6-5.6z"/>
  </svg>
);

const PlusIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M13 11V4h-2v7H4v2h7v7h2v-7h7v-2z"/>
  </svg>
);

const HeartIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M18.8 6.2C18.1 5.4 17 5 16 5c-1 0-2 .4-2.8 1.2L12 7.4l-1.2-1.2C10 5.4 9 5 8 5c-1 0-2 .4-2.8 1.2-1.5 1.6-1.5 4.2 0 5.8l6.8 7 6.8-7c1.6-1.6 1.6-4.2 0-5.8zm-1.4 4.4L12 16.1l-5.4-5.5c-.8-.8-.8-2.2 0-3C7 7.2 7.5 7 8 7c.5 0 1 .2 1.4.6l2.6 2.7 2.7-2.7c.3-.4.8-.6 1.3-.6s1 .2 1.4.6c.8.8.8 2.2 0 3z"/>
  </svg>
);

const TicketIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 13v-2h4v2zm6 5V6h-.4C15 7.4 13.8 8.4 12 8.4S9 7.4 8.4 6H8v12h.4c.6-1.4 1.8-2.4 3.6-2.4s3 1 3.6 2.4zM14 4h4v16h-4s0-2.4-2-2.4-2 2.4-2 2.4H6V4h4s0 2.4 2 2.4S14 4 14 4z"/>
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 18c-1.2 0-2.4-.3-3.5-.7.6-1.3 2-2.2 3.5-2.2s2.9.9 3.5 2.2c-1.1.4-2.3.7-3.5.7zm6.5-2.9c-.4.4-.8.8-1.3 1.1a5.989 5.989 0 00-10.6 0c-.5-.3-.9-.7-1.3-1.1L4 16.5c2.1 2.3 5 3.5 8 3.5s5.9-1.3 8-3.5l-1.5-1.4z"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 4C9.7 4 7.8 5.9 7.8 8.2s1.9 4.2 4.2 4.2 4.2-1.9 4.2-4.2S14.3 4 12 4zm0 6.4c-1.2 0-2.2-1-2.2-2.2C9.8 7 10.8 6 12 6s2.2 1 2.2 2.2c0 1.2-1 2.2-2.2 2.2z"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M7 10.2l5 5 5-5-1.4-1.4-3.6 3.6-3.6-3.6z"/>
  </svg>
);

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// Eventra Logo SVG (inspired by Eventbrite's "e" logo)
const EventraLogo = () => (
  <svg className="h-5 w-auto" viewBox="0 0 1000 1214" fill="currentColor">
    <path d="M917 814.9L515.3 501.7c-6.7-5.1.2-15.4 7.5-11.3l156.9 87.9c71.1 39.9 161 16.8 204.1-52.4 45.4-73 21.4-169.1-53.2-212.2L600.4 180.6c-7.3-4.3-1.9-15.3 6-12.2l105.8 42.3c.2.1 2.7 1 3.7 1.3 11.2 3.9 23.3 6.1 35.9 6.1 57.4 0 104.5-45.4 108.6-99.4C865.5 48.9 812 0 748.2 0h-489c-62.8 0-115.5 51.3-114.7 113.9.4 33.3 15.3 63 38.7 83.4 17.6 15.3 76.9 62.8 105.1 85.3 5 4 2.2 12.1-4.3 12.1h-97.9C83.2 295.3 0 378.9 0 482c0 52.1 21.3 99.2 55.6 133.1l566.6 538.5c40.1 37.4 93.9 60.3 153.1 60.3 124.1 0 224.7-100.6 224.7-224.7 0-70.3-32.4-133.1-83-174.3z"/>
  </svg>
);

export function Navbar() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('Your Location');
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleLogout = () => {
    AuthService.clearTokens();
    dispatch(logout());
    setUserMenuOpen(false);
    router.push('/');
  };

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim());
    }
    if (location && location !== 'Your Location') {
      params.set('city', location);
    }
    const queryString = params.toString();
    router.push(`/events${queryString ? '?' + queryString : ''}`);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0" aria-label="Home">
            {/* Desktop Logo */}
            <div className="hidden md:flex items-center gap-1.5">
              <span className="text-orange-500">
                <EventraLogo />
              </span>
              <span className="text-xl font-bold text-gray-900 tracking-tight">eventra</span>
            </div>
            {/* Mobile Logo */}
            <div className="md:hidden text-orange-500">
              <EventraLogo />
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="flex items-center bg-gray-50 rounded-full border border-gray-200 hover:border-gray-300 transition-colors">
                {/* Search Input */}
                <div className="flex items-center flex-1 px-4 py-2">
                  <span className="text-gray-400 mr-2">
                    <SearchIcon />
                  </span>
                  <input
                    type="search"
                    placeholder="Search events"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none text-sm"
                  />
                </div>

                {/* Divider */}
                <div className="w-px h-6 bg-gray-300" />

                {/* Location Input */}
                <div className="flex items-center px-4 py-2 min-w-[180px]">
                  <span className="text-gray-400 mr-2">
                    <LocationIcon />
                  </span>
                  <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none text-sm"
                  />
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white p-2.5 rounded-full mr-1 transition-colors"
                  aria-label="Search"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M10 14c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm3.5.9c-1 .7-2.2 1.1-3.5 1.1-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6c0 1.3-.4 2.5-1.1 3.4l5.1 5.1-1.5 1.5-5-5.1z"/>
                  </svg>
                </button>
              </div>
            </form>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            {/* Likes */}
            <Link
              href="/favorites"
              className="flex items-center gap-1.5 px-3 py-2 text-gray-700 hover:text-gray-900 font-medium text-sm transition-colors"
            >
              <HeartIcon />
              <span>Likes</span>
            </Link>

            {/* Tickets */}
            <Link
              href="/account/tickets"
              className="flex items-center gap-1.5 px-3 py-2 text-gray-700 hover:text-gray-900 font-medium text-sm transition-colors"
            >
              <TicketIcon />
              <span>Tickets</span>
            </Link>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-1.5 px-3 py-2 text-gray-700 hover:text-gray-900 font-medium text-sm transition-colors"
                  >
                    <UserIcon />
                    <span className="max-w-[120px] truncate">{user?.email || 'Account'}</span>
                    <ChevronDownIcon />
                  </button>

                  {/* Dropdown Menu */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                      <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 text-sm">
                        <UserIcon />
                        My Profile
                      </Link>
                      <Link href="/account/tickets" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 text-sm">
                        <TicketIcon />
                        My Tickets
                      </Link>
                      {user?.roles?.includes('admin') && (
                        <Link href="/admin" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 text-sm">
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                          </svg>
                          Admin Panel
                        </Link>
                      )}
                      <hr className="my-2" />
                      <button 
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-gray-700 hover:bg-gray-50 text-sm text-left"
                        onClick={handleLogout}
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Log Out
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium text-sm transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium text-sm rounded-md transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Search Button */}
          <button
            className="md:hidden ml-auto p-2 text-gray-700"
            aria-label="Search"
          >
            <SearchIcon />
          </button>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearch}>
            <div className="flex items-center bg-gray-50 rounded-full border border-gray-200 px-4 py-2">
              <span className="text-gray-400 mr-2">
                <SearchIcon />
              </span>
              <input
                type="search"
                placeholder="Search events"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none text-sm"
              />
              <button
                type="submit"
                className="bg-orange-500 text-white p-2 rounded-full"
                aria-label="Search"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M10 14c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm3.5.9c-1 .7-2.2 1.1-3.5 1.1-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6c0 1.3-.4 2.5-1.1 3.4l5.1 5.1-1.5 1.5-5-5.1z"/>
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-1">
            {/* Location Input - Mobile */}
            <div className="flex items-center gap-2 px-3 py-3 bg-gray-50 rounded-lg mb-4">
              <LocationIcon />
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex-1 bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none text-sm"
              />
            </div>

            <Link 
              href="/favorites" 
              className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              <HeartIcon />
              Likes
            </Link>

            <Link 
              href="/account/tickets" 
              className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              <TicketIcon />
              Tickets
            </Link>

            <hr className="my-3" />

            {isAuthenticated ? (
              <>
                <div className="px-3 py-3 bg-gray-50 rounded-lg mb-2">
                  <p className="font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
                <Link 
                  href="/profile" 
                  className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <UserIcon />
                  My Profile
                </Link>
                {user?.roles?.includes('admin') && (
                  <Link 
                    href="/admin" 
                    className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                    </svg>
                    Admin Panel
                  </Link>
                )}
                <button 
                  className="flex items-center gap-3 w-full px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium text-left"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Log Out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link 
                  href="/login" 
                  className="px-4 py-3 text-center text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link 
                  href="/register" 
                  className="px-4 py-3 text-center bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
