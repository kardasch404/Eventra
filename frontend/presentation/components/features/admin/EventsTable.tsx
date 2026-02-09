'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useMutation } from '@apollo/client/react';
import { Button, Modal } from '@/presentation/components/ui';
import { DELETE_EVENT, PUBLISH_EVENT, CANCEL_EVENT } from '@/infrastructure/graphql/mutations';
import { GET_ALL_EVENTS } from '@/infrastructure/graphql/queries';

interface Event {
  id: string;
  title: string;
  slug: string;
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELED';
  category: string;
  capacity: number;
  bookedCount: number;
  createdAt: string;
}

interface EventsTableProps {
  events: Event[];
  isLoading: boolean;
}

export function EventsTable({ events, isLoading }: EventsTableProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const [deleteEvent, { loading: deleteLoading }] = useMutation(DELETE_EVENT, {
    refetchQueries: [{ query: GET_ALL_EVENTS }],
    onCompleted: () => {
      setDeleteModalOpen(false);
      setSelectedEvent(null);
    },
  });

  const [publishEvent, { loading: publishLoading }] = useMutation(PUBLISH_EVENT, {
    refetchQueries: [{ query: GET_ALL_EVENTS }],
  });

  const [cancelEvent, { loading: cancelLoading }] = useMutation(CANCEL_EVENT, {
    refetchQueries: [{ query: GET_ALL_EVENTS }],
  });

  const handleDeleteClick = (event: Event) => {
    setSelectedEvent(event);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedEvent) {
      await deleteEvent({ variables: { id: selectedEvent.id } });
    }
  };

  const handlePublish = async (id: string) => {
    await publishEvent({ variables: { id } });
  };

  const handleCancel = async (id: string) => {
    await cancelEvent({ variables: { id } });
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      DRAFT: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      PUBLISHED: 'bg-green-500/20 text-green-400 border-green-500/30',
      CANCELED: 'bg-red-500/20 text-red-400 border-red-500/30',
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.DRAFT}`}
      >
        {status.charAt(0) + status.slice(1).toLowerCase()}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="bg-[#2a2a2a] rounded-lg border border-gray-800 overflow-hidden">
        <div className="p-8 text-center">
          <div className="w-8 h-8 border-2 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading events...</p>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="bg-[#2a2a2a] rounded-lg border border-gray-800 p-12 text-center">
        <div className="w-20 h-20 mx-auto bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <span className="text-4xl">📅</span>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No events yet</h3>
        <p className="text-gray-400 mb-6">Create your first event to get started.</p>
        <Link href="/admin/events/create">
          <Button className="bg-orange-600 hover:bg-orange-700">
            Create Event
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#2a2a2a] rounded-lg border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Event
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Capacity
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Booked
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Created
                </th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {events.map((event) => (
                <tr 
                  key={event.id} 
                  className="hover:bg-[#333] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-white font-medium truncate max-w-[250px]">
                        {event.title}
                      </p>
                      <p className="text-gray-500 text-sm truncate max-w-[250px]">
                        /{event.slug}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(event.status)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-300">
                      {event.category?.charAt(0) + event.category?.slice(1).toLowerCase() || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-300">{event.capacity}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-300">{event.bookedCount || 0}</span>
                      <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-orange-600 rounded-full"
                          style={{ 
                            width: `${Math.min(((event.bookedCount || 0) / event.capacity) * 100, 100)}%` 
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-400 text-sm">
                      {formatDate(event.createdAt)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {event.status === 'DRAFT' && (
                        <Button
                          size="sm"
                          onClick={() => handlePublish(event.id)}
                          disabled={publishLoading}
                          className="bg-green-600 hover:bg-green-700 text-xs"
                        >
                          Publish
                        </Button>
                      )}
                      {event.status === 'PUBLISHED' && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleCancel(event.id)}
                          disabled={cancelLoading}
                          className="text-xs"
                        >
                          Cancel
                        </Button>
                      )}
                      <Link href={`/admin/events/${event.id}/edit`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-600 text-gray-400 hover:bg-gray-800 text-xs"
                        >
                          Edit
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDeleteClick(event)}
                        className="text-xs"
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Event"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            Are you sure you want to delete{' '}
            <span className="text-white font-semibold">{selectedEvent?.title}</span>?
          </p>
          <p className="text-gray-500 text-sm">
            This action cannot be undone. All reservations for this event will also be deleted.
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
              className="border-gray-600 text-gray-400 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? 'Deleting...' : 'Delete Event'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
