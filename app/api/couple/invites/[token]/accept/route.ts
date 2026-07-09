import { NextResponse } from 'next/server';
import { getServerUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { serializeCouple } from '@/lib/serializers/couple';

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const user = await getServerUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { token } = await params;

  const invite = await prisma.coupleInvite.findUnique({
    where: { token },
    include: { couple: { include: { members: true } } },
  });

  if (!invite) return NextResponse.json({ error: 'Invite not found' }, { status: 404 });
  if (invite.status !== 'PENDING' || invite.expiresAt < new Date()) {
    return NextResponse.json({ error: 'This invite is no longer valid' }, { status: 410 });
  }
  if (invite.invitedById === user.id) {
    return NextResponse.json({ error: "You can't accept your own invite" }, { status: 400 });
  }
  if (invite.couple.members.length >= 2) {
    return NextResponse.json({ error: 'This couple already has a travel partner' }, { status: 409 });
  }

  const ownCouple = await prisma.couple.findUniqueOrThrow({
    where: { id: user.coupleId },
    include: { members: true },
  });
  if (ownCouple.members.length >= 2) {
    return NextResponse.json({ error: 'You already have a travel partner' }, { status: 409 });
  }

  try {
    const couple = await prisma.$transaction(async (tx) => {
      // Atomically claim the invite: if another concurrent request (double
      // click, two tabs/devices) already flipped it out of PENDING, this
      // update affects zero rows and we abort instead of double-joining.
      const claimed = await tx.coupleInvite.updateMany({
        where: { id: invite.id, status: 'PENDING' },
        data: { status: 'ACCEPTED', acceptedById: user.id },
      });
      if (claimed.count === 0) {
        throw new Error('INVITE_ALREADY_CLAIMED');
      }

      const targetCouple = await tx.couple.findUniqueOrThrow({
        where: { id: invite.coupleId },
        include: { members: true },
      });
      if (targetCouple.members.length >= 2) {
        throw new Error('COUPLE_FULL');
      }

      await tx.user.update({ where: { id: user.id }, data: { coupleId: invite.coupleId } });
      return tx.couple.findUniqueOrThrow({ where: { id: invite.coupleId }, include: { members: true } });
    });

    return NextResponse.json({ couple: serializeCouple(couple) });
  } catch (error) {
    if (error instanceof Error && error.message === 'INVITE_ALREADY_CLAIMED') {
      return NextResponse.json({ error: 'This invite is no longer valid' }, { status: 410 });
    }
    if (error instanceof Error && error.message === 'COUPLE_FULL') {
      return NextResponse.json({ error: 'This couple already has a travel partner' }, { status: 409 });
    }
    throw error;
  }
}
