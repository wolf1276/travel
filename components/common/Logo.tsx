import Link from 'next/link';
import { Compass } from 'lucide-react';
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
      className={cn('flex items-center gap-2 font-semibold tracking-tight', className)}
      aria-label={iconOnly ? 'Travel Memories' : undefined}
    >
      <span
        aria-hidden="true"
        className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground"
      >
        <Compass className="h-5 w-5" strokeWidth={2.25} />
      </span>
      {!iconOnly && <span className="text-lg">Travel Memories</span>}
    </Link>
  );
}
