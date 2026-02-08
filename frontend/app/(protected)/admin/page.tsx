'use client';

import { useQuery } from '@apollo/client';
import { GET_ALL_EVENTS, GET_ALL_RESERVATIONS } from '@/infrastructure/graphql/queries';

function StatCard({ title, value, icon }: { title: string; value: number; icon: string }) {
  return (
    <div className="bg-[#2a2a2a] rounded-lg p-6 border border-gray-800">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-4xl font-bold text-white mt-2">{value}</p>
        </div>
        <div className="text-5xl">{icon}</div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { data: eventsData } = useQuery(GET_ALL_EVENTS);
  const { data: reservationsData } = useQuery(GET_ALL_RESERVATIONS);

  const totalEvents = eventsData?.allEvents?.length || 0;
  const totalReservations = reservationsData?.allReservations?.length || 0;
  const confirmedReservations =
    reservationsData?.allReservations?.filter((r: { status: string }) => r.status === 'CONFIRMED').length || 0;

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Events" value={totalEvents} icon="📅" />
        <StatCard title="Total Reservations" value={totalReservations} icon="🎫" />
        <StatCard title="Confirmed" value={confirmedReservations} icon="✅" />
      </div>

      <div className="bg-[#2a2a2a] rounded-lg p-6 border border-gray-800">
        <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          <a
            href="/admin/events"
            className="p-6 bg-[#1a1a1a] border border-gray-800 rounded-lg hover:border-orange-600 transition-colors group"
          >
            <h3 className="font-semibold text-white text-lg mb-2 group-hover:text-orange-500">Manage Events</h3>
            <p className="text-sm text-gray-400">Create, edit, or delete events</p>
          </a>
          <a
            href="/admin/reservations"
            className="p-6 bg-[#1a1a1a] border border-gray-800 rounded-lg hover:border-orange-600 transition-colors group"
          >
            <h3 className="font-semibold text-white text-lg mb-2 group-hover:text-orange-500">
              Manage Reservations
            </h3>
            <p className="text-sm text-gray-400">View and manage all reservations</p>
          </a>
        </div>
      </div>
    </div>
  );
}
