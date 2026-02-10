'use client';

import { useQuery } from '@apollo/client/react';
import { GET_ADMIN_STATS } from '@/infrastructure/graphql/queries/admin.queries';
import Link from 'next/link';

// SVG Icon Components
const UsersIconLarge = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
  </svg>
);

const CalendarIconLarge = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
  </svg>
);

const SparklesIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
  </svg>
);

const TicketIconLarge = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const ArrowTrendingUpIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
  </svg>
);

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  gradient: string;
  iconBg: string;
  trend?: string;
}

function StatCard({ title, value, icon, gradient, iconBg, trend }: StatCardProps) {
  return (
    <div className="relative overflow-hidden bg-[#1a1a1a] rounded-2xl p-6 border border-gray-800/50 hover:border-gray-700/50 transition-all duration-300 group">
      {/* Background gradient */}
      <div className={`absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity ${gradient}`}></div>
      
      <div className="relative flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-4xl font-bold text-white">{value.toLocaleString()}</p>
          {trend && (
            <div className="flex items-center gap-1 text-green-400 text-sm">
              <ArrowTrendingUpIcon />
              <span>{trend}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${iconBg}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

interface QuickActionProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

function QuickAction({ href, icon, title, description, color }: QuickActionProps) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden p-6 bg-[#1a1a1a] border border-gray-800/50 rounded-2xl hover:border-orange-500/50 transition-all duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="relative">
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <h3 className="font-semibold text-white text-lg mb-2 group-hover:text-orange-400 transition-colors">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </Link>
  );
}

interface AdminStats {
  totalUsers: number;
  totalEvents: number;
  totalReservations: number;
  confirmedReservations: number;
  pendingReservations: number;
  publishedEvents: number;
}

interface AdminStatsData {
  adminStats: AdminStats;
}

export default function AdminDashboardPage() {
  const { data, loading, error } = useQuery<AdminStatsData>(GET_ADMIN_STATS);

  const stats = data?.adminStats || {
    totalUsers: 0,
    totalEvents: 0,
    totalReservations: 0,
    confirmedReservations: 0,
    pendingReservations: 0,
    publishedEvents: 0,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-6 rounded-2xl">
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>Error loading stats: {error.message}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-gray-400 mt-1">Welcome back! Here&apos;s what&apos;s happening with your events.</p>
        </div>
        <Link
          href="/admin/events/create"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40"
        >
          <PlusIcon />
          <span>Create Event</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<UsersIconLarge />}
          gradient="bg-gradient-to-br from-blue-500 to-blue-600"
          iconBg="bg-blue-500/20 text-blue-400"
          trend="+12% this month"
        />
        <StatCard
          title="Total Events"
          value={stats.totalEvents}
          icon={<CalendarIconLarge />}
          gradient="bg-gradient-to-br from-purple-500 to-purple-600"
          iconBg="bg-purple-500/20 text-purple-400"
        />
        <StatCard
          title="Published Events"
          value={stats.publishedEvents}
          icon={<SparklesIcon />}
          gradient="bg-gradient-to-br from-green-500 to-green-600"
          iconBg="bg-green-500/20 text-green-400"
        />
        <StatCard
          title="Total Reservations"
          value={stats.totalReservations}
          icon={<TicketIconLarge />}
          gradient="bg-gradient-to-br from-orange-500 to-orange-600"
          iconBg="bg-orange-500/20 text-orange-400"
        />
        <StatCard
          title="Confirmed"
          value={stats.confirmedReservations}
          icon={<CheckCircleIcon />}
          gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
          iconBg="bg-emerald-500/20 text-emerald-400"
        />
        <StatCard
          title="Pending"
          value={stats.pendingReservations}
          icon={<ClockIcon />}
          gradient="bg-gradient-to-br from-yellow-500 to-yellow-600"
          iconBg="bg-yellow-500/20 text-yellow-400"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-[#1a1a1a]/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800/50">
        <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickAction
            href="/admin/events/create"
            icon={<PlusIcon />}
            title="Create Event"
            description="Add a new event to your platform"
            color="bg-gradient-to-br from-orange-500 to-orange-600 text-white"
          />
          <QuickAction
            href="/admin/events"
            icon={<CalendarIconLarge />}
            title="Manage Events"
            description="View and edit all events"
            color="bg-purple-500/20 text-purple-400"
          />
          <QuickAction
            href="/admin/users"
            icon={<UsersIconLarge />}
            title="Manage Users"
            description="View users and manage roles"
            color="bg-blue-500/20 text-blue-400"
          />
          <QuickAction
            href="/admin/reservations"
            icon={<TicketIconLarge />}
            title="Reservations"
            description="View and manage bookings"
            color="bg-green-500/20 text-green-400"
          />
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="bg-[#1a1a1a]/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800/50">
        <h2 className="text-xl font-semibold text-white mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-[#0f0f0f] rounded-xl">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">New event created</p>
                <p className="text-sm text-gray-500">Just now</p>
              </div>
              <span className="text-xs text-gray-600 bg-gray-800 px-2 py-1 rounded">Event</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
