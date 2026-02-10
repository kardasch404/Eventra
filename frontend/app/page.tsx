'use client';

import Link from 'next/link';
import { Navbar, Footer } from '@/presentation/components/layouts';
import { useQuery } from '@apollo/client/react';
import { GET_EVENTS } from '@/infrastructure/graphql/queries';

// ============================================
// EVENTBRITE-STYLE CATEGORY SVG ICONS
// ============================================

// Music Icon - Guitar/Music note style
const MusicIcon = () => (
  <svg className="w-12 h-12" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M52 4v36c0 6.627-7.163 12-16 12s-16-5.373-16-12 7.163-12 16-12c3.691 0 7.089.912 9.882 2.45L46 4h6z" fill="currentColor"/>
    <circle cx="36" cy="40" r="8" fill="currentColor" opacity="0.3"/>
    <path d="M46 8v24.764" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <path d="M12 20v28c0 4.418 4.477 8 10 8s10-3.582 10-8-4.477-8-10-8c-2.21 0-4.21.573-5.818 1.527L16 20h-4z" fill="currentColor" opacity="0.7"/>
  </svg>
);

// Nightlife Icon - Cocktail glass
const NightlifeIcon = () => (
  <svg className="w-12 h-12" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 8h32l-12 24v20h8v4H20v-4h8V32L16 8z" fill="currentColor"/>
    <path d="M20 12h24l-8 16h-8l-8-16z" fill="currentColor" opacity="0.3"/>
    <circle cx="44" cy="16" r="6" fill="currentColor" opacity="0.5"/>
    <path d="M44 10v12M38 16h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <ellipse cx="32" cy="8" rx="16" ry="2" fill="currentColor" opacity="0.2"/>
  </svg>
);

