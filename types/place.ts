import type { PlaceStatus } from '@prisma/client';

export type { PlaceStatus };

export interface Tag {
  id: string;
  name: string;
}

export interface Attribution {
  displayName: string | null;
  email: string;
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
  addedBy: Attribution;
  visit: {
    id: string;
    visitDate: string;
    rating: number | null;
    journal: string | null;
    photoCount: number;
    favoritePhotoUrl: string | null;
    visitedBy: Attribution;
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
          uploadedBy: Attribution;
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

export interface PhotoInput {
  url: string;
  path: string;
  width?: number | null;
  height?: number | null;
  caption?: string | null;
}

export interface MarkAsVisitedInput {
  visitDate: string;
  rating?: number | null;
  journal?: string | null;
  photos: PhotoInput[];
  favoritePhotoIndex?: number | null;
}

export interface AddPhotosInput {
  photos: PhotoInput[];
}
