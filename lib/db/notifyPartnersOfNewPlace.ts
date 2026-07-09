import type { Prisma } from '@prisma/client';

/** Notifies every other member of the acting user's Couple that a new Place
 * was added (see POST /api/places). A couple is always exactly two people,
 * but this loops over "everyone else" rather than assuming a single partner. */
export async function notifyPartnersOfNewPlace(
  tx: Prisma.TransactionClient,
  actor: { id: string; coupleId: string; displayName: string | null; email: string },
  placeId: string,
) {
  const partners = await tx.user.findMany({
    where: { coupleId: actor.coupleId, id: { not: actor.id } },
    select: { id: true },
  });
  if (partners.length === 0) return;

  const actorName = actor.displayName ?? actor.email;

  await tx.notification.createMany({
    data: partners.map((partner) => ({
      userId: partner.id,
      actorId: actor.id,
      placeId,
      message: `${actorName} added a new place.`,
    })),
  });
}
