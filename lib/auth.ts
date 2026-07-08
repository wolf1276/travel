import { redirect } from 'next/navigation';
import type { User } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/services/supabase/server';

/**
 * Resolves the current Supabase session and mirrors it into our Prisma
 * `User` table on first sight (see prisma/schema.prisma for why the two are
 * kept separate). Returns null when there is no session.
 */
export async function getServerUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) return null;

  const existing = await prisma.user.findUnique({ where: { id: authUser.id } });
  if (existing) return existing;

  const metadata = authUser.user_metadata as Record<string, unknown>;

  return prisma.user.upsert({
    where: { id: authUser.id },
    update: {},
    create: {
      id: authUser.id,
      email: authUser.email ?? '',
      displayName:
        (metadata.full_name as string | undefined) ?? (metadata.name as string | undefined) ?? null,
      avatarUrl: (metadata.avatar_url as string | undefined) ?? null,
    },
  });
}

export async function requireServerUser(): Promise<User> {
  const user = await getServerUser();
  if (!user) redirect('/login');
  return user;
}
