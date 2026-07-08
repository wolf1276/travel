import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WantToVisitGrid } from '@/features/places/components/WantToVisitGrid';
import { MemoriesGrid } from '@/features/memories/components/MemoriesGrid';
import { StatsGrid } from '@/features/stats/components/StatsGrid';

export const metadata: Metadata = { title: 'Dashboard — Travel Memories' };

export default function DashboardPage() {
  return (
    <div className="space-y-12">
      <StatsGrid />

      <section className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Want to Visit</h2>
            <p className="text-sm text-muted-foreground">Places waiting for their turn.</p>
          </div>
          <Button asChild variant="outline" className="hidden sm:inline-flex">
            <Link href="/places/new">
              <Plus className="h-4 w-4" />
              Add place
            </Link>
          </Button>
        </div>
        <WantToVisitGrid />
      </section>

      <section className="space-y-5">
        <div>
          <h2 className="text-xl font-semibold">Memories</h2>
          <p className="text-sm text-muted-foreground">Places you&apos;ve already made yours.</p>
        </div>
        <MemoriesGrid />
      </section>
    </div>
  );
}
