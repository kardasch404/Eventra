'use client';

import { ProtectedRoute } from '@/presentation/components/guards';
import { useAuth } from '@/presentation/hooks/useAuth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// SVG Icons as components
const DashboardIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
  </svg>
);

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
  </svg>
);

const UsersIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
  </svg>
);

const TicketIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
  </svg>
);

const ShieldIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

const CogIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const LogoutIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
  </svg>
);

const HomeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: DashboardIcon },
    { href: '/admin/events', label: 'Events', icon: CalendarIcon },
    { href: '/admin/users', label: 'Users', icon: UsersIcon },
    { href: '/admin/reservations', label: 'Reservations', icon: TicketIcon },
    { href: '/admin/roles', label: 'Roles', icon: ShieldIcon },
    { href: '/admin/profile', label: 'Settings', icon: CogIcon },
  ];

  const isActivePath = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  return (
    <ProtectedRoute requiredPermission="admin:access">
      <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#0f0f0f]">
        {/* Top Navigation */}
        <nav className="bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-gray-800/50 sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/admin" className="flex items-center gap-3 group">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40 transition-all">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">Eventra</h1>
                    <p className="text-xs text-gray-500">Admin Panel</p>
                  </div>
                </Link>
              </div>

              <div className="flex items-center gap-4">
                {user && (
                  <div className="flex items-center gap-3 px-4 py-2 bg-[#1a1a1a] rounded-xl border border-gray-800">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-sm font-bold">
                      {user.firstName[0]}{user.lastName[0]}
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-sm font-medium text-white">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-gray-500">Administrator</p>
                    </div>
                  </div>
                )}
                
                <Link 
                  href="/profile" 
                  className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded-lg transition-all"
                >
                  <HomeIcon className="w-4 h-4" />
                  <span className="text-sm hidden md:block">Dashboard</span>
                </Link>
                
                <button 
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                >
                  <LogoutIcon className="w-4 h-4" />
                  <span className="text-sm hidden md:block">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-6 py-8">
          <div className="flex gap-8">
            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0">
              <div className="bg-[#1a1a1a]/50 backdrop-blur-sm rounded-2xl p-4 sticky top-24 border border-gray-800/50">
                <nav className="space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = isActivePath(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                          isActive
                            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25'
                            : 'text-gray-400 hover:bg-[#2a2a2a] hover:text-white'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>

                {/* System Status */}
                <div className="mt-6 pt-6 border-t border-gray-800/50">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 px-4">System Status</p>
                  <div className="px-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Server</span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <span className="text-xs text-green-500">Online</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Database</span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <span className="text-xs text-green-500">Connected</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">{children}</main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
