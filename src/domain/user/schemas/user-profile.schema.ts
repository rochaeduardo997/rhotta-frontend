import { z } from 'zod';

export const userProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Please enter a valid email address').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional()
});

export type TUserProfileSchema = z.infer<typeof userProfileSchema>;
