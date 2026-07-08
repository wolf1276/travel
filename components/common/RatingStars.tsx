'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const SIZES = { sm: 'h-3.5 w-3.5', md: 'h-4 w-4', lg: 'h-6 w-6' } as const;

export function RatingStars({
  value,
  onChange,
  size = 'md',
  readOnly = true,
}: {
  value: number;
  onChange?: (value: number) => void;
  size?: keyof typeof SIZES;
  readOnly?: boolean;
}) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div
      className={cn('flex items-center', readOnly ? 'gap-0.5' : 'gap-1')}
      role={readOnly ? undefined : 'radiogroup'}
      aria-label="Rating"
    >
      {stars.map((star) => {
        const filled = star <= value;
        const icon = (
          <Star
            className={cn(
              SIZES[size],
              filled ? 'fill-primary text-primary' : 'fill-transparent text-muted-foreground/40',
            )}
          />
        );

        if (readOnly) {
          return <span key={star}>{icon}</span>;
        }

        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={star === value}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
            onClick={() => onChange?.(star)}
            className="transition-transform hover:scale-110"
          >
            {icon}
          </button>
        );
      })}
    </div>
  );
}
