'use client';

import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation } from '@apollo/client/react';
import { EventForm, EventFormData } from '@/presentation/components/features/admin';
import { UPDATE_EVENT } from '@/infrastructure/graphql/mutations';
import { GET_EVENT, GET_ALL_EVENTS } from '@/infrastructure/graphql/queries';
import Link from 'next/link';

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  const { data, loading: queryLoading, error: queryError } = useQuery(GET_EVENT, {
    variables: { id: eventId },
    skip: !eventId,
  });

  const [updateEvent, { loading: updateLoading, error: updateError }] = useMutation(UPDATE_EVENT, {
    refetchQueries: [{ query: GET_ALL_EVENTS }],
    onCompleted: () => {
      router.push('/admin/events');
    },
  });

  const handleSubmit = async (formData: EventFormData) => {
    const isOnline = formData.type === 'ONLINE';
    
    const input = {
      title: formData.title,
      summary: formData.summary,
      description: [formData.description],
      category: formData.category,
      type: formData.type,
      status: formData.status,
      dateTime: {
        start: `${formData.startDate}T${formData.startTime}:00.000Z`,
        end: `${formData.endDate}T${formData.endTime}:00.000Z`,
        timezone: formData.timezone,
      },
      location: {
        venue: isOnline ? 'Online' : (formData.address || 'TBD'),
        address: isOnline ? 'Online Event' : (formData.address || 'TBD'),
        city: isOnline ? 'Online' : 'TBD',
        country: isOnline ? 'Online' : 'TBD',
      },
      capacity: formData.capacity,
      hero: {
        url: formData.imageUrl || 'https://placehold.co/1200x600/1a1a1a/orange?text=Event',
        alt: formData.title || 'Event image',
      },
    };

    await updateEvent({ variables: { id: eventId, input } });
  };

  const handleCancel = () => {
    router.push('/admin/events');
  };

  // Loading state
  if (queryLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading event...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (queryError) {
    return (
      <div className="space-y-6">
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 text-center">
          <p className="text-red-400 mb-4">Error loading event: {queryError.message}</p>
          <Link href="/admin/events">
            <button className="text-orange-500 hover:text-orange-400">
              ← Back to Events
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const event = data?.event;

  if (!event) {
    return (
      <div className="space-y-6">
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6 text-center">
          <p className="text-yellow-400 mb-4">Event not found</p>
          <Link href="/admin/events">
            <button className="text-orange-500 hover:text-orange-400">
              ← Back to Events
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Parse event data for form
  const parseDateTime = (isoString: string) => {
    if (!isoString) return { date: '', time: '' };
    const date = new Date(isoString);
    return {
      date: date.toISOString().split('T')[0],
      time: date.toISOString().split('T')[1].substring(0, 5),
    };
  };

  const startDateTime = parseDateTime(event.dateTime?.start);
  const endDateTime = parseDateTime(event.dateTime?.end);

  const initialData: Partial<EventFormData> = {
    title: event.title || '',
    summary: event.summary || '',
    description: Array.isArray(event.description) ? event.description.join('\n\n') : event.description || '',
    category: event.category || 'CONFERENCE',
    type: event.type || 'IN_PERSON',
    status: event.status || 'DRAFT',
    startDate: startDateTime.date,
    startTime: startDateTime.time,
    endDate: endDateTime.date,
    endTime: endDateTime.time,
    timezone: event.dateTime?.timezone || 'UTC',
    locationMode: event.location?.mode || 'IN_PERSON',
    venue: event.location?.venue || '',
    address: event.location?.address || '',
    city: event.location?.city || '',
    country: event.location?.country || '',
    capacity: event.capacity || 100,
    imageUrl: event.hero?.url || '',
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm">
        <Link href="/admin/events" className="text-gray-400 hover:text-white transition-colors">
          Events
        </Link>
        <span className="text-gray-600">/</span>
        <span className="text-white">Edit Event</span>
      </nav>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Edit Event</h1>
        <p className="text-gray-400 mt-1">Update the event details</p>
      </div>

      {/* Update Error Display */}
      {updateError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-400">Error updating event: {updateError.message}</p>
        </div>
      )}

      {/* Form */}
      <EventForm
        mode="edit"
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={updateLoading}
      />
    </div>
  );
}
