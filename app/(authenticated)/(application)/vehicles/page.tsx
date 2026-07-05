'use client';

import VehiclesMainPagePresentation from '@src/components/presentation/vehicles/main/page';
import { Suspense } from 'react';

export default function VehiclesPage() {
  return (
    <Suspense fallback={<div>Loading vehicles...</div>}>
      <VehiclesMainPagePresentation />
    </Suspense>
  );
}
