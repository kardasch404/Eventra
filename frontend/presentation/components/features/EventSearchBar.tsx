'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';

export function EventSearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (city) params.set('city', city);
    if (category) params.set('category', category);
    
    startTransition(() => {
      router.push(`/events?${params.toString()}`);
    });
  };

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'MUSIC', label: 'Music' },
    { value: 'BUSINESS', label: 'Business' },
    { value: 'FOOD_DRINK', label: 'Food & Drink' },
    { value: 'COMMUNITY', label: 'Community' },
    { value: 'ARTS', label: 'Arts' },
    { value: 'FILM', label: 'Film & Media' },
    { value: 'SPORTS', label: 'Sports & Fitness' },
    { value: 'HEALTH', label: 'Health' },
    { value: 'SCIENCE', label: 'Science & Tech' },
    { value: 'TRAVEL', label: 'Travel & Outdoor' },
    { value: 'CHARITY', label: 'Charity & Causes' },
    { value: 'SPIRITUALITY', label: 'Spirituality' },
    { value: 'FAMILY', label: 'Family & Education' },
    { value: 'HOLIDAY', label: 'Holiday' },
    { value: 'GOVERNMENT', label: 'Government' },
    { value: 'FASHION', label: 'Fashion' },
    { value: 'HOME', label: 'Home & Lifestyle' },
    { value: 'AUTO', label: 'Auto, Boat & Air' },
    { value: 'HOBBIES', label: 'Hobbies' },
    { value: 'SCHOOL', label: 'School Activities' },
    { value: 'OTHER', label: 'Other' },
  ];

  return (
    <form onSubmit={handleSearch} className="mb-8">
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <label htmlFor="search" className="sr-only">Search events</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                id="search"
                placeholder="Search events"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Location Input */}
          <div className="md:w-48">
            <label htmlFor="city" className="sr-only">Location</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <input
                type="text"
                id="city"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Category Select */}
          <div className="md:w-48">
            <label htmlFor="category" className="sr-only">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="block w-full py-3 px-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors disabled:opacity-50"
          >
            {isPending ? (
              <svg className="animate-spin h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Search'
            )}
          </button>
        </div>

        {/* Quick Filters */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-sm text-gray-500">Popular:</span>
          {['Music', 'Business', 'Food & Drink', 'Arts', 'Sports'].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => {
                setCategory(tag.toUpperCase().replace(' & ', '_'));
                startTransition(() => {
                  router.push(`/events?category=${tag.toUpperCase().replace(' & ', '_')}`);
                });
              }}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}
