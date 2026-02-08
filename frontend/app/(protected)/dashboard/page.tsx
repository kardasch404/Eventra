'use client';

import { useAuth } from '@/presentation/hooks';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p>Welcome, {user?.firstName}!</p>
    </div>
  );
}
