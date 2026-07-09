'use client';

import { Camera, Compass, Globe2, MapPinned, Plane } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useStats } from '@/hooks/useStats';
import type { UserStats } from '@/types/stats';

const ITEMS: { key: keyof UserStats; label: string; icon: typeof Globe2 }[] = [
  { key: 'countriesVisited', label: 'Countries Visited', icon: Globe2 },
  { key: 'citiesVisited', label: 'Places Visited', icon: MapPinned },
  { key: 'dreamPlacesRemaining', label: 'Dream Places Remaining', icon: Compass },
  { key: 'photosUploaded', label: 'Photos Uploaded', icon: Camera },
  { key: 'tripsCompleted', label: 'Trips Completed', icon: Plane },
];

export function StatsGrid() {
  const { data: stats, isLoading } = useStats();

  return (
    <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-5">
      {ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.key}
            className="rounded-2xl border border-border/70 bg-card/60 p-4 shadow-soft transition-shadow hover:shadow-elevated"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon className="h-4 w-4" />
            </span>
            {isLoading || !stats ? (
              <Skeleton className="mt-3 h-7 w-12" />
            ) : (
              <p className="mt-3 font-serif text-2xl font-semibold text-foreground">{stats[item.key]}</p>
            )}
            <p className="mt-1 text-xs text-muted-foreground">{item.label}</p>
          </div>
        );
      })}
    </div>
  );
}
