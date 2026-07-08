import { NextRequest, NextResponse } from 'next/server';
import { getServerUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { profileSchema } from '@/lib/validations/profile.schema';

export async function PATCH(request: NextRequest) {
  const user = await getServerUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const json = await request.json();
  const parsed = profileSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid profile data', issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const updated = await prisma.user.update({ where: { id: user.id }, data: parsed.data });

  return NextResponse.json({
    user: {
      id: updated.id,
      email: updated.email,
      displayName: updated.displayName,
      avatarUrl: updated.avatarUrl,
      bio: updated.bio,
    },
  });
}
