'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--rose-gold))',
  'hsl(var(--soft-coral))',
  'hsl(var(--sage))',
  'hsl(var(--lavender))',
];

/** A brief, subtle confetti burst — used to celebrate turning a dream into a
 * memory. Fixed-position, pointer-events-none, and self-limiting (no manual
 * cleanup needed by the caller beyond unmounting after ~1.2s). */
export function Confetti({ count = 24 }: { count?: number }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
        const distance = 90 + Math.random() * 120;
        return {
          id: i,
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance - 40,
          rotate: (Math.random() - 0.5) * 360,
          color: COLORS[i % COLORS.length],
          size: 6 + Math.random() * 6,
          delay: Math.random() * 0.08,
        };
      }),
    [count],
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0.6, rotate: 0 }}
          animate={{ x: p.x, y: p.y, opacity: 0, scale: 1, rotate: p.rotate }}
          transition={{ duration: 0.9, delay: p.delay, ease: [0.16, 1, 0.3, 1] }}
          className="absolute rounded-full"
          style={{ width: p.size, height: p.size, backgroundColor: p.color }}
        />
      ))}
    </div>
  );
}
