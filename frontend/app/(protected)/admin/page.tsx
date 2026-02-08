'use client';

import { useQuery } from '@apollo/client';
import { GET_ALL_EVENTS, GET_ALL_RESERVATIONS } from '@/infrastructure/graphql/queries';

function StatCard({ title, value, icon }: { title: string; value: number; icon: string }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { data: eventsData } = useQuery(GET_ALL_EVENTS);
  const { data: reservationsData } = useQuery(GET_ALL_RESERVATIONS);

  const totalEvents = eventsData?.allEvents?.length || 0;
  const totalReservations = reservationsData?.allReservations?.length || 0;
  const confirmedReservations = reservationsData?.allReservations?.filter((r: any) => r.status === 'CONFIRMED').length || 0;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Events" value={totalEvents} icon="📅" />
        <StatCard title="Total Reservations" value={totalReservations} icon="🎫" />
        <StatCard title="Confirmed" value={confirmedReservations} icon="✅" />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          <a href="/admin/events" className="p-4 border rounded hover:bg-gray-50">
            <h3 className="font-semibold">Manage Events</h3>
            <p className="text-sm text-gray-600">Create, edit, or delete events</p>
          </a>
          <a href="/admin/reservations" className="p-4 border rounded hover:bg-gray-50">
            <h3 className="font-semibold">Manage Reservations</h3>
            <p className="text-sm text-gray-600">View and manage all reservations</p>
          </a>
        </div>
      </div>
    </div>
  );
}
