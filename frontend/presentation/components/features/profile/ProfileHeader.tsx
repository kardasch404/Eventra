'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface ProfileHeaderProps {
  firstName: string;
  lastName: string;
  ordersCount: number;
  likesCount: number;
  followingCount: number;
}

// User icon SVG component (Eventbrite style)
const UserIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path 
      fillRule="evenodd" 
      clipRule="evenodd" 
      d="M5.2 19.1c1-2.8 3.7-4.7 6.7-4.7s5.7 1.9 6.7 4.7c-4.1 2.5-9.3 2.5-13.4 0zm16.1-1.9c-.5.5-1.1 1-1.7 1.5a8.15 8.15 0 00-7.6-5.2c-3.3 0-6.3 2.1-7.6 5.1-.6-.4-1.1-.9-1.6-1.4l-.8.7C4.8 20.6 8.4 22 12 22s7.2-1.4 10-4.1l-.7-.7z"
    />
    <path 
      fillRule="evenodd" 
      clipRule="evenodd" 
      d="M12 2C9.2 2 7 4.2 7 7s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 9c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z"
    />
  </svg>
);

// Edit pencil icon SVG component (Eventbrite style)
const EditIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M6 17l8-8 1 1-8 8-1-1zm-2-.3V20h3.3l9.8-9.8-3.3-3.3L4 16.7z" />
    <path fillRule="evenodd" clipRule="evenodd" d="M19.7 7.6c.3-.3.3-.9 0-1.3l-2.1-2.1c-.3-.3-.9-.3-1.3 0l-1.6 1.6L18 9.1l1.7-1.5z" />
  </svg>
);

// Stats divisor component (Eventbrite style)
const StatsDivisor: React.FC = () => (
  <span 
    className="inline-block w-px h-3 bg-gray-300 mx-3"
    aria-hidden="true"
  />
);

// Stats component (Eventbrite style)
const ProfileStats: React.FC<{ 
  ordersCount: number; 
  likesCount: number; 
  followingCount: number; 
  className?: string;
  vertical?: boolean;
}> = ({
  ordersCount,
  likesCount,
  followingCount,
  className = "",
  vertical = false
}) => (
  <div className={`flex items-center text-sm text-[#39364f] ${vertical ? 'flex-col gap-2' : ''} ${className}`}>
    <span data-spec="user-profile-tickets-stats">{ordersCount} orders</span>
    {!vertical && <StatsDivisor />}
    <Link 
      href="/profile/likes" 
      className="text-[#3659e3] hover:underline transition-colors"
      data-spec="user-profile-likes-stats"
    >
      {likesCount} likes
    </Link>
    {!vertical && <StatsDivisor />}
    <span data-spec="user-profile-following-stats">{followingCount} following</span>
  </div>
);

// Custom hook for fade-in animation on mount
const useFadeInUp = () => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return { isVisible, elementRef };
};

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  firstName,
  lastName,
  ordersCount,
  likesCount,
  followingCount,
}) => {
  const fullName = `${firstName} ${lastName}`;
  const { isVisible, elementRef } = useFadeInUp();

  return (
    <header className="relative bg-[#f8f7fa]">
      {/* Background container with wave pattern */}
      <div className="relative">
        {/* Wave pattern background */}
        <div 
          className="absolute bottom-0 left-0 right-0 w-full bg-no-repeat bg-bottom bg-contain pointer-events-none"
          style={{
            backgroundImage: 'url(https://cdn.evbstatic.com/s3-build/perm_001/71eda6/django/images/user_profile/wave_inverted.png)',
            height: '100%',
            paddingTop: '4%',
          }}
          aria-hidden="true"
        />
        
        {/* Content with fade-in-up animation */}
        <div 
          ref={elementRef}
          className={`
            relative z-10 
            max-w-4xl mx-auto
            flex items-center justify-start 
            py-12 px-4 sm:px-6 lg:px-8
            transition-all duration-500 ease-out
            ${isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-4'
            }
          `}
        >
          {/* User Icon - Large */}
          <div className="flex-shrink-0">
            <div className="w-28 h-28 rounded-full bg-white border border-gray-200 flex items-center justify-center">
              <UserIcon className="w-14 h-14 text-gray-500" />
            </div>
          </div>

          {/* User Info - Name and Stats */}
          <div className="pl-5">
            {/* Name with Edit Button */}
            <div className="flex items-center pb-2">
              <h1 className="text-2xl font-semibold text-[#1e0a3c] leading-tight">
                {fullName}
              </h1>
              <button
                type="button"
                className="ml-3 p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                title="Edit profile"
                onClick={() => window.location.href = '/account'}
              >
                <EditIcon className="w-4 h-4" />
                <span className="sr-only">Edit profile</span>
              </button>
            </div>

            {/* Stats - Below name */}
            <ProfileStats 
              ordersCount={ordersCount} 
              likesCount={likesCount} 
              followingCount={followingCount} 
            />
          </div>
        </div>
      </div>
    </header>
  );
};

// Sticky sidebar that appears when scrolling (detached header)
interface ProfileStickyHeaderProps {
  firstName: string;
  lastName: string;
  ordersCount: number;
  likesCount: number;
  followingCount: number;
  isVisible: boolean;
}

const ProfileStickyHeader: React.FC<ProfileStickyHeaderProps> = ({
  firstName,
  lastName,
  ordersCount,
  likesCount,
  followingCount,
  isVisible,
}) => {
  const fullName = `${firstName} ${lastName}`;

  return (
    <div 
      className={`
        hidden lg:block w-64 flex-shrink-0
        transition-all duration-300 ease-out
        ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
      aria-hidden={!isVisible}
    >
      <div className="sticky top-24">
        <div 
          className={`
            flex flex-col items-center text-center py-6
            transition-transform duration-300 ease-out
            ${isVisible ? 'translate-y-0' : '-translate-y-4'}
          `}
        >
          {/* User Icon - Large */}
          <div className="w-20 h-20 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm mb-4">
            <UserIcon className="w-10 h-10 text-gray-500" />
          </div>

          {/* Name */}
          <h2 className="text-lg font-semibold text-[#1e0a3c] mb-3">{fullName}</h2>

          {/* Stats - Single line: "5 orders 0 likes 5 following" */}
          <div className="text-sm text-[#39364f]">
            <span>{ordersCount} orders</span>
            <span className="mx-1">·</span>
            <Link 
              href="/profile/likes" 
              className="text-[#3659e3] hover:underline"
            >
              {likesCount} likes
            </Link>
            <span className="mx-1">·</span>
            <span>{followingCount} following</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Hook to detect scroll position with smooth threshold
const useScrollDetection = (threshold: number = 200) => {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setHasScrolled(window.scrollY > threshold);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return hasScrolled;
};

export { ProfileHeader, ProfileStickyHeader, useScrollDetection };
