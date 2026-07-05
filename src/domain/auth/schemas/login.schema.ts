import { z } from 'zod';

export const loginSchema = z.object({
  login: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional()
});

export type TLoginSchema = z.infer<typeof loginSchema>;