// Performing & Visual Arts Icon - Theater masks
const ArtsIcon = () => (
  <svg className="w-12 h-12" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 16c0-4.418 7.163-8 16-8s16 3.582 16 8v16c0 8.837-7.163 16-16 16S8 40.837 8 32V16z" fill="currentColor"/>
    <circle cx="16" cy="24" r="3" fill="white"/>
    <circle cx="32" cy="24" r="3" fill="white"/>
    <path d="M16 36c0-2 4-4 8-4s8 2 8 4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <path d="M24 48c0-4.418 7.163-8 16-8s16 3.582 16 8v8c0 4.837-7.163 8-16 8S24 60.837 24 56v-8z" fill="currentColor" opacity="0.7"/>
    <circle cx="32" cy="52" r="2" fill="white"/>
    <circle cx="48" cy="52" r="2" fill="white"/>
    <path d="M32 58c2 2 8 2 16 0" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Holidays Icon - Calendar with star
const HolidayIcon = () => (
  <svg className="w-12 h-12" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="12" width="48" height="44" rx="4" fill="currentColor"/>
    <rect x="8" y="12" width="48" height="12" fill="currentColor"/>
    <rect x="12" y="28" width="40" height="24" rx="2" fill="white" opacity="0.2"/>
    <rect x="16" y="4" width="4" height="16" rx="2" fill="currentColor"/>
    <rect x="44" y="4" width="4" height="16" rx="2" fill="currentColor"/>
    <path d="M32 32l2.47 5.01 5.53.8-4 3.9.94 5.5L32 44.75l-4.94 2.56.94-5.5-4-3.9 5.53-.8L32 32z" fill="white"/>
  </svg>
);

// Dating Icon - Heart
const DatingIcon = () => (
  <svg className="w-12 h-12" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 56S8 40 8 24c0-8.837 7.163-16 16-16 5.296 0 9.983 2.578 12.89 6.546L32 20l-4.89-5.454C30.017 10.578 34.704 8 40 8c8.837 0 16 7.163 16 16 0 16-24 32-24 32z" fill="currentColor"/>
    <path d="M24 16c-4.418 0-8 3.582-8 8 0 1.657.503 3.196 1.366 4.474" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
  </svg>
);

// Hobbies Icon - Game controller
const HobbiesIcon = () => (
  <svg className="w-12 h-12" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 24c-4.418 0-8 3.582-8 8v8c0 6.627 5.373 12 12 12h8c4.418 0 8-3.582 8-8v-4h-8c-6.627 0-12-5.373-12-16z" fill="currentColor" opacity="0.7"/>
    <path d="M52 24c4.418 0 8 3.582 8 8v8c0 6.627-5.373 12-12 12h-8c-4.418 0-8-3.582-8-8v-4h8c6.627 0 12-5.373 12-16z" fill="currentColor" opacity="0.7"/>
    <rect x="20" y="20" width="24" height="16" rx="8" fill="currentColor"/>
    <circle cx="26" cy="28" r="2" fill="white"/>
    <circle cx="38" cy="28" r="2" fill="white"/>
    <path d="M16 28h4M18 26v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="46" cy="30" r="2" fill="currentColor"/>
    <circle cx="50" cy="26" r="2" fill="currentColor"/>
  </svg>
);

// Business Icon - Briefcase/Building
const BusinessIcon = () => (
  <svg className="w-12 h-12" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="20" width="48" height="36" rx="4" fill="currentColor"/>
    <rect x="24" y="8" width="16" height="16" rx="2" fill="currentColor"/>
    <rect x="28" y="12" width="8" height="8" rx="1" fill="white" opacity="0.3"/>
    <path d="M8 28h48" stroke="white" strokeWidth="2" opacity="0.3"/>
    <rect x="28" y="24" width="8" height="12" rx="2" fill="white" opacity="0.5"/>
    <rect x="14" y="36" width="8" height="4" rx="1" fill="white" opacity="0.3"/>
    <rect x="42" y="36" width="8" height="4" rx="1" fill="white" opacity="0.3"/>
    <rect x="14" y="44" width="8" height="4" rx="1" fill="white" opacity="0.3"/>
    <rect x="42" y="44" width="8" height="4" rx="1" fill="white" opacity="0.3"/>
  </svg>
);

// Food & Drink Icon - Fork and knife with plate
const FoodDrinkIcon = () => (
  <svg className="w-12 h-12" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="36" r="20" fill="currentColor" opacity="0.3"/>
    <circle cx="32" cy="36" r="14" stroke="currentColor" strokeWidth="3"/>
    <path d="M12 8v20c0 2.21 1.79 4 4 4s4-1.79 4-4v-8h-2V8h-2v12h-2V8h-2z" fill="currentColor"/>
    <path d="M16 32v24" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <path d="M48 8c0 8-4 12-4 20v28" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <path d="M48 8c-4 0-6 4-6 12h12c0-8-2-12-6-12z" fill="currentColor"/>
  </svg>
);

// Health & Wellness Icon - Heart with pulse
const HealthIcon = () => (
  <svg className="w-12 h-12" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 56S8 40 8 24c0-8.837 7.163-16 16-16 5.296 0 9.983 2.578 12.89 6.546L32 20l-4.89-5.454C30.017 10.578 34.704 8 40 8c8.837 0 16 7.163 16 16 0 16-24 32-24 32z" fill="currentColor" opacity="0.3"/>
    <path d="M8 32h12l4-8 6 16 6-12 4 4h16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Sports & Fitness Icon - Running person
const SportsIcon = () => (
  <svg className="w-12 h-12" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="40" cy="12" r="6" fill="currentColor"/>
    <path d="M24 56l8-20-8-4 4-12 16 8-4 8 8 4-4 16" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M44 32l12-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    <path d="M24 24l-12 4" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
  </svg>
);

// ============================================
// UI ICONS
// ============================================

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

const HeartIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
  </svg>
);

const TicketIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 13v-2h4v2zm6 5V6h-.4C15 7.4 13.8 8.4 12 8.4S9 7.4 8.4 6H8v12h.4c.6-1.4 1.8-2.4 3.6-2.4s3 1 3.6 2.4zM14 4h4v16h-4s0-2.4-2-2.4-2 2.4-2 2.4H6V4h4s0 2.4 2 2.4S14 4 14 4z"/>
  </svg>
);

const ChevronLeftIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.766 7L8.83 12l4.936 5 1.397-1.414L11.623 12l3.54-3.585z"/>
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="m10.224 17 4.936-5-4.936-5-1.397 1.414L12.367 12l-3.54 3.585z"/>
  </svg>
);

const StarIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

const FireIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 23c-4.97 0-9-3.58-9-8 0-2.52 1.17-4.83 3-6.36V6a9 9 0 0 0 6 8.48V12a4 4 0 0 1 4-4c1.1 0 2 .9 2 2 0 2.21-1.79 4-4 4h-.17c1.37 1.59 2.17 3.65 2.17 5.86V21c0 1.1-.9 2-2 2h-2z"/>
  </svg>
);

