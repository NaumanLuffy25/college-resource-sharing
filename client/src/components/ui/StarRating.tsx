import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '../../utils';

interface StarRatingProps {
  rating: number;
  onRate?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({ rating, onRate, size = 'md', readonly = false }) => {
  const [hover, setHover] = useState(0);
  const sizes = { sm: 14, md: 18, lg: 24 };

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onRate?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          className={cn(
            'transition-transform',
            !readonly && 'hover:scale-110 cursor-pointer',
            readonly && 'cursor-default'
          )}
        >
          <Star
            size={sizes[size]}
            className={cn(
              'transition-colors',
              (hover || rating) >= star
                ? 'fill-amber-400 text-amber-400'
                : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'
            )}
          />
        </button>
      ))}
    </div>
  );
};
