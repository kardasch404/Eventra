'use client';

import { useQuery } from '@apollo/client/react';
import { GET_ALL_EVENTS } from '@/infrastructure/graphql/queries';
import { Button } from '@/presentation/components/ui';
import { EventsTable } from '@/presentation/components/features/admin';
import Link from 'next/link';

export default function EventsManagementPage() {
  const { data, loading, error } = useQuery(GET_ALL_EVENTS);

  const events = data?.events?.events || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Events Management</h1>
          <p className="text-gray-400 mt-1">Create, edit, and manage your events</p>
        </div>
        <Link href="/admin/events/create">
          <Button className="bg-orange-600 hover:bg-orange-700">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Event
            </span>
          </Button>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-[#2a2a2a] rounded-lg p-4 border border-gray-800">
          <p className="text-gray-400 text-sm">Total Events</p>
          <p className="text-2xl font-bold text-white mt-1">{events.length}</p>
        </div>
        <div className="bg-[#2a2a2a] rounded-lg p-4 border border-gray-800">
          <p className="text-gray-400 text-sm">Published</p>
          <p className="text-2xl font-bold text-green-400 mt-1">
            {events.filter((e: { status: string }) => e.status === 'PUBLISHED').length}
          </p>
        </div>
        <div className="bg-[#2a2a2a] rounded-lg p-4 border border-gray-800">
          <p className="text-gray-400 text-sm">Drafts</p>
          <p className="text-2xl font-bold text-yellow-400 mt-1">
            {events.filter((e: { status: string }) => e.status === 'DRAFT').length}
          </p>
        </div>
        <div className="bg-[#2a2a2a] rounded-lg p-4 border border-gray-800">
          <p className="text-gray-400 text-sm">Canceled</p>
          <p className="text-2xl font-bold text-red-400 mt-1">
            {events.filter((e: { status: string }) => e.status === 'CANCELED').length}
          </p>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-400">Error loading events: {error.message}</p>
        </div>
      )}

      {/* Events Table */}
      <EventsTable events={events} isLoading={loading} />
    </div>
  );
}
