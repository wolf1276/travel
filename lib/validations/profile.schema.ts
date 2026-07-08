import { z } from 'zod';

export const profileSchema = z.object({
  displayName: z.string().trim().min(1, 'Name is required').max(60),
  bio: z.string().trim().max(500).optional().nullable(),
  avatarUrl: z.string().url().optional().nullable(),
});
export type ProfileFormInput = z.infer<typeof profileSchema>;
