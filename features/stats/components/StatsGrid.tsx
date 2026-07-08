'use client';

import { Camera, Compass, Globe2, MapPinned, Plane } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useStats } from '@/hooks/useStats';
import type { UserStats } from '@/types/stats';

const ITEMS: { key: keyof UserStats; label: string; icon: typeof Globe2 }[] = [
  { key: 'countriesVisited', label: 'Countries Visited', icon: Globe2 },
  { key: 'citiesVisited', label: 'Cities Visited', icon: MapPinned },
  { key: 'dreamPlacesRemaining', label: 'Dream Places Remaining', icon: Compass },
  { key: 'photosUploaded', label: 'Photos Uploaded', icon: Camera },
  { key: 'tripsCompleted', label: 'Trips Completed', icon: Plane },
];

export function StatsGrid() {
  const { data: stats, isLoading } = useStats();

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.key} className="rounded-2xl border border-border bg-card/40 p-4">
            <Icon className="h-4 w-4 text-primary" />
            {isLoading || !stats ? (
              <Skeleton className="mt-3 h-7 w-12" />
            ) : (
              <p className="mt-3 text-2xl font-semibold">{stats[item.key]}</p>
            )}
            <p className="mt-1 text-xs text-muted-foreground">{item.label}</p>
          </div>
        );
      })}
    </div>
  );
}
