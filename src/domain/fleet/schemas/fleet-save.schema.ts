import { z } from 'zod';

export const fleetSaveSchema = z.object({
  name: z.string().min(2, 'Fleet name must be at least 2 characters'),
  description: z.string().optional()
});

export type TFleetSaveSchema = z.infer<typeof fleetSaveSchema>;
