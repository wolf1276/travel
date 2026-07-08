'use client';

import { Loader2, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAcceptInvite } from '@/hooks/useAcceptInvite';
import type { CoupleInvite } from '@/types/couple';

export function InviteAcceptCard({ invite }: { invite: CoupleInvite }) {
  const acceptInvite = useAcceptInvite(invite.token);
  const inviter = invite.invitedBy;

  async function handleAccept() {
    try {
      await acceptInvite.mutateAsync();
      toast.success(`You're now sharing travels with ${inviter.displayName ?? inviter.email}`);
    } catch {
      toast.error('Could not accept this invite.', {
        action: { label: 'Retry', onClick: () => void handleAccept() },
      });
    }
  }

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Users className="h-4 w-4" />
          You&apos;ve been invited
        </CardTitle>
        <CardDescription>
          Join {inviter.displayName ?? inviter.email} and share one collection of places and memories.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={inviter.avatarUrl ?? undefined} alt={inviter.displayName ?? inviter.email} />
            <AvatarFallback>{(inviter.displayName ?? inviter.email)[0]?.toUpperCase() ?? '?'}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{inviter.displayName ?? inviter.email}</p>
            <p className="text-xs text-muted-foreground">{inviter.email}</p>
          </div>
        </div>
        <Button type="button" onClick={handleAccept} disabled={acceptInvite.isPending} className="w-full">
          {acceptInvite.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Accept invite
        </Button>
      </CardContent>
    </Card>
  );
}
