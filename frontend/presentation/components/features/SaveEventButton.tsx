'use client';

interface SaveEventButtonProps {
  eventId: string;
  eventTitle: string;
}

export function SaveEventButton({ eventId, eventTitle }: SaveEventButtonProps) {
  const handleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Add save functionality here
    console.log('Save event:', eventId, eventTitle);
  };

  return (
    <button 
      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
      onClick={handleSave}
      aria-label={`Save ${eventTitle}`}
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </button>
  );
}
