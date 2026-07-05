export type TVehicleSpecification = {
  manufacturer: string;
  model: string;
  version: string;
  yearManufacture: string;
  yearModel: string;
  color: string;
  fuelType: string;
};

export type TVehicleIdentification = {
  plate: string;
  renavam: string;
  vin: string;
  serialNumber: string;
  vehicleType: 'car' | 'motorcycle' | 'other';
};

export type TVehicleOperational = {
  odometerStartedAt: number;
  odometerNow: number;
  status: 'active' | 'inactive' | 'maintenance' | 'sold' | 'stolen' | 'scrapped' | 'other';
};

export type TVehicleAcquisition = {
  acquisitionsType: 'purchase' | 'lease' | 'rental' | 'transfer' | 'donation';
  acquisitionDate: string;
  acquisitionValue: number;
  invoiceNumber: number;
  financedId?: string;
};

export type TVehicle = {
  id: string;
  fleetId: string;
  specification: TVehicleSpecification;
  identification: TVehicleIdentification;
  operational: TVehicleOperational;
  acquisition: TVehicleAcquisition;
  documentKey?: string;
  createdAt?: string;
  updatedAt?: string;
};
