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
  const [editingEvent, setEditingEvent] = useState<any>(null);
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

  const handleEdit = (event: any) => {
    setEditingEvent(event);
    setShowModal(true);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await updateEvent({
        variables: {
          id: editingEvent.id,
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

  if (loading) return <div>Loading...</div>;

  const events = data?.allEvents || [];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-3xl font-bold mb-6">Events Management</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booked</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.map((event: any) => (
              <tr key={event.id}>
                <td className="px-6 py-4 whitespace-nowrap">{event.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded ${
                    event.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' :
                    event.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {event.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{event.category}</td>
                <td className="px-6 py-4 whitespace-nowrap">{event.capacity}</td>
                <td className="px-6 py-4 whitespace-nowrap">{event.bookedCount}</td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <Button onClick={() => handleEdit(event)} variant="secondary" size="sm">Edit</Button>
                  {event.status === 'DRAFT' && (
                    <Button onClick={() => handlePublish(event.id)} variant="primary" size="sm">Publish</Button>
                  )}
                  {event.status === 'PUBLISHED' && (
                    <Button onClick={() => handleCancel(event.id)} variant="danger" size="sm">Cancel</Button>
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
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                name="title"
                defaultValue={editingEvent?.title}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                name="status"
                defaultValue={editingEvent?.status}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" onClick={() => setShowModal(false)} variant="secondary">Cancel</Button>
              <Button type="submit" variant="primary">Save</Button>
            </div>
          </form>
      </Modal>
    </div>
  );
}
