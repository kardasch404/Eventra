'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/presentation/components/ui';

export interface EventFormData {
  title: string;
  summary: string;
  description: string;
  category: string;
  type: 'ONLINE' | 'IN_PERSON';
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELED';
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  timezone: string;
  locationMode: 'ONLINE' | 'IN_PERSON';
  venue: string;
  address: string;
  city: string;
  country: string;
  capacity: number;
  imageUrl: string;
}

interface EventFormProps {
  initialData?: Partial<EventFormData>;
  onSubmit: (data: EventFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  mode: 'create' | 'edit';
}

const CATEGORIES = [
  'CONFERENCE',
  'WORKSHOP',
  'CONCERT',
  'EXHIBITION',
  'NETWORKING',
  'SPORTS',
  'FESTIVAL',
  'SEMINAR',
  'OTHER',
];

const TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Australia/Sydney',
];

export function EventForm({ initialData, onSubmit, onCancel, isLoading, mode }: EventFormProps) {
  // Get today's date in YYYY-MM-DD format for min date validation
  const today = new Date().toISOString().split('T')[0];
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<EventFormData>({
    defaultValues: {
      title: initialData?.title || '',
      summary: initialData?.summary || '',
      description: initialData?.description || '',
      category: initialData?.category || 'CONFERENCE',
      type: initialData?.type || 'IN_PERSON',
      status: initialData?.status || 'DRAFT',
      startDate: initialData?.startDate || '',
      startTime: initialData?.startTime || '',
      endDate: initialData?.endDate || '',
      endTime: initialData?.endTime || '',
      timezone: initialData?.timezone || 'UTC',
      locationMode: initialData?.locationMode || 'IN_PERSON',
      venue: initialData?.venue || '',
      address: initialData?.address || '',
      city: initialData?.city || '',
      country: initialData?.country || '',
      capacity: initialData?.capacity || 100,
      imageUrl: initialData?.imageUrl || '',
    },
  });

  const locationType = watch('type');
  const startDate = watch('startDate');
  const startTime = watch('startTime');

  const onFormSubmit = async (data: EventFormData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
      {/* Basic Information */}
      <section className="bg-[#2a2a2a] rounded-lg p-6 border border-gray-800">
        <h2 className="text-xl font-semibold text-white mb-6">Basic Information</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Event Title *
            </label>
            <input
              {...register('title', { required: 'Title is required' })}
              type="text"
              placeholder="Enter event title"
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Summary *
            </label>
            <input
              {...register('summary', { required: 'Summary is required' })}
              type="text"
              placeholder="Brief description (max 200 characters)"
              maxLength={200}
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent"
            />
            {errors.summary && (
              <p className="mt-1 text-sm text-red-500">{errors.summary.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Description *
            </label>
            <textarea
              {...register('description', { required: 'Description is required' })}
              rows={5}
              placeholder="Detailed event description"
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent resize-none"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Category *
              </label>
              <select
                {...register('category', { required: 'Category is required' })}
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0) + cat.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Event Type *
              </label>
              <select
                {...register('type', { required: 'Type is required' })}
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent"
              >
                <option value="IN_PERSON">In Person</option>
                <option value="ONLINE">Online</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Hero Image URL
            </label>
            <input
              {...register('imageUrl')}
              type="url"
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent"
            />
          </div>
        </div>
      </section>

      {/* Date & Time */}
      <section className="bg-[#2a2a2a] rounded-lg p-6 border border-gray-800">
        <h2 className="text-xl font-semibold text-white mb-6">Date & Time</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Start Date *
            </label>
            <input
              {...register('startDate', { 
                required: 'Start date is required',
                validate: (value) => {
                  if (value < today) return 'Start date cannot be in the past';
                  return true;
                }
              })}
              type="date"
              min={today}
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
            />
            {errors.startDate && (
              <p className="mt-1 text-sm text-red-500">{errors.startDate.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Start Time *
            </label>
            <input
              {...register('startTime', { required: 'Start time is required' })}
              type="time"
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
            />
            {errors.startTime && (
              <p className="mt-1 text-sm text-red-500">{errors.startTime.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              End Date *
            </label>
            <input
              {...register('endDate', { 
                required: 'End date is required',
                validate: (value) => {
                  if (startDate && value < startDate) return 'End date must be after start date';
                  if (value < today) return 'End date cannot be in the past';
                  return true;
                }
              })}
              type="date"
              min={startDate || today}
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
            />
            {errors.endDate && (
              <p className="mt-1 text-sm text-red-500">{errors.endDate.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              End Time *
            </label>
            <input
              {...register('endTime', { 
                required: 'End time is required',
                validate: (value) => {
                  // If same day, end time must be after start time
                  if (startDate && startDate === watch('endDate') && startTime && value <= startTime) {
                    return 'End time must be after start time';
                  }
                  return true;
                }
              })}
              type="time"
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
            />
            {errors.endTime && (
              <p className="mt-1 text-sm text-red-500">{errors.endTime.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Timezone
            </label>
            <select
              {...register('timezone')}
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="bg-[#2a2a2a] rounded-lg p-6 border border-gray-800">
        <h2 className="text-xl font-semibold text-white mb-6">Location</h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Location
          </label>
          <input
            {...register('address')}
            type="text"
            placeholder="Enter venue name, address, city, country (or leave empty for online events)"
            className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent"
          />
        </div>
      </section>

      {/* Capacity */}
      <section className="bg-[#2a2a2a] rounded-lg p-6 border border-gray-800">
        <h2 className="text-xl font-semibold text-white mb-6">Capacity</h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Maximum Attendees *
          </label>
          <input
            {...register('capacity', { 
              required: 'Capacity is required',
              min: { value: 1, message: 'Capacity must be at least 1' },
              valueAsNumber: true,
            })}
            type="number"
            min={1}
            className="w-full max-w-xs px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent"
          />
          {errors.capacity && (
            <p className="mt-1 text-sm text-red-500">{errors.capacity.message}</p>
          )}
        </div>
      </section>

      {/* Status (Edit mode only) */}
      {mode === 'edit' && (
        <section className="bg-[#2a2a2a] rounded-lg p-6 border border-gray-800">
          <h2 className="text-xl font-semibold text-white mb-6">Status</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Event Status
            </label>
            <select
              {...register('status')}
              className="w-full max-w-xs px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="CANCELED">Canceled</option>
            </select>
          </div>
        </section>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-gray-600 text-gray-400 hover:bg-gray-800"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-orange-600 hover:bg-orange-700 min-w-[120px]"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Saving...</span>
            </div>
          ) : mode === 'create' ? (
            'Create Event'
          ) : (
            'Update Event'
          )}
        </Button>
      </div>
    </form>
  );
}
