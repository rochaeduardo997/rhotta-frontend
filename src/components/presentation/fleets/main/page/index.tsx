'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Edit, Trash2, Car } from 'lucide-react';

import findBranchByIdService from '@src/domain/branch/applications/find-branch-by-id.service';
import findAllFleetsService from '@src/domain/fleet/applications/find-all-fleets.service';
import createFleetService from '@src/domain/fleet/applications/create-fleet.service';
import updateFleetService from '@src/domain/fleet/applications/update-fleet.service';
import deleteFleetService from '@src/domain/fleet/applications/delete-fleet.service';

import { Button } from '@src/components/@shared/components/ui/button';
import { Input } from '@src/components/@shared/components/ui/input';
import { Label } from '@src/components/@shared/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@src/components/@shared/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@src/components/@shared/components/ui/table';
import { toast } from '@src/components/@shared/components/ui/use-toast';
import { fleetSaveSchema, TFleetSaveSchema } from '@src/domain/fleet/schemas/fleet-save.schema';
import MainLayout from '@src/components/@shared/components/main-layout';

export default function FleetsMainPagePresentation() {
  const params = useParams();
  const branchId = params.branchId as string;

  const tCommon = useTranslations('Common');
  const tFleets = useTranslations('Fleets');
  const queryClient = useQueryClient();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingFleet, setEditingFleet] = useState<any | null>(null);

  const { data: branch } = useQuery({
    queryKey: ['branch', branchId],
    queryFn: () => findBranchByIdService.execute(branchId),
    enabled: !!branchId
  });

  const { data: fleetsResponse, isLoading: isFleetsLoading } = useQuery({
    queryKey: ['fleets', branchId],
    queryFn: () => findAllFleetsService.execute(branchId),
    enabled: !!branchId
  });
  const fleets = fleetsResponse?.items || [];

  const saveMutation = useMutation({
    mutationFn: (data: TFleetSaveSchema) => {
      if (editingFleet) {
        return updateFleetService.execute(editingFleet.id, data);
      }
      return createFleetService.execute(branchId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fleets', branchId] });
      setIsCreateOpen(false);
      setEditingFleet(null);
      toast({ title: tFleets('save-success') });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteFleetService.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fleets', branchId] });
      toast({ title: tFleets('delete-success') });
    }
  });

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<TFleetSaveSchema>({
    resolver: zodResolver(fleetSaveSchema)
  });

  const handleOpenCreate = () => {
    reset();
    setEditingFleet(null);
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (fleet: any) => {
    setEditingFleet(fleet);
    setValue('name', fleet.name);
    setValue('description', fleet.description || '');
    setIsCreateOpen(true);
  };

  const handleSaveSubmit = (data: TFleetSaveSchema) => {
    saveMutation.mutate(data);
  };

  const BREADCRUMB_ITEMS = [
    { label: 'Companies', href: '/companies' },
    { label: branch?.name || 'Branch', href: '#' },
    { label: 'Fleets' }
  ];

  return (
    <MainLayout breadcrumbItems={BREADCRUMB_ITEMS}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl leading-none font-bold tracking-tight text-foreground">
              {tFleets('title')}
            </h1>
            <p className="text-sm text-muted-foreground">
              {tFleets('subtitle', { branchName: branch?.name || '...' })}
            </p>
          </div>
          <Button onClick={handleOpenCreate} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {tFleets('create-btn')}
          </Button>
        </div>

        <div className="rounded-md border border-border bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{tCommon('name')}</TableHead>
                <TableHead>{tCommon('description')}</TableHead>
                <TableHead className="text-right">{tCommon('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isFleetsLoading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-6">{tCommon('loading')}</TableCell>
                </TableRow>
              ) : fleets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-6">{tCommon('no-data')}</TableCell>
                </TableRow>
              ) : (
                fleets.map((fleet: any) => (
                  <TableRow key={fleet.id}>
                    <TableCell className="font-medium text-foreground">{fleet.name}</TableCell>
                    <TableCell className="text-muted-foreground">{fleet.description || '-'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.location.href = `/vehicles?fleetId=${fleet.id}`}
                          className="flex items-center gap-1"
                        >
                          <Car className="h-3.5 w-3.5" />
                          {tFleets('vehicles-btn')}
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleOpenEdit(fleet)}
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => deleteMutation.mutate(fleet.id)}
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
        <DialogContent className="bg-card text-foreground">
          <DialogHeader>
            <DialogTitle>{editingFleet ? tFleets('edit-title') : tFleets('create-btn')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleSaveSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{tFleets('name-label')}</Label>
              <Input id="name" {...register('name')} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">{tFleets('desc-label')}</Label>
              <Input id="description" {...register('description')} />
              {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                {tCommon('cancel')}
              </Button>
              <Button type="submit" disabled={saveMutation.isPending}>
                {tCommon('save')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
