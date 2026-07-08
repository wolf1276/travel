import { z } from 'zod';
import { RATING_MAX, RATING_MIN } from '@/lib/constants';

export const placeSchema = z.object({
  city: z.string().trim().min(1, 'City is required').max(100),
  country: z.string().trim().min(1, 'Country is required').max(100),
  countryCode: z.string().trim().length(2).optional().nullable(),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  coverImageUrl: z.string().url().optional().nullable(),
  coverImagePath: z.string().optional().nullable(),
  dreamNotes: z.string().trim().max(2000).optional().nullable(),
  personalReason: z.string().trim().max(1000).optional().nullable(),
  tags: z.array(z.string().trim().min(1).max(30)).max(10).default([]),
});
export type PlaceFormInput = z.infer<typeof placeSchema>;

export const updatePlaceSchema = placeSchema.partial();
export type UpdatePlaceFormInput = z.infer<typeof updatePlaceSchema>;

export const markAsVisitedSchema = z.object({
  visitDate: z.string().min(1, 'Visit date is required'),
  rating: z.number().int().min(RATING_MIN).max(RATING_MAX),
  journal: z.string().trim().max(5000).optional().nullable(),
  photos: z
    .array(
      z.object({
        url: z.string().url(),
        path: z.string().min(1),
        width: z.number().int().positive().optional().nullable(),
        height: z.number().int().positive().optional().nullable(),
        caption: z.string().trim().max(300).optional().nullable(),
      }),
    )
    .max(30)
    .default([]),
  favoritePhotoIndex: z.number().int().min(0).optional().nullable(),
});
export type MarkAsVisitedFormInput = z.infer<typeof markAsVisitedSchema>;
