'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client/react';
import { EventForm, EventFormData } from '@/presentation/components/features/admin';
import { CREATE_EVENT } from '@/infrastructure/graphql/mutations';
import { GET_ALL_EVENTS } from '@/infrastructure/graphql/queries';
import Link from 'next/link';

// Hero Section Component (Eventbrite-style)
function HeroSection({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center">
      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 py-8 lg:py-16 w-full">
        {/* Content */}
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
            Where Event Organizers Grow
          </h1>
          <p className="text-lg text-gray-300">
            The all-in-one ticketing and discovery platform trusted by millions of organizers and attendees worldwide
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={onGetStarted}
              className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-orange-500/25"
            >
              Create Event
            </button>
            <Link
              href="/admin/events"
              className="px-8 py-3 bg-transparent border-2 border-white/30 hover:border-white/60 text-white font-semibold rounded-lg transition-colors"
            >
              View All Events
            </Link>
          </div>
        </div>
        
        {/* Image */}
        <div className="flex-1 relative aspect-square max-w-md lg:max-w-lg w-full">
          <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
            <img
              src="/img/evnt.png"
              alt="Where Event Organizers Grow"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Create Event Form View
function CreateEventFormView() {
  const router = useRouter();

  const [createEvent, { loading, error }] = useMutation(CREATE_EVENT, {
    refetchQueries: [{ query: GET_ALL_EVENTS }],
    onCompleted: () => {
      router.push('/admin/events');
    },
  });

  const handleSubmit = async (data: EventFormData) => {
    // For online events, set default location values
    const isOnline = data.type === 'ONLINE';
    
    const input = {
      title: data.title,
      summary: data.summary,
      description: [data.description], // Backend expects array
      category: data.category,
      type: data.type,
      dateTime: {
        start: `${data.startDate}T${data.startTime}:00.000Z`,
        end: `${data.endDate}T${data.endTime}:00.000Z`,
        timezone: data.timezone,
      },
      location: {
        venue: isOnline ? 'Online' : (data.address || 'TBD'),
        address: isOnline ? 'Online Event' : (data.address || 'TBD'),
        city: isOnline ? 'Online' : 'TBD',
        country: isOnline ? 'Online' : 'TBD',
      },
      capacity: data.capacity,
      hero: {
        url: data.imageUrl || 'https://placehold.co/1200x600/1a1a1a/orange?text=Event',
        alt: data.title || 'Event image',
      },
      highlights: [
        { icon: '📅', text: 'Mark your calendar' },
        { icon: '🎫', text: 'Limited seats available' },
      ],
    };

    await createEvent({ variables: { input } });
  };

  const handleCancel = () => {
    router.push('/admin/events');
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm">
        <Link href="/admin/events" className="text-gray-400 hover:text-white transition-colors">
          Events
        </Link>
        <span className="text-gray-600">/</span>
        <span className="text-white">Create New Event</span>
      </nav>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Create New Event</h1>
        <p className="text-gray-400 mt-1">Fill in the details to create a new event</p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-400">Error creating event: {error.message}</p>
        </div>
      )}

      {/* Form */}
      <EventForm
        mode="create"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={loading}
      />
    </div>
  );
}

export default function CreateEventPage() {
  const [showForm, setShowForm] = useState(false);

  if (showForm) {
    return <CreateEventFormView />;
  }

  return (
    <div className="space-y-6">
      <HeroSection onGetStarted={() => setShowForm(true)} />
    </div>
  );
}