// Helper to format date
function formatEventDate(dateString: string | null) {
  if (!dateString) return 'Date TBD';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

// Category data with SVG icons
const categories = [
  { name: 'Music', icon: MusicIcon, category: 'MUSIC', color: 'text-purple-600', bgColor: 'bg-purple-50' },
  { name: 'Nightlife', icon: NightlifeIcon, category: 'NIGHTLIFE', color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
  { name: 'Arts', icon: ArtsIcon, category: 'ARTS', color: 'text-pink-600', bgColor: 'bg-pink-50' },
  { name: 'Holidays', icon: HolidayIcon, category: 'HOLIDAY', color: 'text-red-600', bgColor: 'bg-red-50' },
  { name: 'Dating', icon: DatingIcon, category: 'SOCIAL', color: 'text-rose-600', bgColor: 'bg-rose-50' },
  { name: 'Hobbies', icon: HobbiesIcon, category: 'HOBBIES', color: 'text-green-600', bgColor: 'bg-green-50' },
  { name: 'Business', icon: BusinessIcon, category: 'BUSINESS', color: 'text-blue-600', bgColor: 'bg-blue-50' },
  { name: 'Food & Drink', icon: FoodDrinkIcon, category: 'FOOD_DRINK', color: 'text-orange-600', bgColor: 'bg-orange-50' },
  { name: 'Sports', icon: SportsIcon, category: 'SPORTS', color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
  { name: 'Health', icon: HealthIcon, category: 'HEALTH', color: 'text-teal-600', bgColor: 'bg-teal-50' },
];

// Top destinations - Moroccan cities with Unsplash images
const topDestinations = [
  { name: 'Casablanca', image: 'https://images.unsplash.com/photo-1577147443647-81856d5150a6?w=600&h=400&fit=crop', slug: 'casablanca' },
  { name: 'Marrakech', image: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=600&h=400&fit=crop', slug: 'marrakech' },
  { name: 'Rabat', image: 'https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?w=600&h=400&fit=crop', slug: 'rabat' },
  { name: 'Tangier', image: 'https://images.unsplash.com/photo-1553899017-92b0ffc5a3b9?w=600&h=400&fit=crop', slug: 'tangier' },
  { name: 'Fes', image: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=600&h=400&fit=crop', slug: 'fes' },
  { name: 'Agadir', image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600&h=400&fit=crop', slug: 'agadir' },
  { name: 'Meknes', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&h=400&fit=crop', slug: 'meknes' },
  { name: 'Oujda', image: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=600&h=400&fit=crop', slug: 'oujda' },
];

export default function HomePage() {
  const { data, loading } = useQuery(GET_EVENTS, {
    variables: {
      filters: { status: 'PUBLISHED' },
    },
  });

  const events = data?.events?.events?.slice(0, 8) || [];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        {/* Hero Banner - Image Only */}
        <section className="relative h-[300px] md:h-[400px] overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1920&h=800&fit=crop" 
              alt="Discover events in Morocco"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
                Discover Events in Morocco
              </h1>
              <p className="text-lg text-white/80">
                Find the best events happening near you
              </p>
            </div>
          </div>
        </section>

        {/* Category Browse Section */}
        <section className="py-10 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.category}
                  href={`/events?category=${cat.category}`}
                  className="flex flex-col items-center p-4 rounded-xl hover:shadow-lg transition-all duration-300 group"
                >
                  <div className={`w-16 h-16 rounded-full ${cat.bgColor} ${cat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <cat.icon />
                  </div>
                  <span className="text-sm font-medium text-gray-700 text-center group-hover:text-gray-900">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Tabs Section */}
        <section className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex gap-6 overflow-x-auto">
              {['All', 'For you', 'Today', 'This weekend'].map((tab, idx) => (
                <button
                  key={tab}
                  className={`py-4 px-2 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                    idx === 1 
                      ? 'border-orange-500 text-orange-600' 
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Recommendations Section */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                  <FireIcon />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Popular events near you</h2>
              </div>
              <Link href="/events" className="text-orange-600 hover:text-orange-700 font-semibold text-sm flex items-center gap-1">
                See all
                <ChevronRightIcon />
              </Link>
            </div>

            {/* Event Cards Grid */}
            {events.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {events.map((event: any, index: number) => (
                  <Link key={event.id} href={`/events/${event.slug}`} className="group">
                    <article className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                      {/* Event Image */}
                      <div className="relative aspect-[4/3]">
                        {event.hero?.url ? (
                          <img 
                            src={event.hero.url} 
                            alt={event.hero.alt || event.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600" />
                        )}
                        {/* Like Button */}
                        <button 
                          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md text-gray-500 hover:text-red-500 hover:scale-110 transition-all"
                          onClick={(e) => e.preventDefault()}
                        >
                          <HeartIcon />
                        </button>
                        {/* Featured Badge */}
                        {index < 2 && (
                          <div className="absolute top-3 left-3">
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-yellow-400 text-yellow-900">
                              <StarIcon />
                              Featured
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Event Details */}
                      <div className="p-4">
                        {/* Urgency Signal */}
                        {event.bookedCount > event.capacity * 0.7 && (
                          <div className="mb-2">
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                              <FireIcon />
                              Going fast
                            </span>
                          </div>
                        )}
                        
                        <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 mb-2 min-h-[48px]">
                          {event.title}
                        </h3>
                        
                        <p className="text-sm font-semibold text-orange-600 mb-1">
                          {formatEventDate(event.dateTime?.start)}
                        </p>
                        
                        <p className="text-sm text-gray-500 mb-3 line-clamp-1 flex items-center gap-1">
                          <LocationIcon />
                          {event.location?.venue || event.location?.city || 'Online'}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-bold text-gray-900">
                            {event.price?.amount === 0 ? (
                              <span className="text-green-600">Free</span>
                            ) : (
                              `From $${event.price?.amount || 0}`
                            )}
                          </p>
                          {event.attendeeCount > 0 && (
                            <p className="text-xs text-gray-500">
                              {event.attendeeCount} going
                            </p>
                          )}
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl border border-orange-100">
                <div className="w-24 h-24 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                  <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No events available yet</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">Be the first to create an amazing event in your area and start building your community!</p>
                <Link 
                  href="/admin/events/create" 
                  className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors shadow-lg hover:shadow-xl"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
                  </svg>
                  Create Your First Event
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Top Destinations Carousel */}
        <section className="py-10 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            {/* Carousel Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Top destinations in Morocco</h2>
              <div className="flex gap-2">
                <button className="p-2 rounded-full border border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50">
                  <ChevronLeftIcon />
                </button>
                <button className="p-2 rounded-full border border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors">
                  <ChevronRightIcon />
                </button>
              </div>
            </div>

            {/* Destination Cards */}
            <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
              {topDestinations.map((dest) => (
                <Link
                  key={dest.slug}
                  href={`/events?city=${dest.name}`}
                  className="relative flex-shrink-0 w-64 h-40 rounded-xl overflow-hidden group"
                >
                  <img 
                    src={dest.image} 
                    alt={dest.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback gradient if image fails to load
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-700/50 to-gray-900/50" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-xl font-bold text-white">{dest.name}</h3>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Cities Tags */}
        <section className="py-10 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Popular cities in Morocco</h2>
            <div className="flex flex-wrap gap-3">
              {[
                'Things to do in Casablanca',
                'Things to do in Marrakech',
                'Things to do in Rabat',
                'Things to do in Tangier',
                'Things to do in Fes',
                'Things to do in Agadir',
                'Things to do in Meknes',
                'Things to do in Oujda',
              ].map((tag) => {
                const city = tag.replace('Things to do in ', '');
                return (
                  <Link
                    key={tag}
                    href={`/events?city=${encodeURIComponent(city)}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 hover:shadow-md transition-shadow"
                  >
                    {tag}
                    <svg className="w-4 h-4 text-gray-400" viewBox="0 0 16 16" fill="currentColor">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12.291 3.618V3.617H6.217V4.936h3.868L3.572 11.351l.947.932 6.604-6.505v3.967h1.338V3.618h-.17z"/>
                    </svg>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Create Event CTA Section */}
        <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Create an event with Eventra
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Host memorable events with our easy-to-use platform. From small meetups to large conferences, 
              we've got you covered.
            </p>
            <Link 
              href="/admin/events/create"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-orange-600 font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
              </svg>
              Get Started - It&apos;s Free
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
