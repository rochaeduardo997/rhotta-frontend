import { z } from 'zod';

export const vehicleOperationalUpdateSchema = z.object({
  odometerNow: z.coerce.number().min(0, 'Odometer must be positive'),
  status: z.enum(['active', 'inactive', 'maintenance', 'sold', 'stolen', 'scrapped', 'other'])
});

export type TVehicleOperationalUpdateSchema = z.infer<typeof vehicleOperationalUpdateSchema>;
