import { z } from 'zod';

export const vehicleSpecificationSchema = z.object({
  manufacturer: z.string().min(1, 'Manufacturer is required'),
  model: z.string().min(1, 'Model is required'),
  version: z.string().min(1, 'Version is required'),
  yearManufacture: z.string().min(4, 'Year Manufacture must be 4 digits'),
  yearModel: z.string().min(4, 'Year Model must be 4 digits'),
  color: z.string().min(1, 'Color is required'),
  fuelType: z.string().min(1, 'Fuel Type is required')
});

export const vehicleIdentificationSchema = z.object({
  plate: z.string().length(7, 'Plate must be exactly 7 characters'),
  renavam: z.string().min(1, 'Renavam is required'),
  vin: z.string().min(1, 'VIN is required'),
  serialNumber: z.string().min(1, 'Serial number is required'),
  vehicleType: z.enum(['car', 'motorcycle', 'other'])
});

export const vehicleOperationalSchema = z.object({
  odometerStartedAt: z.coerce.number().min(0, 'Must be positive'),
  odometerNow: z.coerce.number().min(0, 'Must be positive'),
  status: z.enum(['active', 'inactive', 'maintenance', 'sold', 'stolen', 'scrapped', 'other'])
});

export const vehicleAcquisitionSchema = z.object({
  acquisitionsType: z.enum(['purchase', 'lease', 'rental', 'transfer', 'donation']),
  acquisitionDate: z.string().min(1, 'Acquisition date is required'),
  acquisitionValue: z.coerce.number().min(0, 'Must be positive'),
  invoiceNumber: z.coerce.number().int().positive('Must be positive'),
  financedId: z.string().optional()
});

export const vehicleSaveSchema = z.object({
  specification: vehicleSpecificationSchema,
  identification: vehicleIdentificationSchema,
  operational: vehicleOperationalSchema,
  acquisition: vehicleAcquisitionSchema
});

export type TVehicleSaveSchema = z.infer<typeof vehicleSaveSchema>;
