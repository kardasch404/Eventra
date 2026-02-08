'use client';

import { ProtectedRoute } from '@/presentation/components/guards';
import { useAuth } from '@/presentation/hooks';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <p>Welcome, {user?.firstName}!</p>
      </div>
    </ProtectedRoute>
  );
}
