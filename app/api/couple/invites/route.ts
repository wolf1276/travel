import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { getServerUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { serializeCoupleInvite } from '@/lib/serializers/couple';

const INVITE_TTL_DAYS = 7;

export async function GET() {
  const user = await getServerUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const invite = await prisma.coupleInvite.findFirst({
    where: { coupleId: user.coupleId, status: 'PENDING', expiresAt: { gt: new Date() } },
    include: { invitedBy: true },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ invite: invite ? serializeCoupleInvite(invite) : null });
}

export async function POST() {
  const user = await getServerUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const couple = await prisma.couple.findUniqueOrThrow({
    where: { id: user.coupleId },
    include: { members: true },
  });

  if (couple.members.length >= 2) {
    return NextResponse.json({ error: 'You already have a travel partner' }, { status: 409 });
  }

  const existing = await prisma.coupleInvite.findFirst({
    where: { coupleId: user.coupleId, status: 'PENDING', expiresAt: { gt: new Date() } },
    include: { invitedBy: true },
    orderBy: { createdAt: 'desc' },
  });
  if (existing) {
    return NextResponse.json({ invite: serializeCoupleInvite(existing) });
  }

  const invite = await prisma.coupleInvite.create({
    data: {
      coupleId: user.coupleId,
      invitedById: user.id,
      token: randomUUID(),
      expiresAt: new Date(Date.now() + INVITE_TTL_DAYS * 24 * 60 * 60 * 1000),
    },
    include: { invitedBy: true },
  });

  return NextResponse.json({ invite: serializeCoupleInvite(invite) }, { status: 201 });
}
