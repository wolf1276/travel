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

  const couple = await prisma.$transaction(async (tx) => {
    await tx.user.update({ where: { id: user.id }, data: { coupleId: invite.coupleId } });
    await tx.coupleInvite.update({
      where: { id: invite.id },
      data: { status: 'ACCEPTED', acceptedById: user.id },
    });
    return tx.couple.findUniqueOrThrow({ where: { id: invite.coupleId }, include: { members: true } });
  });

  return NextResponse.json({ couple: serializeCouple(couple) });
}
