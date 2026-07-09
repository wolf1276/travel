import type { Metadata } from 'next';
import { Users } from 'lucide-react';
import { requireServerUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { serializeCoupleInvite } from '@/lib/serializers/couple';
import { EmptyState } from '@/components/common/EmptyState';
import { InviteAcceptCard } from '@/features/couple/components/InviteAcceptCard';

export const metadata: Metadata = { title: 'Join — Travel Memories' };

export default async function InviteAcceptPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const user = await requireServerUser(`/invite/${token}`);

  const invite = await prisma.coupleInvite.findUnique({
    where: { token },
    include: { invitedBy: true, couple: { include: { members: true } } },
  });

  if (!invite || invite.status !== 'PENDING' || invite.expiresAt < new Date()) {
    return (
      <EmptyState
        icon={<Users className="h-6 w-6" />}
        title="Invite no longer valid"
        description="This invite link has expired or was already used. Ask your partner to send a new one."
      />
    );
  }

  if (invite.invitedById === user.id) {
    return (
      <EmptyState
        icon={<Users className="h-6 w-6" />}
        title="This is your own invite link"
        description="Share it with your partner so they can accept it from their own account."
      />
    );
  }

  if (invite.couple.members.length >= 2) {
    return (
      <EmptyState
        icon={<Users className="h-6 w-6" />}
        title="This couple is already complete"
        description="This invite's couple already has a travel partner."
      />
    );
  }

  if (user.coupleId !== invite.coupleId) {
    const ownCouple = await prisma.couple.findUniqueOrThrow({
      where: { id: user.coupleId },
      include: { members: true },
    });
    if (ownCouple.members.length >= 2) {
      return (
        <EmptyState
          icon={<Users className="h-6 w-6" />}
          title="You already have a travel partner"
          description="Leave your current pairing before accepting a new invite."
        />
      );
    }
  }

  return <InviteAcceptCard invite={serializeCoupleInvite(invite)} />;
}
