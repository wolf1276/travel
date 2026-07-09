'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const DreamyBackdropScene = dynamic(
  () => import('@/components/decor/DreamyBackdropScene').then((mod) => mod.DreamyBackdropScene),
  { ssr: false },
);

/** Tasteful, purely decorative floating shapes — never rendered on mobile
 * viewports or when the user prefers reduced motion, and never intercepts
 * pointer events. Meant for hero sections only, used sparingly. */
export function DreamyBackdrop({ className, count }: { className?: string; count?: number }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isLargeViewport = window.matchMedia('(min-width: 768px)').matches;
    setEnabled(!reduceMotion && isLargeViewport);
  }, []);

  if (!enabled) return null;

  return (
    <div className={className ?? 'pointer-events-none absolute inset-0 -z-10 opacity-80'}>
      <DreamyBackdropScene count={count} />
    </div>
  );
}
