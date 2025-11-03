import React from 'react';
import { StarIcon } from './icons/StarIcon';

interface StarRatingProps {
  rating: number;
  onRate: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRate }) => {
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map(star => {
        const isSelected = star <= rating;
        return (
            <button
              key={star}
              onClick={() => onRate(star === rating ? 0 : star)} // Click again to un-rate
              className="focus:outline-none"
              aria-label={`Rate ${star} star`}
            >
              <StarIcon
                isSelected={isSelected}
                className={`w-6 h-6 cursor-pointer transition-colors ${
                  isSelected ? 'text-yellow-400 dark:text-dark-text-primary' : 'text-slate-300 dark:text-dark-border'
                }`}
              />
            </button>
        )
      })}
    </div>
  );
};

export default StarRating;