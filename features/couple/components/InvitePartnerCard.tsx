'use client';

import { Link2, Loader2, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useCouple } from '@/hooks/useCouple';
import { useCoupleInvite, useCreateCoupleInvite } from '@/hooks/useCoupleInvite';

export function InvitePartnerCard({ currentUserId }: { currentUserId: string }) {
  const { data: couple, isPending: isCoupleLoading } = useCouple();
  const { data: invite, isPending: isInviteLoading } = useCoupleInvite();
  const createInvite = useCreateCoupleInvite();

  if (isCoupleLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  const partner = couple?.members.find((member) => member.id !== currentUserId);

  if (partner) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-4 w-4" />
            Travel partner
          </CardTitle>
          <CardDescription>You&apos;re sharing your places and memories together.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={partner.avatarUrl ?? undefined} alt={partner.displayName ?? partner.email} />
            <AvatarFallback>{(partner.displayName ?? partner.email)[0]?.toUpperCase() ?? '?'}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{partner.displayName ?? partner.email}</p>
            <p className="text-xs text-muted-foreground">{partner.email}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  async function handleInvite() {
    try {
      await createInvite.mutateAsync();
    } catch {
      toast.error('Could not create an invite link.', {
        action: { label: 'Retry', onClick: () => void handleInvite() },
      });
    }
  }

  async function handleCopy() {
    if (!invite) return;
    const url = `${window.location.origin}/invite/${invite.token}`;
    await navigator.clipboard.writeText(url);
    toast.success('Invite link copied');
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Users className="h-4 w-4" />
          Travel partner
        </CardTitle>
        <CardDescription>Invite your partner to share your places and memories.</CardDescription>
      </CardHeader>
      <CardContent>
        {isInviteLoading ? (
          <Skeleton className="h-10 w-full" />
        ) : invite ? (
          <Button type="button" variant="outline" onClick={handleCopy} className="w-full">
            <Link2 className="h-4 w-4" />
            Copy invite link
          </Button>
        ) : (
          <Button type="button" onClick={handleInvite} disabled={createInvite.isPending} className="w-full">
            {createInvite.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Invite your partner
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
