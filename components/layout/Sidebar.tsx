'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { NAV_ITEMS } from '@/lib/constants';

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border/60 bg-card/70 px-4 py-6 backdrop-blur-lg lg:flex">
      <Logo className="px-2" />

      <Button asChild className="mt-8 w-full justify-start gap-2">
        <Link href="/places/new">
          <Plus className="h-4 w-4" />
          Add a place
        </Link>
      </Button>

      <nav className="mt-6 flex flex-1 flex-col gap-1.5">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition-all',
                isActive
                  ? 'bg-gradient-to-r from-primary/15 to-transparent text-primary'
                  : 'text-muted-foreground hover:translate-x-0.5 hover:bg-accent hover:text-foreground',
              )}
            >
              {isActive && (
                <span className="absolute -left-4 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
              )}
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <p className="px-3 pt-4 font-accent text-xs italic text-muted-foreground/70">
        every place tells a story ✨
      </p>
    </aside>
  );
}
