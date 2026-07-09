import { z } from 'zod';
import { RATING_MAX, RATING_MIN } from '@/lib/constants';

export const placeSchema = z.object({
  name: z.string().trim().min(1, 'Place name is required').max(200),
  address: z.string().trim().max(300).optional().nullable(),
  country: z.string().trim().max(100).optional().nullable(),
  countryCode: z.string().trim().length(2).optional().nullable(),
  placeProviderId: z.string().trim().max(300).optional().nullable(),
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

const photoInputSchema = z.object({
  url: z.string().url(),
  path: z.string().min(1),
  width: z.number().int().positive().optional().nullable(),
  height: z.number().int().positive().optional().nullable(),
  caption: z.string().trim().max(300).optional().nullable(),
});

export const markAsVisitedSchema = z.object({
  visitDate: z.string().min(1, 'Visit date is required'),
  rating: z.number().int().min(RATING_MIN).max(RATING_MAX).optional().nullable(),
  journal: z.string().trim().max(5000).optional().nullable(),
  photos: z.array(photoInputSchema).max(30).default([]),
  favoritePhotoIndex: z.number().int().min(0).optional().nullable(),
});
export type MarkAsVisitedFormInput = z.infer<typeof markAsVisitedSchema>;

export const addPhotosSchema = z.object({
  photos: z.array(photoInputSchema).min(1).max(30),
});
export type AddPhotosFormInput = z.infer<typeof addPhotosSchema>;
