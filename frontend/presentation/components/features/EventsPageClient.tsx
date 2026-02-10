'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SaveEventButton } from './SaveEventButton';
import { Modal, ModalBody, ModalFooter, ModalButton } from '../ui/Modal';

interface Event {
  id: string;
  slug: string;
  title: string;
  dateTime?: { start: string | null };
  location?: { venue?: string; city?: string; country?: string };
  hero?: { url: string; alt?: string };
  type?: string;
  category?: string;
  bookedCount?: number;
}

interface EventsPageClientProps {
  events: Event[];
  total: number;
  totalPages: number;
  currentPage: number;
}

// Helper to format date
function formatEventDate(dateString: string | null | undefined) {
  if (!dateString) return 'Date TBD';
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  };
  return date.toLocaleDateString('en-US', options);
}

// Helper to get month abbreviation
function getMonthAbbr(dateString: string | null | undefined) {
  if (!dateString) return 'TBD';
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
}

// Helper to get day number
function getDayNum(dateString: string | null | undefined) {
  if (!dateString) return '--';
  return new Date(dateString).getDate();
}

export function EventsPageClient({ events, total, totalPages, currentPage }: EventsPageClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleEventClick = (e: React.MouseEvent, event: Event) => {
    // Check if click is on save button or its children
    const target = e.target as HTMLElement;
    if (target.closest('[data-save-button]')) {
      e.preventDefault();
      return;
    }

    // For demo: open modal instead of navigating
    // Remove this and use Link navigation in production
    e.preventDefault();
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Events</h1>
            <p className="text-gray-600">Discover events happening around you</p>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              {total > 0 ? `${total} event${total !== 1 ? 's' : ''} found` : 'No events found'}
            </p>
            <div className="flex gap-2">
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                <option>Date</option>
                <option>This week</option>
                <option>This month</option>
                <option>Next month</option>
              </select>
            </div>
          </div>

          {/* Events List */}
          {events.length > 0 ? (
            <div className="space-y-4">
              {events.map((event) => (
                <article 
                  key={event.id}
                  onClick={(e) => handleEventClick(e, event)}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                >
                  <div className="flex">
                    {/* Date Thumbnail */}
                    <div className="hidden sm:flex flex-col items-center justify-center w-20 px-4 py-6 border-r border-gray-100">
                      <span className="text-orange-500 text-xs font-semibold uppercase">
                        {getMonthAbbr(event.dateTime?.start)}
                      </span>
                      <span className="text-2xl font-bold text-gray-800">
                        {getDayNum(event.dateTime?.start)}
                      </span>
                    </div>

                    {/* Event Image */}
                    <div className="w-32 sm:w-48 flex-shrink-0">
                      <div className="relative h-full min-h-[120px]">
                        {event.hero?.url ? (
                          <Image 
                            src={event.hero.url} 
                            alt={event.hero.alt || event.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-pink-500" />
                        )}
                      </div>
                    </div>

                    {/* Event Details */}
                    <div className="flex-1 p-4">
                      <div className="flex flex-col h-full justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
                            {event.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {formatEventDate(event.dateTime?.start)}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {event.location?.venue && `${event.location.venue} • `}
                            {event.location?.city}{event.location?.country && `, ${event.location.country}`}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            {event.type === 'ONLINE' && (
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                Online
                              </span>
                            )}
                            {event.category && (
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                                {event.category}
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {event.bookedCount || 0} attending
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="hidden md:flex items-start p-4" data-save-button>
                      <SaveEventButton eventId={event.id} eventTitle={event.title} />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No events found</h3>
              <p className="mt-2 text-gray-500">Try adjusting your search or filters to find events.</p>
              <Link 
                href="/events"
                className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600"
              >
                Clear filters
              </Link>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              {currentPage > 1 && (
                <Link
                  href={`/events?page=${currentPage - 1}`}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Previous
                </Link>
              )}
              <span className="px-4 py-2 text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              {currentPage < totalPages && (
                <Link
                  href={`/events?page=${currentPage + 1}`}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Next
                </Link>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Event Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedEvent?.title}
        size="lg"
        centered
      >
        {selectedEvent && (
          <>
            <ModalBody>
              {/* Event Image */}
              {selectedEvent.hero?.url && (
                <div className="mb-6 -mx-6 -mt-4 relative h-64">
                  <Image 
                    src={selectedEvent.hero.url} 
                    alt={selectedEvent.hero.alt || selectedEvent.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Event Info */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">Date & Time</p>
                    <p className="text-gray-600">{formatEventDate(selectedEvent.dateTime?.start)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">Location</p>
                    <p className="text-gray-600">
                      {selectedEvent.location?.venue && `${selectedEvent.location.venue}, `}
                      {selectedEvent.location?.city}
                      {selectedEvent.location?.country && `, ${selectedEvent.location.country}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">Attendees</p>
                    <p className="text-gray-600">{selectedEvent.bookedCount || 0} people attending</p>
                  </div>
                </div>

                {selectedEvent.type === 'ONLINE' && (
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">Event Type</p>
                      <p className="text-gray-600">Online Event</p>
                    </div>
                  </div>
                )}

                {selectedEvent.category && (
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">Category</p>
                      <p className="text-gray-600">{selectedEvent.category}</p>
                    </div>
                  </div>
                )}
              </div>
            </ModalBody>

            <ModalFooter>
              <ModalButton variant="secondary" onClick={() => setIsModalOpen(false)}>
                Close
              </ModalButton>
              <Link href={`/events/${selectedEvent.slug}`}>
                <ModalButton variant="primary">
                  View Full Details
                </ModalButton>
              </Link>
            </ModalFooter>
          </>
        )}
      </Modal>
    </>
  );
}
