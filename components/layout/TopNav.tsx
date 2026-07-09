import Link from 'next/link';
import { Search } from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { UserMenu } from '@/components/layout/UserMenu';

export function TopNav({
  displayName,
  email,
  avatarUrl,
}: {
  displayName: string | null;
  email: string;
  avatarUrl: string | null;
}) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border/70 bg-background/85 px-4 backdrop-blur-lg sm:px-6 lg:px-8">
      <div className="lg:hidden">
        <Logo iconOnly />
      </div>
      <div className="hidden lg:block" />

      <div className="flex items-center gap-3">
        <Link
          href="/search"
          className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </Link>
        <UserMenu displayName={displayName} email={email} avatarUrl={avatarUrl} />
      </div>
    </header>
  );
}
