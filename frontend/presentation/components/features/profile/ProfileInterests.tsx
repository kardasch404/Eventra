'use client';

import React, { useState } from 'react';

interface Interest {
  id: string;
  name: string;
  icon?: string;
}

const DEFAULT_INTERESTS: Interest[] = [
  { id: '1', name: 'Music', icon: '🎵' },
  { id: '2', name: 'Business', icon: '💼' },
  { id: '3', name: 'Food & Drink', icon: '🍕' },
  { id: '4', name: 'Health', icon: '💪' },
  { id: '5', name: 'Sports & Fitness', icon: '⚽' },
  { id: '6', name: 'Arts', icon: '🎨' },
  { id: '7', name: 'Film & Media', icon: '🎬' },
  { id: '8', name: 'Fashion', icon: '👗' },
  { id: '9', name: 'Technology', icon: '💻' },
  { id: '10', name: 'Science', icon: '🔬' },
  { id: '11', name: 'Travel', icon: '✈️' },
  { id: '12', name: 'Charity', icon: '❤️' },
  { id: '13', name: 'Gaming', icon: '🎮' },
  { id: '14', name: 'Comedy', icon: '😂' },
  { id: '15', name: 'Education', icon: '📚' },
  { id: '16', name: 'Nightlife', icon: '🌙' },
];

interface ProfileInterestsProps {
  selectedInterests: string[];
  onInterestsChange?: (interests: string[]) => void;
  isLoading?: boolean;
  isEditable?: boolean;
}

const ProfileInterests: React.FC<ProfileInterestsProps> = ({
  selectedInterests,
  onInterestsChange,
  isLoading = false,
  isEditable = true,
}) => {
  const [interests, setInterests] = useState<string[]>(selectedInterests);

  const toggleInterest = (interestId: string) => {
    if (!isEditable) return;

    const newInterests = interests.includes(interestId)
      ? interests.filter((id) => id !== interestId)
      : [...interests, interestId];

    setInterests(newInterests);
    onInterestsChange?.(newInterests);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="h-12 bg-gray-200 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Your Interests</h2>
          <p className="text-sm text-gray-500 mt-1">
            Select your interests to get personalized event recommendations
          </p>
        </div>
        {isEditable && interests.length > 0 && (
          <span className="text-sm text-orange-600 font-medium">
            {interests.length} selected
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {DEFAULT_INTERESTS.map((interest) => {
          const isSelected = interests.includes(interest.id);
          return (
            <button
              key={interest.id}
              onClick={() => toggleInterest(interest.id)}
              disabled={!isEditable}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                isSelected
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              } ${isEditable ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <span className="text-lg">{interest.icon}</span>
              <span className="text-sm font-medium">{interest.name}</span>
              {isSelected && (
                <svg
                  className="w-4 h-4 ml-auto text-orange-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          );
        })}
      </div>

      {interests.length === 0 && (
        <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-100">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-orange-800">
                No interests selected
              </p>
              <p className="text-sm text-orange-700 mt-1">
                Select at least a few interests to help us recommend events
                you&apos;ll love.
              </p>
            </div>
          </div>
        </div>
      )}

      {isEditable && interests.length > 0 && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => onInterestsChange?.(interests)}
            className="px-6 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors"
          >
            Save Interests
          </button>
        </div>
      )}
    </div>
  );
};

export { ProfileInterests };
