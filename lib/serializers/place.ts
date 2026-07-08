import type { Photo, Place, PlaceTag, Tag, Visit } from '@prisma/client';
import type { PlaceDetail, PlaceListItem } from '@/types/place';

export type PlaceWithRelations = Place & {
  tags: (PlaceTag & { tag: Tag })[];
  visits: (Visit & { photos: Photo[] })[];
};

export function serializePlaceListItem(place: PlaceWithRelations): PlaceListItem {
  const visit = place.visits[0];
  const favoritePhoto = visit ? (visit.photos.find((p) => p.isFavorite) ?? visit.photos[0]) : undefined;

  return {
    id: place.id,
    city: place.city,
    country: place.country,
    countryCode: place.countryCode,
    coverImageUrl: place.coverImageUrl,
    dreamNotes: place.dreamNotes,
    status: place.status,
    createdAt: place.createdAt.toISOString(),
    latitude: place.latitude,
    longitude: place.longitude,
    tags: place.tags.map(({ tag }) => ({ id: tag.id, name: tag.name })),
    visit: visit
      ? {
          id: visit.id,
          visitDate: visit.visitDate.toISOString(),
          rating: visit.rating,
          journal: visit.journal,
          photoCount: visit.photos.length,
          favoritePhotoUrl: favoritePhoto?.url ?? null,
        }
      : null,
  };
}

export function serializePlaceDetail(place: PlaceWithRelations): PlaceDetail {
  const base = serializePlaceListItem(place);
  const visit = place.visits[0];

  return {
    ...base,
    personalReason: place.personalReason,
    updatedAt: place.updatedAt.toISOString(),
    visit:
      visit && base.visit
        ? {
            ...base.visit,
            photos: visit.photos.map((photo) => ({
              id: photo.id,
              url: photo.url,
              width: photo.width,
              height: photo.height,
              isFavorite: photo.isFavorite,
              caption: photo.caption,
            })),
          }
        : null,
  };
}
