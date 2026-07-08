import { requireServerUser } from '@/lib/auth';
import { AppShell } from '@/components/layout/AppShell';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireServerUser();

  return (
    <AppShell displayName={user.displayName} email={user.email} avatarUrl={user.avatarUrl}>
      {children}
    </AppShell>
  );
}
