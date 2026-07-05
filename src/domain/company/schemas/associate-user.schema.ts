import { z } from 'zod';

export const associateUserSchema = z.object({
  userId: z.string().uuid('Please select a valid user'),
  role: z.enum(['owner', 'employee']),
  permission: z.enum(['read-only', 'read-write'])
});

export type TAssociateUserSchema = z.infer<typeof associateUserSchema>;
