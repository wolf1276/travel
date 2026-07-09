import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WantToVisitGrid } from '@/features/places/components/WantToVisitGrid';
import { MemoriesGrid } from '@/features/memories/components/MemoriesGrid';
import { RecentMoments } from '@/features/memories/components/RecentMoments';
import { Timeline } from '@/features/memories/components/Timeline';
import { StatsGrid } from '@/features/stats/components/StatsGrid';

export const metadata: Metadata = { title: 'Dashboard — Travel Memories' };

export default function DashboardPage() {
  return (
    <div className="space-y-14">
      <section className="space-y-1.5">
        <p className="text-sm font-medium text-primary">Welcome back</p>
        <h1 className="font-serif text-3xl font-semibold text-foreground sm:text-4xl">Our story so far</h1>
        <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
          Every dream you&apos;ve saved and every place you&apos;ve made real, gathered in one cozy book.
        </p>
      </section>

      <StatsGrid />

      <section className="space-y-5">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-foreground">📷 Recent moments</h2>
          <p className="text-sm text-muted-foreground">The latest pages added to your scrapbook.</p>
        </div>
        <RecentMoments />
      </section>

      <section className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-foreground">✨ Places we want to visit</h2>
            <p className="text-sm text-muted-foreground">Our dreams, waiting for their turn.</p>
          </div>
          <Button asChild variant="outline" className="hidden sm:inline-flex">
            <Link href="/places/new">
              <Plus className="h-4 w-4" />
              Add a place
            </Link>
          </Button>
        </div>
        <WantToVisitGrid />
      </section>

      <section className="space-y-5">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-foreground">❤️ Places we&apos;ve been</h2>
          <p className="text-sm text-muted-foreground">Our memories, made real together.</p>
        </div>
        <MemoriesGrid />
      </section>

      <section className="space-y-5">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-foreground">📅 Our timeline</h2>
          <p className="text-sm text-muted-foreground">The story of us, one trip at a time.</p>
        </div>
        <Timeline />
      </section>
    </div>
  );
}
