import { z } from 'zod';

export const profileSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  bio: z.string().max(500).optional(),
  height: z.number().positive().max(300).optional(), //cm
  weight: z.number().positive().max(200).optional(), // kg
  avatarUrl: z.url().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
