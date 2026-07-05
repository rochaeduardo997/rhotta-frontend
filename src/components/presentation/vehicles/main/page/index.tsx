'use client';

import { useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2, FileText, Upload, Download, Eye, Settings, FileUp } from 'lucide-react';

import findAllVehiclesService from '@src/domain/vehicle/applications/find-all-vehicles.service';
import createVehicleService from '@src/domain/vehicle/applications/create-vehicle.service';
import updateVehicleOperationalService from '@src/domain/vehicle/applications/update-vehicle-operational.service';
import deleteVehicleService from '@src/domain/vehicle/applications/delete-vehicle.service';
import uploadVehicleDocumentService from '@src/domain/vehicle/applications/upload-vehicle-document.service';
import downloadVehicleDocumentService from '@src/domain/vehicle/applications/download-vehicle-document.service';

import { Button } from '@src/components/@shared/components/ui/button';
import { Input } from '@src/components/@shared/components/ui/input';
import { Label } from '@src/components/@shared/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@src/components/@shared/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@src/components/@shared/components/ui/table';
import { toast } from '@src/components/@shared/components/ui/use-toast';
import { vehicleSaveSchema, TVehicleSaveSchema } from '@src/domain/vehicle/schemas/vehicle-save.schema';
import { vehicleOperationalUpdateSchema, TVehicleOperationalUpdateSchema } from '@src/domain/vehicle/schemas/vehicle-operational.schema';
import MainLayout from '@src/components/@shared/components/main-layout';
import useAuth from '@src/@shared/hooks/auth/use-auth.hook';

