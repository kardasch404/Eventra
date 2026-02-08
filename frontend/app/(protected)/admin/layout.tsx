'use client';

import { ProtectedRoute } from '@/presentation/components/guards';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/events', label: 'Events', icon: '🎫' },
    { href: '/admin/reservations', label: 'Reservations', icon: '📋' },
    { href: '/admin/roles', label: 'Roles', icon: '👥' },
  ];

  return (
    <ProtectedRoute requiredPermission="admin:access">
      <div className="min-h-screen bg-[#1a1a1a]">
        <nav className="bg-[#0a0a0a] border-b border-gray-800">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-white">Eventra Admin</h1>
              <div className="flex items-center gap-4">
                <Link href="/dashboard" className="text-gray-400 hover:text-white text-sm">
                  User Dashboard
                </Link>
                <button className="text-gray-400 hover:text-white text-sm">Logout</button>
              </div>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-6 py-8">
          <div className="flex gap-6">
            <aside className="w-64 flex-shrink-0">
              <div className="bg-[#2a2a2a] rounded-lg p-4 sticky top-8">
                <nav className="space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        pathname === item.href
                          ? 'bg-orange-600 text-white'
                          : 'text-gray-400 hover:bg-[#3a3a3a] hover:text-white'
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            </aside>

            <main className="flex-1">{children}</main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
