import { z } from 'zod';
import { ERole } from '../entities/role.type';

export const userSaveSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  role: z.nativeEnum(ERole)
});

export type TUserSaveSchema = z.infer<typeof userSaveSchema>;
