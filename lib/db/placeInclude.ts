import type { Prisma } from '@prisma/client';

export const PLACE_INCLUDE = {
  tags: { include: { tag: true } },
  createdBy: { select: { displayName: true, email: true } },
  visits: {
    orderBy: { visitDate: 'desc' },
    take: 1,
    include: { photos: { orderBy: { position: 'asc' } } },
  },
} satisfies Prisma.PlaceInclude;
