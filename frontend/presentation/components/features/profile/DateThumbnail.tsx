'use client';

interface DateThumbnailProps {
  date: string;
  size?: 'sm' | 'md' | 'lg';
}

export function DateThumbnail({ date, size = 'md' }: DateThumbnailProps) {
  const dateObj = new Date(date);
  const month = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const day = dateObj.getDate();

  const sizeClasses = {
    sm: 'w-10',
    md: 'w-14',
    lg: 'w-16',
  };

  const monthSizeClasses = {
    sm: 'text-xs',
    md: 'text-xs',
    lg: 'text-sm',
  };

  const daySizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`${sizeClasses[size]} text-center flex-shrink-0`}>
      <p className={`${monthSizeClasses[size]} font-semibold text-orange-500`}>
        {month}
      </p>
      <p className={`${daySizeClasses[size]} font-bold text-gray-800`}>
        {day}
      </p>
    </div>
  );
}
