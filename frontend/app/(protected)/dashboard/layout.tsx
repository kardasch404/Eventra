'use client';

import { ProtectedRoute } from '@/presentation/components/guards';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            <aside className="w-64 bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-6">Dashboard</h2>
              <nav className="space-y-2">
                <Link
                  href="/dashboard"
                  className={`block px-4 py-2 rounded ${pathname === '/dashboard' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
                >
                  Overview
                </Link>
                <Link
                  href="/dashboard/reservations"
                  className={`block px-4 py-2 rounded ${pathname === '/dashboard/reservations' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
                >
                  My Reservations
                </Link>
              </nav>
            </aside>
            <main className="flex-1">{children}</main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
