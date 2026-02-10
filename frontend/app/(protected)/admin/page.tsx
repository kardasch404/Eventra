'use client';

import { useQuery } from '@apollo/client/react';
import { GET_ADMIN_STATS } from '@/infrastructure/graphql/queries/admin.queries';
import Link from 'next/link';

function StatCard({ title, value, icon, color }: { title: string; value: number; icon: string; color?: string }) {
  return (
    <div className="bg-[#2a2a2a] rounded-lg p-6 border border-gray-800 hover:border-gray-700 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className={`text-4xl font-bold mt-2 ${color || 'text-white'}`}>{value}</p>
        </div>
        <div className="text-5xl opacity-80">{icon}</div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { data, loading, error } = useQuery(GET_ADMIN_STATS);

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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg">
        Error loading stats: {error.message}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
      <p className="text-gray-400 mb-8">Welcome to the Eventra Admin Dashboard</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Users" value={stats.totalUsers} icon="👥" color="text-blue-400" />
        <StatCard title="Total Events" value={stats.totalEvents} icon="📅" color="text-purple-400" />
        <StatCard title="Published Events" value={stats.publishedEvents} icon="✨" color="text-green-400" />
        <StatCard title="Total Reservations" value={stats.totalReservations} icon="🎫" color="text-orange-400" />
        <StatCard title="Confirmed" value={stats.confirmedReservations} icon="✅" color="text-emerald-400" />
        <StatCard title="Pending" value={stats.pendingReservations} icon="⏳" color="text-yellow-400" />
      </div>

      <div className="bg-[#2a2a2a] rounded-lg p-6 border border-gray-800">
        <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/events/create"
            className="p-6 bg-[#1a1a1a] border border-gray-800 rounded-lg hover:border-orange-600 transition-colors group"
          >
            <div className="text-3xl mb-3">➕</div>
            <h3 className="font-semibold text-white text-lg mb-2 group-hover:text-orange-500">Create Event</h3>
            <p className="text-sm text-gray-400">Add a new event</p>
          </Link>
          <Link
            href="/admin/events"
            className="p-6 bg-[#1a1a1a] border border-gray-800 rounded-lg hover:border-orange-600 transition-colors group"
          >
            <div className="text-3xl mb-3">🎫</div>
            <h3 className="font-semibold text-white text-lg mb-2 group-hover:text-orange-500">Manage Events</h3>
            <p className="text-sm text-gray-400">View and edit events</p>
          </Link>
          <Link
            href="/admin/users"
            className="p-6 bg-[#1a1a1a] border border-gray-800 rounded-lg hover:border-orange-600 transition-colors group"
          >
            <div className="text-3xl mb-3">👤</div>
            <h3 className="font-semibold text-white text-lg mb-2 group-hover:text-orange-500">Manage Users</h3>
            <p className="text-sm text-gray-400">View users and roles</p>
          </Link>
          <Link
            href="/admin/reservations"
            className="p-6 bg-[#1a1a1a] border border-gray-800 rounded-lg hover:border-orange-600 transition-colors group"
          >
            <div className="text-3xl mb-3">📋</div>
            <h3 className="font-semibold text-white text-lg mb-2 group-hover:text-orange-500">Reservations</h3>
            <p className="text-sm text-gray-400">Manage bookings</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
