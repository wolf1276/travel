import type { Prisma } from '@prisma/client';

export const PLACE_INCLUDE = {
  tags: { include: { tag: true } },
  createdBy: { select: { displayName: true, email: true } },
  visits: {
    orderBy: { visitDate: 'desc' },
    take: 1,
    include: {
      user: { select: { displayName: true, email: true } },
      photos: {
        orderBy: { position: 'asc' },
        include: { user: { select: { displayName: true, email: true } } },
      },
    },
  },
} satisfies Prisma.PlaceInclude;
