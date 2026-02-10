'use client';

import { useAuth } from '@/presentation/hooks/useAuth';
import { Card, CardBody } from '@/presentation/components/ui/Card';
import { Button } from '@/presentation/components/ui/Button';
import { useRouter } from 'next/navigation';

export default function ParticipantDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const orders = [
    {
      id: '1',
      title: 'Tech Conference 2026',
      date: 'Tomorrow at 6:00 PM',
      month: 'FEB',
      day: '10',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=450&h=200&fit=crop',
      orderInfo: 'Order #13932854783 placed on Thu, Feb 8, 5:53 PM',
    },
    {
      id: '2',
      title: 'Business Networking Event',
      date: 'Sat, Mar 14, 10:00 AM',
      month: 'MAR',
      day: '14',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=450&h=200&fit=crop',
      orderInfo: 'Order #14142627173 placed on Tue, Jan 27, 9:14 AM',
    },
  ];

  const following = [
    { id: '1', name: 'Tech Events Morocco' },
    { id: '2', name: 'Business Networking Group' },
    { id: '3', name: 'Startup Community' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-orange-600">Eventra</div>
          <div className="flex items-center gap-6">
            <button className="text-gray-600 hover:text-gray-900 transition">Browse Events</button>
            <button className="text-gray-600 hover:text-gray-900 transition">Help</button>
            <div className="relative group">
              <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 10l5 5 5-5z"/>
                </svg>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block z-50">
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Profile Header */}
      <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-orange-100 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-6">
            <div className="w-28 h-28 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center shadow-xl text-white text-3xl font-bold">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold text-gray-900">{user?.firstName} {user?.lastName}</h1>
                <button className="text-gray-600 hover:text-gray-900 transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                  </svg>
                </button>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-700">
                <span className="font-medium">{orders.length} orders</span>
                <span className="text-gray-400">•</span>
                <a href="#" className="hover:text-orange-600 transition font-medium">0 likes</a>
                <span className="text-gray-400">•</span>
                <span className="font-medium">{following.length} following</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Orders Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">My Orders</h2>
          </div>

          {/* Email Verification Notice */}
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-5 mb-8 shadow-sm">
            <div className="flex gap-4">
              <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              <div className="flex-1">
                <div className="font-semibold text-gray-900 mb-2">Looking for your tickets?</div>
                <div className="text-gray-700 mb-4">You need to verify your email to view transfers and gifts.</div>
                <Button variant="primary" size="sm">Verify your email</Button>
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-5">
            {orders.map((order) => (
              <Card key={order.id} className="hover:shadow-xl transition-all duration-300 cursor-pointer border-l-4 border-orange-500">
                <CardBody className="p-0">
                  <div className="flex gap-6 p-5">
                    {/* Date Badge */}
                    <div className="flex-shrink-0 text-center w-20 bg-gradient-to-br from-orange-50 to-pink-50 rounded-lg p-3">
                      <div className="text-orange-600 font-bold text-xs uppercase tracking-wide">{order.month}</div>
                      <div className="text-3xl font-bold text-gray-900 mt-1">{order.day}</div>
                    </div>

                    {/* Event Image */}
                    <div className="flex-shrink-0 w-40 h-24 bg-gray-200 rounded-lg overflow-hidden shadow-md">
                      <img src={order.image} alt={order.title} className="w-full h-full object-cover" />
                    </div>

                    {/* Event Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-gray-900 mb-2 hover:text-orange-600 transition">{order.title}</h3>
                      <div className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/>
                        </svg>
                        {order.date}
                      </div>
                      <div className="text-sm text-gray-500">{order.orderInfo}</div>
                    </div>

                    {/* Action Button */}
                    <div className="flex-shrink-0 flex items-center">
                      <Button variant="outline" size="sm">View Tickets</Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline">See past orders</Button>
          </div>
        </section>

        <hr className="border-gray-300 my-12" />

        {/* Interests Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              Interests
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
              </svg>
            </h2>
          </div>
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No interests added yet</p>
          </div>
        </section>

        <hr className="border-gray-300 my-12" />

        {/* Following Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Following</h2>
            <a href="#" className="text-sm text-orange-600 hover:text-orange-700 flex items-center gap-1 font-medium">
              See events
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
              </svg>
            </a>
          </div>

          <div className="space-y-4">
            {following.map((org) => (
              <div key={org.id} className="flex items-center justify-between py-4 px-5 bg-white rounded-lg border border-gray-200 hover:shadow-md transition">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                    <svg className="w-7 h-7 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                  <a href="#" className="font-semibold text-gray-900 hover:text-orange-600 transition">{org.name}</a>
                </div>
                <Button variant="outline" size="sm">Following</Button>
              </div>
            ))}
          </div>
        </section>

        {/* Missing Tickets Notice */}
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-5 shadow-sm">
          <div className="flex gap-4">
            <svg className="w-6 h-6 text-gray-700 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <div>
              <div className="font-semibold text-gray-900 mb-1">Tickets missing?</div>
              <a href="#" className="text-orange-600 font-semibold hover:text-orange-700 transition">Find my tickets</a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex justify-between items-center text-sm text-gray-600 mb-6">
            <div>© 2026 Eventra</div>
            <div className="flex gap-8">
              <a href="#" className="hover:text-gray-900 transition">About</a>
              <a href="#" className="hover:text-gray-900 transition">Blog</a>
              <a href="#" className="hover:text-gray-900 transition">Help</a>
              <a href="#" className="hover:text-gray-900 transition">Terms</a>
              <a href="#" className="hover:text-gray-900 transition">Privacy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
