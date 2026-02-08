import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Eventra</h3>
            <p className="text-sm">Your premier event management platform</p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Events</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/events" className="hover:text-white">Browse Events</Link></li>
              <li><Link href="/events/create" className="hover:text-white">Create Event</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Account</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/login" className="hover:text-white">Login</Link></li>
              <li><Link href="/register" className="hover:text-white">Sign Up</Link></li>
              <li><Link href="/reservations" className="hover:text-white">My Reservations</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white">About</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} Eventra. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
