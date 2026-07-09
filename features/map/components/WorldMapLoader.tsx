'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

export const WorldMap = dynamic(
  () => import('@/features/map/components/WorldMap').then((mod) => mod.WorldMap),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[calc(100dvh-13rem)] min-h-[420px] w-full rounded-2xl" />,
  },
);
