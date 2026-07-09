'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV_ITEMS } from '@/lib/constants';

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around rounded-t-3xl border-t border-border/60 bg-card/95 px-2 pb-[max(0.625rem,env(safe-area-inset-bottom))] pt-2.5 shadow-elevated backdrop-blur-lg lg:hidden">
      {NAV_ITEMS.slice(0, 2).map((item) => (
        <MobileNavLink key={item.href} item={item} pathname={pathname} />
      ))}

      <Link
        href="/places/new"
        className="flex h-12 w-12 -translate-y-3 items-center justify-center rounded-full bg-gradient-to-br from-primary to-rose-gold text-primary-foreground shadow-dreamy transition-transform active:scale-95"
        aria-label="Add place"
      >
        <Plus className="h-5 w-5" />
      </Link>

      {NAV_ITEMS.slice(2).map((item) => (
        <MobileNavLink key={item.href} item={item} pathname={pathname} />
      ))}
    </nav>
  );
}

function MobileNavLink({
  item,
  pathname,
}: {
  item: (typeof NAV_ITEMS)[number];
  pathname: string;
}) {
  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        'flex flex-col items-center gap-0.5 rounded-full px-4 py-1.5 text-[11px] font-medium transition-colors',
        isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground',
      )}
    >
      <Icon className="h-5 w-5" />
      {item.label}
    </Link>
  );
}
