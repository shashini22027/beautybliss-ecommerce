import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star
        key={i}
        size={14}
        className={i <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-stone-300'}
      />
    );
  }
  return <div className="flex items-center gap-0.5">{stars}</div>;
};

export default RatingStars;
