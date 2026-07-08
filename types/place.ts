import type { PlaceStatus } from '@prisma/client';

export type { PlaceStatus };

export interface Tag {
  id: string;
  name: string;
}

export interface PlaceListItem {
  id: string;
  city: string;
  country: string;
  countryCode: string | null;
  coverImageUrl: string | null;
  dreamNotes: string | null;
  status: PlaceStatus;
  createdAt: string;
  latitude: number | null;
  longitude: number | null;
  tags: Tag[];
  addedBy: { displayName: string | null; email: string };
  visit: {
    id: string;
    visitDate: string;
    rating: number;
    journal: string | null;
    photoCount: number;
    favoritePhotoUrl: string | null;
  } | null;
}

export interface PlaceDetail extends PlaceListItem {
  personalReason: string | null;
  updatedAt: string;
  visit:
    | (PlaceListItem['visit'] & {
        photos: {
          id: string;
          url: string;
          width: number | null;
          height: number | null;
          isFavorite: boolean;
          caption: string | null;
        }[];
      })
    | null;
}

export interface CreatePlaceInput {
  city: string;
  country: string;
  countryCode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  coverImageUrl?: string | null;
  coverImagePath?: string | null;
  dreamNotes?: string | null;
  personalReason?: string | null;
  tags: string[];
}

export type UpdatePlaceInput = Partial<CreatePlaceInput>;

export interface MarkAsVisitedInput {
  visitDate: string;
  rating: number;
  journal?: string | null;
  photos: {
    url: string;
    path: string;
    width?: number | null;
    height?: number | null;
    caption?: string | null;
  }[];
  favoritePhotoIndex?: number | null;
}
