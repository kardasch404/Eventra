'use client';

import { useQuery } from '@apollo/client/react';
import { GET_ALL_EVENTS } from '@/infrastructure/graphql/queries';
import { Button } from '@/presentation/components/ui';
import { EventsTable } from '@/presentation/components/features/admin';
import Link from 'next/link';

// SVG Icons
const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
  </svg>
);

const SparklesIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
  </svg>
);

const DocumentIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

const XCircleIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  iconBg: string;
}

function StatCard({ title, value, icon, iconBg }: StatCardProps) {
  return (
    <div className="relative overflow-hidden bg-[#1a1a1a] rounded-2xl p-5 border border-gray-800/50 hover:border-gray-700/50 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${iconBg}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function EventsManagementPage() {
  const { data, loading, error } = useQuery(GET_ALL_EVENTS);

  const events = data?.events?.events || [];

  const publishedCount = events.filter((e: { status: string }) => e.status === 'PUBLISHED').length;
  const draftCount = events.filter((e: { status: string }) => e.status === 'DRAFT').length;
  const canceledCount = events.filter((e: { status: string }) => e.status === 'CANCELED').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Events Management</h1>
          <p className="text-gray-400 mt-1">Create, edit, and manage your events</p>
        </div>
        <Link href="/admin/events/create">
          <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/25">
            <span className="flex items-center gap-2">
              <PlusIcon />
              Create Event
            </span>
          </Button>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Events"
          value={events.length}
          icon={<CalendarIcon />}
          iconBg="bg-purple-500/20 text-purple-400"
        />
        <StatCard
          title="Published"
          value={publishedCount}
          icon={<SparklesIcon />}
          iconBg="bg-green-500/20 text-green-400"
        />
        <StatCard
          title="Drafts"
          value={draftCount}
          icon={<DocumentIcon />}
          iconBg="bg-yellow-500/20 text-yellow-400"
        />
        <StatCard
          title="Canceled"
          value={canceledCount}
          icon={<XCircleIcon />}
          iconBg="bg-red-500/20 text-red-400"
        />
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-red-400">Error loading events: {error.message}</p>
          </div>
        </div>
      )}

      {/* Events Table */}
      <EventsTable events={events} isLoading={loading} />
    </div>
  );
}
