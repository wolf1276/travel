import { NextResponse } from 'next/server';
import { getServerUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { serializeCouple } from '@/lib/serializers/couple';

export async function GET() {
  const user = await getServerUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const couple = await prisma.couple.findUniqueOrThrow({
    where: { id: user.coupleId },
    include: { members: true },
  });

  return NextResponse.json({ couple: serializeCouple(couple) });
}
