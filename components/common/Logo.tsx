import Link from 'next/link';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({
  className,
  iconOnly,
  href = '/dashboard',
}: {
  className?: string;
  iconOnly?: boolean;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className={cn('flex items-center gap-2.5 tracking-tight', className)}
      aria-label={iconOnly ? 'Travel Memories' : undefined}
    >
      <span
        aria-hidden="true"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-soft"
      >
        <Heart className="h-4 w-4" strokeWidth={2.25} fill="currentColor" />
      </span>
      {!iconOnly && (
        <span className="font-serif text-lg font-semibold text-foreground">Travel Memories</span>
      )}
    </Link>
  );
}
