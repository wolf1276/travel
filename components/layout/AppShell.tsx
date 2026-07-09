import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { TopNav } from '@/components/layout/TopNav';
import { PageTransition } from '@/components/layout/PageTransition';

export function AppShell({
  displayName,
  email,
  avatarUrl,
  children,
}: {
  displayName: string | null;
  email: string;
  avatarUrl: string | null;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-background">
      <Sidebar />
      <div className="flex flex-col lg:pl-64">
        <TopNav displayName={displayName} email={email} avatarUrl={avatarUrl} />
        <main className="flex-1 px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-6 sm:px-6 lg:px-8 lg:pb-10">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
