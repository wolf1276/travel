'use client';

import { motion } from 'framer-motion';
import { Camera, Compass, Globe2, MapPinned, Plane } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useStats } from '@/hooks/useStats';
import { tiltForId } from '@/lib/rotation';
import type { UserStats } from '@/types/stats';

const ITEMS: { key: keyof UserStats; label: string; icon: typeof Globe2; accent: string }[] = [
  { key: 'countriesVisited', label: 'Countries Visited', icon: Globe2, accent: 'from-primary/20 to-rose-gold/20 text-primary' },
  { key: 'citiesVisited', label: 'Places Visited', icon: MapPinned, accent: 'from-sage/20 to-sage/10 text-sage' },
  { key: 'dreamPlacesRemaining', label: 'Dream Places Remaining', icon: Compass, accent: 'from-lavender/25 to-lavender/10 text-foreground/70' },
  { key: 'photosUploaded', label: 'Photos Uploaded', icon: Camera, accent: 'from-soft-coral/20 to-soft-coral/10 text-soft-coral' },
  { key: 'tripsCompleted', label: 'Trips Completed', icon: Plane, accent: 'from-primary/20 to-lavender/15 text-primary' },
];

export function StatsGrid() {
  const { data: stats, isLoading } = useStats();

  return (
    <div className="flex flex-wrap gap-3.5">
      {ITEMS.map((item, index) => {
        const Icon = item.icon;
        const tilt = tiltForId(item.key, 1.6);
        return (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 12, rotate: 0 }}
            animate={{ opacity: 1, y: 0, rotate: tilt }}
            whileHover={{ y: -4, rotate: 0, scale: 1.03 }}
            transition={{ duration: 0.35, ease: 'easeOut', delay: index * 0.05 }}
            className="flex min-w-[9.5rem] flex-1 items-center gap-3 rounded-[1.75rem] border border-border/60 bg-card/70 px-4 py-3.5 shadow-soft transition-shadow hover:shadow-dreamy sm:flex-none"
          >
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${item.accent}`}>
              <Icon className="h-4.5 w-4.5" />
            </span>
            <div>
              {isLoading || !stats ? (
                <Skeleton className="h-6 w-10" />
              ) : (
                <p className="font-accent text-2xl font-semibold italic leading-none text-foreground">
                  {stats[item.key]}
                </p>
              )}
              <p className="mt-1 text-[11px] leading-tight text-muted-foreground">{item.label}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
