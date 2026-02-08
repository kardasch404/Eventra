'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/presentation/components/ui';

export function EventFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    router.push(`/events?${params.toString()}`);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="font-semibold mb-4">Filters</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          placeholder="Search events..."
          defaultValue={searchParams.get('search') || ''}
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />
        <select
          className="px-3 py-2 border border-gray-300 rounded-lg"
          defaultValue={searchParams.get('category') || ''}
          onChange={(e) => handleFilterChange('category', e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Tech">Tech</option>
          <option value="Music">Music</option>
          <option value="Sports">Sports</option>
          <option value="Arts">Arts</option>
        </select>
        <Input
          placeholder="City"
          defaultValue={searchParams.get('city') || ''}
          onChange={(e) => handleFilterChange('city', e.target.value)}
        />
        <select
          className="px-3 py-2 border border-gray-300 rounded-lg"
          defaultValue={searchParams.get('type') || ''}
          onChange={(e) => handleFilterChange('type', e.target.value)}
        >
          <option value="">All Types</option>
          <option value="ONLINE">Online</option>
          <option value="IN_PERSON">In Person</option>
        </select>
      </div>
    </div>
  );
}
