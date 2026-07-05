'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Edit, Trash2, MapPin } from 'lucide-react';

import findCompanyByIdService from '@src/domain/company/applications/find-company-by-id.service';
import findAllBranchesService from '@src/domain/branch/applications/find-all-branches.service';
import createBranchService from '@src/domain/branch/applications/create-branch.service';
import updateBranchService from '@src/domain/branch/applications/update-branch.service';
import deleteBranchService from '@src/domain/branch/applications/delete-branch.service';

import { Button } from '@src/components/@shared/components/ui/button';
import { Input } from '@src/components/@shared/components/ui/input';
import { Label } from '@src/components/@shared/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@src/components/@shared/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@src/components/@shared/components/ui/table';
import { toast } from '@src/components/@shared/components/ui/use-toast';
import { branchSaveSchema, TBranchSaveSchema } from '@src/domain/branch/schemas/branch-save.schema';
import MainLayout from '@src/components/@shared/components/main-layout';

export default function BranchesMainPagePresentation() {
  const params = useParams();
  const companyId = params.companyId as string;

  const tCommon = useTranslations('Common');
  const tBranches = useTranslations('Branches');
  const queryClient = useQueryClient();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<any | null>(null);

  const { data: company } = useQuery({
    queryKey: ['company', companyId],
    queryFn: () => findCompanyByIdService.execute(companyId),
    enabled: !!companyId
  });

  const { data: branchesResponse, isLoading: isBranchesLoading } = useQuery({
    queryKey: ['branches', companyId],
    queryFn: () => findAllBranchesService.execute(companyId),
    enabled: !!companyId
  });
  const branches = branchesResponse?.items || [];

  const saveMutation = useMutation({
    mutationFn: (data: TBranchSaveSchema) => {
      if (editingBranch) {
        return updateBranchService.execute(editingBranch.id, data);
      }
      return createBranchService.execute(companyId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches', companyId] });
      setIsCreateOpen(false);
      setEditingBranch(null);
      toast({ title: tBranches('save-success') });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBranchService.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches', companyId] });
      toast({ title: tBranches('delete-success') });
    }
  });

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<TBranchSaveSchema>({
    resolver: zodResolver(branchSaveSchema)
  });

  const handleOpenCreate = () => {
    reset();
    setEditingBranch(null);
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (branch: any) => {
    setEditingBranch(branch);
    setValue('name', branch.name);
    setValue('description', branch.description || '');
    setIsCreateOpen(true);
  };

  const handleSaveSubmit = (data: TBranchSaveSchema) => {
    saveMutation.mutate(data);
  };

  const BREADCRUMB_ITEMS = [
    { label: 'Companies', href: '/companies' },
    { label: company?.name || 'Company', href: '/companies' },
    { label: 'Branches' }
  ];

  return (
    <MainLayout breadcrumbItems={BREADCRUMB_ITEMS}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl leading-none font-bold tracking-tight text-foreground">
              {tBranches('title')}
            </h1>
            <p className="text-sm text-muted-foreground">
              {tBranches('subtitle', { companyName: company?.name || '...' })}
            </p>
          </div>
          <Button onClick={handleOpenCreate} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {tBranches('create-btn')}
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
              {isBranchesLoading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-6">{tCommon('loading')}</TableCell>
                </TableRow>
              ) : branches.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-6">{tCommon('no-data')}</TableCell>
                </TableRow>
              ) : (
                branches.map((branch: any) => (
                  <TableRow key={branch.id}>
                    <TableCell className="font-medium text-foreground">{branch.name}</TableCell>
                    <TableCell className="text-muted-foreground">{branch.description || '-'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.location.href = `/branches/${branch.id}/fleets`}
                          className="flex items-center gap-1"
                        >
                          <MapPin className="h-3.5 w-3.5" />
                          {tBranches('fleets-btn')}
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleOpenEdit(branch)}
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => deleteMutation.mutate(branch.id)}
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
            <DialogTitle>{editingBranch ? tBranches('edit-title') : tBranches('create-btn')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleSaveSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{tBranches('name-label')}</Label>
              <Input id="name" {...register('name')} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">{tBranches('desc-label')}</Label>
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