export default function VehiclesMainPagePresentation() {
  const searchParams = useSearchParams();
  const fleetId = searchParams.get('fleetId') || '';
  const { user: currentUser } = useAuth();

  const tCommon = useTranslations('Common');
  const tVehicles = useTranslations('Vehicles');
  const queryClient = useQueryClient();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isOperationalOpen, setIsOperationalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<any | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [plateFilter, setPlateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { data: vehiclesResponse, isLoading: isVehiclesLoading } = useQuery({
    queryKey: ['vehicles', fleetId, plateFilter, statusFilter],
    queryFn: () => findAllVehiclesService.execute({
      ...(fleetId && { fleetId }),
      ...(plateFilter && { plate: plateFilter }),
      ...(statusFilter && { status: statusFilter })
    }),
    enabled: currentUser?.role === 'admin' || !!fleetId
  });
  const vehicles = vehiclesResponse?.items || [];

  const createMutation = useMutation({
    mutationFn: (data: TVehicleSaveSchema) => createVehicleService.execute(fleetId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      setIsCreateOpen(false);
      toast({ title: tVehicles('save-success') });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteVehicleService.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast({ title: tVehicles('delete-success') });
    }
  });

  const updateOperationalMutation = useMutation({
    mutationFn: (data: TVehicleOperationalUpdateSchema) =>
      updateVehicleOperationalService.execute(selectedVehicle.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      setIsOperationalOpen(false);
      setSelectedVehicle(null);
      toast({ title: tVehicles('save-success') });
    }
  });

  const uploadDocMutation = useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) => uploadVehicleDocumentService.execute(id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast({ title: tVehicles('doc-success') });
    }
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TVehicleSaveSchema>({
    resolver: zodResolver(vehicleSaveSchema),
    defaultValues: {
      specification: {
        manufacturer: '',
        model: '',
        version: '',
        yearManufacture: '',
        yearModel: '',
        color: '',
        fuelType: ''
      },
      identification: {
        plate: '',
        renavam: '',
        vin: '',
        serialNumber: '',
        vehicleType: 'car'
      },
      operational: {
        odometerStartedAt: 0,
        odometerNow: 0,
        status: 'active'
      },
      acquisition: {
        acquisitionsType: 'purchase',
        acquisitionDate: new Date().toISOString().split('T')[0],
        acquisitionValue: 0,
        invoiceNumber: 123
      }
    }
  });

  const { register: regOp, handleSubmit: handleOpSubmit, reset: resetOp, formState: { errors: opErrors } } = useForm<TVehicleOperationalUpdateSchema>({
    resolver: zodResolver(vehicleOperationalUpdateSchema)
  });

  const handleOpenCreate = () => {
    reset();
    setIsCreateOpen(true);
  };

  const handleOpenOperational = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    resetOp({
      odometerNow: vehicle.operational.odometerNow,
      status: vehicle.operational.status
    });
    setIsOperationalOpen(true);
  };

  const handleSaveSubmit = (data: TVehicleSaveSchema) => {
    createMutation.mutate(data);
  };

  const handleOperationalSubmit = (data: TVehicleOperationalUpdateSchema) => {
    updateOperationalMutation.mutate(data);
  };

  const handleFileChange = (vehicleId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadDocMutation.mutate({ id: vehicleId, file });
    }
  };

  const handleDownloadDoc = async (vehicle: any) => {
    try {
      const blob = await downloadVehicleDocumentService.execute(vehicle.id);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `document_${vehicle.identification.plate}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      toast({ title: 'Download failed', variant: 'destructive' });
    }
  };

  const BREADCRUMB_ITEMS = [
    { label: 'Companies', href: '/companies' },
    { label: 'Vehicles' }
  ];

  return (
    <MainLayout breadcrumbItems={BREADCRUMB_ITEMS}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl leading-none font-bold tracking-tight text-foreground">
              {tVehicles('title')}
            </h1>
            <p className="text-sm text-muted-foreground">
              {tVehicles('subtitle')}
            </p>
          </div>
          {fleetId && (
            <Button onClick={handleOpenCreate} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {tVehicles('create-btn')}
            </Button>
          )}
        </div>

        <div className="flex gap-4 items-center bg-card p-4 rounded-lg border border-border">
          <div className="grid gap-2">
            <Label htmlFor="filter-plate">Plate</Label>
            <Input
              id="filter-plate"
              placeholder="ABC1D23"
              value={plateFilter}
              onChange={(e) => setPlateFilter(e.target.value)}
              className="w-40"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="filter-status">Status</Label>
            <select
              id="filter-status"
              className="flex h-9 w-40 rounded-md border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="maintenance">Maintenance</option>
              <option value="sold">Sold</option>
              <option value="stolen">Stolen</option>
              <option value="scrapped">Scrapped</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="rounded-md border border-border bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{tVehicles('manufacturer')}</TableHead>
                <TableHead>{tVehicles('model')}</TableHead>
                <TableHead>{tVehicles('plate')}</TableHead>
                <TableHead>{tVehicles('status')}</TableHead>
                <TableHead>{tVehicles('odometer')}</TableHead>
                <TableHead className="text-right">{tCommon('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isVehiclesLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">{tCommon('loading')}</TableCell>
                </TableRow>
              ) : vehicles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">{tCommon('no-data')}</TableCell>
                </TableRow>
              ) : (
                vehicles.map((vehicle: any) => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-medium text-foreground">{vehicle.specification.manufacturer}</TableCell>
                    <TableCell className="text-foreground">{vehicle.specification.model}</TableCell>
                    <TableCell className="text-foreground font-mono">{vehicle.identification.plate}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset bg-primary/10 text-primary">
                        {vehicle.operational.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{vehicle.operational.odometerNow} km</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setSelectedVehicle(vehicle);
                            setIsDetailOpen(true);
                          }}
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleOpenOperational(vehicle)}
                        >
                          <Settings className="h-3.5 w-3.5" />
                        </Button>
                        <div className="relative">
                          <input
                            type="file"
                            className="hidden"
                            id={`file-upload-${vehicle.id}`}
                            onChange={(e) => handleFileChange(vehicle.id, e)}
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            asChild
                          >
                            <label htmlFor={`file-upload-${vehicle.id}`} className="cursor-pointer">
                              <Upload className="h-3.5 w-3.5" />
                            </label>
                          </Button>
                        </div>
                        {vehicle.documentKey && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDownloadDoc(vehicle)}
                          >
                            <Download className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => deleteMutation.mutate(vehicle.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl bg-card text-foreground overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{tVehicles('create-btn')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleSaveSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold border-b border-border pb-1">Specification</h3>
                <div className="space-y-2">
                  <Label htmlFor="spec-manufacturer">Manufacturer</Label>
                  <Input id="spec-manufacturer" {...register('specification.manufacturer')} />
                  {errors.specification?.manufacturer && <p className="text-xs text-destructive">{errors.specification.manufacturer.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="spec-model">Model</Label>
                  <Input id="spec-model" {...register('specification.model')} />
                  {errors.specification?.model && <p className="text-xs text-destructive">{errors.specification.model.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="spec-version">Version</Label>
                  <Input id="spec-version" {...register('specification.version')} />
                  {errors.specification?.version && <p className="text-xs text-destructive">{errors.specification.version.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="spec-yearMfg">Year Mfg</Label>
                    <Input id="spec-yearMfg" {...register('specification.yearManufacture')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="spec-yearModel">Year Model</Label>
                    <Input id="spec-yearModel" {...register('specification.yearModel')} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="spec-color">Color</Label>
                    <Input id="spec-color" {...register('specification.color')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="spec-fuel">Fuel Type</Label>
                    <Input id="spec-fuel" {...register('specification.fuelType')} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold border-b border-border pb-1">Identification & Ops</h3>
                <div className="space-y-2">
                  <Label htmlFor="id-plate">Plate</Label>
                  <Input id="id-plate" placeholder="ABC1D23" {...register('identification.plate')} />
                  {errors.identification?.plate && <p className="text-xs text-destructive">{errors.identification.plate.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="id-renavam">Renavam</Label>
                  <Input id="id-renavam" {...register('identification.renavam')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="id-vin">VIN</Label>
                  <Input id="id-vin" {...register('identification.vin')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="id-serial">Serial Number</Label>
                  <Input id="id-serial" {...register('identification.serialNumber')} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="id-type">Vehicle Type</Label>
                    <select
                      id="id-type"
                      className="flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      {...register('identification.vehicleType')}
                    >
                      <option value="car">Car</option>
                      <option value="motorcycle">Motorcycle</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="op-status">Status</Label>
                    <select
                      id="op-status"
                      className="flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      {...register('operational.status')}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold border-b border-border pb-1">Acquisition Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="acq-type">Acquisition Type</Label>
                  <select
                    id="acq-type"
                    className="flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    {...register('acquisition.acquisitionsType')}
                  >
                    <option value="purchase">Purchase</option>
                    <option value="lease">Lease</option>
                    <option value="rental">Rental</option>
                    <option value="transfer">Transfer</option>
                    <option value="donation">Donation</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="acq-date">Acquisition Date</Label>
                  <Input id="acq-date" type="date" {...register('acquisition.acquisitionDate')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="acq-value">Value ($)</Label>
                  <Input id="acq-value" type="number" {...register('acquisition.acquisitionValue')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="acq-invoice">Invoice Number</Label>
                  <Input id="acq-invoice" type="number" {...register('acquisition.invoiceNumber')} />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                {tCommon('cancel')}
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {tCommon('save')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isOperationalOpen} onOpenChange={setIsOperationalOpen}>
        <DialogContent className="bg-card text-foreground">
          <DialogHeader>
            <DialogTitle>{tVehicles('edit-operational')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleOpSubmit(handleOperationalSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="op-odometerNow">Current Odometer (km)</Label>
              <Input id="op-odometerNow" type="number" {...regOp('odometerNow')} />
              {opErrors.odometerNow && <p className="text-xs text-destructive">{opErrors.odometerNow.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="op-status-edit">Status</Label>
              <select
                id="op-status-edit"
                className="flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                {...regOp('status')}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Maintenance</option>
                <option value="sold">Sold</option>
                <option value="stolen">Stolen</option>
                <option value="scrapped">Scrapped</option>
                <option value="other">Other</option>
              </select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOperationalOpen(false)}>
                {tCommon('cancel')}
              </Button>
              <Button type="submit">
                {tCommon('save')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-lg bg-card text-foreground">
          <DialogHeader>
            <DialogTitle>Vehicle Details</DialogTitle>
          </DialogHeader>
          {selectedVehicle && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold border-b border-border pb-1 mb-2">Specification</h4>
                  <p><span className="text-muted-foreground">Manufacturer:</span> {selectedVehicle.specification.manufacturer}</p>
                  <p><span className="text-muted-foreground">Model:</span> {selectedVehicle.specification.model}</p>
                  <p><span className="text-muted-foreground">Version:</span> {selectedVehicle.specification.version}</p>
                  <p><span className="text-muted-foreground">Color:</span> {selectedVehicle.specification.color}</p>
                  <p><span className="text-muted-foreground">Fuel Type:</span> {selectedVehicle.specification.fuelType}</p>
                  <p><span className="text-muted-foreground">Year:</span> {selectedVehicle.specification.yearManufacture} / {selectedVehicle.specification.yearModel}</p>
                </div>
                <div>
                  <h4 className="font-semibold border-b border-border pb-1 mb-2">Identification</h4>
                  <p><span className="text-muted-foreground">Plate:</span> <span className="font-mono">{selectedVehicle.identification.plate}</span></p>
                  <p><span className="text-muted-foreground">Renavam:</span> {selectedVehicle.identification.renavam}</p>
                  <p><span className="text-muted-foreground">VIN:</span> {selectedVehicle.identification.vin}</p>
                  <p><span className="text-muted-foreground">Serial:</span> {selectedVehicle.identification.serialNumber}</p>
                  <p><span className="text-muted-foreground">Type:</span> {selectedVehicle.identification.vehicleType}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold border-b border-border pb-1 mb-2">Operational</h4>
                  <p><span className="text-muted-foreground">Status:</span> {selectedVehicle.operational.status}</p>
                  <p><span className="text-muted-foreground">Odometer Start:</span> {selectedVehicle.operational.odometerStartedAt} km</p>
                  <p><span className="text-muted-foreground">Odometer Current:</span> {selectedVehicle.operational.odometerNow} km</p>
                </div>
                <div>
                  <h4 className="font-semibold border-b border-border pb-1 mb-2">Acquisition</h4>
                  <p><span className="text-muted-foreground">Type:</span> {selectedVehicle.acquisition.acquisitionsType}</p>
                  <p><span className="text-muted-foreground">Date:</span> {new Date(selectedVehicle.acquisition.acquisitionDate).toLocaleDateString()}</p>
                  <p><span className="text-muted-foreground">Value:</span> ${selectedVehicle.acquisition.acquisitionValue}</p>
                  <p><span className="text-muted-foreground">Invoice:</span> {selectedVehicle.acquisition.invoiceNumber}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsDetailOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
