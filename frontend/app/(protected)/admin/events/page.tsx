'use client';

import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_EVENTS } from '@/infrastructure/graphql/queries';
import { UPDATE_EVENT, PUBLISH_EVENT, CANCEL_EVENT } from '@/infrastructure/graphql/mutations';
import { useState } from 'react';
import { Modal, Button } from '@/presentation/components/ui';

export default function AdminEventsPage() {
  const { data, loading, refetch } = useQuery(GET_ALL_EVENTS);
  const [updateEvent] = useMutation(UPDATE_EVENT);
  const [publishEvent] = useMutation(PUBLISH_EVENT);
  const [cancelEvent] = useMutation(CANCEL_EVENT);
  const [editingEvent, setEditingEvent] = useState<{ id: string; title: string; status: string } | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handlePublish = async (id: string) => {
    try {
      await publishEvent({ variables: { id } });
      refetch();
    } catch (error) {
      console.error('Error publishing event:', error);
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await cancelEvent({ variables: { id } });
      refetch();
    } catch (error) {
      console.error('Error canceling event:', error);
    }
  };

  const handleEdit = (event: { id: string; title: string; status: string }) => {
    setEditingEvent(event);
    setShowModal(true);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await updateEvent({
        variables: {
          id: editingEvent?.id,
          input: {
            title: formData.get('title'),
            status: formData.get('status'),
          },
        },
      });
      setShowModal(false);
      refetch();
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  if (loading) return <div className="text-white">Loading...</div>;

  const events = data?.allEvents || [];

  return (
    <div className="bg-[#2a2a2a] rounded-lg border border-gray-800">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-3xl font-bold text-white">Events Management</h1>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#1a1a1a]">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Capacity
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Booked
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {events.map((event: { id: string; title: string; status: string; category: string; capacity: number; bookedCount: number }) => (
              <tr key={event.id} className="hover:bg-[#1a1a1a]">
                <td className="px-6 py-4 text-white">{event.title}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      event.status === 'PUBLISHED'
                        ? 'bg-green-900/30 text-green-400'
                        : event.status === 'DRAFT'
                          ? 'bg-yellow-900/30 text-yellow-400'
                          : 'bg-red-900/30 text-red-400'
                    }`}
                  >
                    {event.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-300">{event.category}</td>
                <td className="px-6 py-4 text-gray-300">{event.capacity}</td>
                <td className="px-6 py-4 text-gray-300">{event.bookedCount}</td>
                <td className="px-6 py-4 space-x-2">
                  <Button onClick={() => handleEdit(event)} variant="secondary" size="sm">
                    Edit
                  </Button>
                  {event.status === 'DRAFT' && (
                    <Button onClick={() => handlePublish(event.id)} variant="primary" size="sm">
                      Publish
                    </Button>
                  )}
                  {event.status === 'PUBLISHED' && (
                    <Button onClick={() => handleCancel(event.id)} variant="danger" size="sm">
                      Cancel
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Edit Event">
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
            <input
              name="title"
              defaultValue={editingEvent?.title}
              className="w-full px-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
            <select
              name="status"
              defaultValue={editingEvent?.status}
              className="w-full px-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" onClick={() => setShowModal(false)} variant="secondary">
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
