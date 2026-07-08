import type { Metadata } from 'next';
import { requireServerUser } from '@/lib/auth';
import { ProfileForm } from '@/features/profile/components/ProfileForm';
import { SignOutButton } from '@/features/profile/components/SignOutButton';
import { StatsGrid } from '@/features/stats/components/StatsGrid';

export const metadata: Metadata = { title: 'Profile — Travel Memories' };

export default async function ProfilePage() {
  const user = await requireServerUser();

  return (
    <div className="mx-auto max-w-2xl space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Profile</h1>
          <p className="text-sm text-muted-foreground">Your account and travel stats.</p>
        </div>
        <SignOutButton />
      </div>

      <StatsGrid />

      <ProfileForm
        user={{
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          avatarUrl: user.avatarUrl,
          bio: user.bio,
        }}
      />
    </div>
  );
}
