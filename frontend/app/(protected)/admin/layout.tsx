'use client';

import { ProtectedRoute } from '@/presentation/components/guards';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <ProtectedRoute requiredPermission="admin:access">
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            <aside className="w-64 bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
              <nav className="space-y-2">
                <Link
                  href="/admin"
                  className={`block px-4 py-2 rounded ${pathname === '/admin' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/events"
                  className={`block px-4 py-2 rounded ${pathname.startsWith('/admin/events') ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
                >
                  Events
                </Link>
                <Link
                  href="/admin/reservations"
                  className={`block px-4 py-2 rounded ${pathname === '/admin/reservations' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
                >
                  Reservations
                </Link>
                <Link
                  href="/admin/roles"
                  className={`block px-4 py-2 rounded ${pathname === '/admin/roles' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
                >
                  Roles & Permissions
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
