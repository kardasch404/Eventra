'use client';

import { ProtectedRoute } from '@/presentation/components/guards';
import { useAuth } from '@/presentation/hooks/useAuth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/events', label: 'Events', icon: '🎫' },
    { href: '/admin/users', label: 'Users', icon: '👤' },
    { href: '/admin/reservations', label: 'Reservations', icon: '📋' },
    { href: '/admin/roles', label: 'Roles', icon: '👥' },
    { href: '/admin/profile', label: 'Profile', icon: '⚙️' },
  ];

  const isActivePath = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  return (
    <ProtectedRoute requiredPermission="admin:access">
      <div className="min-h-screen bg-[#1a1a1a]">
        <nav className="bg-[#0a0a0a] border-b border-gray-800">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/admin" className="flex items-center gap-2">
                  <span className="text-2xl">🎪</span>
                  <h1 className="text-2xl font-bold text-white">Eventra Admin</h1>
                </Link>
              </div>
              <div className="flex items-center gap-6">
                {user && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-white text-sm font-medium">
                      {user.firstName[0]}{user.lastName[0]}
                    </div>
                    <span className="text-gray-300 text-sm hidden sm:block">
                      {user.firstName} {user.lastName}
                    </span>
                  </div>
                )}
                <Link 
                  href="/dashboard" 
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  User Dashboard
                </Link>
                <button 
                  onClick={logout}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Logout
                </button>
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
                        isActivePath(item.href)
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
