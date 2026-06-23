import { z } from 'zod';

export const addScoreSchema = z.object({
  score_value: z
    .number({ invalid_type_error: 'Score must be a number' })
    .int('Score must be a whole number')
    .min(1, 'Score must be at least 1')
    .max(45, 'Score cannot exceed 45'),
  score_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

export const updateScoreSchema = z.object({
  score_value: z
    .number({ invalid_type_error: 'Score must be a number' })
    .int()
    .min(1)
    .max(45)
    .optional(),
  score_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .optional(),
});

export type AddScoreDto = z.infer<typeof addScoreSchema>;
export type UpdateScoreDto = z.infer<typeof updateScoreSchema>;
