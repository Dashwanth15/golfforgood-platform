import { z } from 'zod';

export const updateProfileSchema = z.object({
  full_name: z
    .string()
    .min(2, 'Name must be at least 2 characters long')
    .max(100, 'Name is too long')
    .optional(),
  avatar_url: z
    .string()
    .url('Enter a valid URL')
    .or(z.literal(''))
    .optional()
    .nullable(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .optional(),
});

export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;
