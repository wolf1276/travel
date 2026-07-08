import type { Prisma } from '@prisma/client';

/** Replaces a place's tag set, upserting Tag rows by (userId, name). */
export async function syncPlaceTags(
  tx: Prisma.TransactionClient,
  userId: string,
  placeId: string,
  tagNames: string[],
) {
  const names = Array.from(new Set(tagNames.map((name) => name.trim()).filter(Boolean)));

  await tx.placeTag.deleteMany({ where: { placeId } });
  if (names.length === 0) return;

  for (const name of names) {
    const tag = await tx.tag.upsert({
      where: { userId_name: { userId, name } },
      update: {},
      create: { userId, name },
    });
    await tx.placeTag.create({ data: { placeId, tagId: tag.id } });
  }
}
