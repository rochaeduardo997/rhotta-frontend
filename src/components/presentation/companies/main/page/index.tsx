'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Edit, Trash2, Users, MapPin, Building2, Car, Shield } from 'lucide-react';

import findAllCompaniesService from '@src/domain/company/applications/find-all-companies.service';
import createCompanyService from '@src/domain/company/applications/create-company.service';
import updateCompanyService from '@src/domain/company/applications/update-company.service';
import deleteCompanyService from '@src/domain/company/applications/delete-company.service';
import findAllCompanyUsersService from '@src/domain/company/applications/find-all-company-users.service';
import associateCompanyUserService from '@src/domain/company/applications/associate-company-user.service';
import disassociateCompanyUserService from '@src/domain/company/applications/disassociate-company-user.service';
import updateCompanyUserPermissionService from '@src/domain/company/applications/update-company-user-permission.service';
import adminFindAllUsersService from '@src/domain/user/applications/admin-find-all-users.service';
import findAllVehiclesService from '@src/domain/vehicle/applications/find-all-vehicles.service';

import { Button } from '@src/components/@shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@src/components/@shared/components/ui/card';
import { Input } from '@src/components/@shared/components/ui/input';
import { Label } from '@src/components/@shared/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@src/components/@shared/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@src/components/@shared/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@src/components/@shared/components/ui/table';
import { toast } from '@src/components/@shared/components/ui/use-toast';
import { companySaveSchema, TCompanySaveSchema } from '@src/domain/company/schemas/company-save.schema';
import { associateUserSchema, TAssociateUserSchema } from '@src/domain/company/schemas/associate-user.schema';
import MainLayout from '@src/components/@shared/components/main-layout';
import useAuth from '@src/@shared/hooks/auth/use-auth.hook';

export default function CompaniesMainPagePresentation() {
  const tCommon = useTranslations('Common');
  const tCompanies = useTranslations('Companies');
  const tDashboard = useTranslations('Dashboard');
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<any | null>(null);
  const [viewingUsersCompany, setViewingUsersCompany] = useState<any | null>(null);
  const [isAssociateOpen, setIsAssociateOpen] = useState(false);

  const { data: companiesResponse, isLoading: isCompaniesLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: () => findAllCompaniesService.execute()
  });
  const companies = companiesResponse?.items || [];

  const { data: vehiclesResponse } = useQuery({
    queryKey: ['vehicles'],
    queryFn: () => findAllVehiclesService.execute(),
    enabled: currentUser?.role === 'admin'
  });
  const vehicles = vehiclesResponse?.items || [];

  const { data: allUsersResponse } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => adminFindAllUsersService.execute(),
    enabled: currentUser?.role === 'admin'
  });
  const allUsers = allUsersResponse?.items || [];

  const { data: companyUsersResponse, refetch: refetchCompanyUsers } = useQuery({
    queryKey: ['company-users', viewingUsersCompany?.id],
    queryFn: () => findAllCompanyUsersService.execute(viewingUsersCompany.id),
    enabled: !!viewingUsersCompany
  });
  const companyUsers = [
    ...(companyUsersResponse?.owners || []).map((o: any) => ({
      userId: o.id,
      role: 'owner',
      permission: 'read-write',
      user: o
    })),
    ...(companyUsersResponse?.employees || []).map((e: any) => ({
      userId: e.id,
      role: 'employee',
      permission: e.permission || 'read-only',
      user: e
    }))
  ];

  const saveMutation = useMutation({
    mutationFn: (data: { name: string; cnpj: number }) => {
      if (editingCompany) {
        return updateCompanyService.execute(editingCompany.id, data);
      }
      return createCompanyService.execute(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      setIsCreateOpen(false);
      setEditingCompany(null);
      toast({ title: tCompanies('save-success') });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCompanyService.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast({ title: tCompanies('delete-success') });
    }
  });

  const associateMutation = useMutation({
    mutationFn: (data: TAssociateUserSchema) => associateCompanyUserService.execute(viewingUsersCompany.id, data),
    onSuccess: () => {
      refetchCompanyUsers();
      setIsAssociateOpen(false);
      toast({ title: tCompanies('associate-success') });
    }
  });

  const disassociateMutation = useMutation({
    mutationFn: (userId: string) => disassociateCompanyUserService.execute(viewingUsersCompany.id, userId),
    onSuccess: () => {
      refetchCompanyUsers();
      toast({ title: tCompanies('disassociate-success') });
    }
  });

  const updatePermissionMutation = useMutation({
    mutationFn: ({ userId, role, permission }: { userId: string; role: 'owner' | 'employee'; permission: 'read-only' | 'read-write' }) =>
      updateCompanyUserPermissionService.execute(viewingUsersCompany.id, userId, { role, permission }),
    onSuccess: () => {
      refetchCompanyUsers();
    }
  });

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<TCompanySaveSchema>({
    resolver: zodResolver(companySaveSchema)
  });

  const { register: regAssociate, handleSubmit: handleAssociateSubmit, reset: resetAssociate, formState: { errors: assocErrors } } = useForm<TAssociateUserSchema>({
    resolver: zodResolver(associateUserSchema)
  });

  const handleOpenCreate = () => {
    reset();
    setEditingCompany(null);
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (company: any) => {
    setEditingCompany(company);
    setValue('name', company.name);
    setValue('cnpj', String(company.cnpj));
    setIsCreateOpen(true);
  };

  const handleSaveSubmit = (data: TCompanySaveSchema) => {
    const cnpjNumber = parseInt(data.cnpj.replace(/\D/g, ''), 10);
    saveMutation.mutate({
      name: data.name,
      cnpj: cnpjNumber
    } as any);
  };

  const handleAssociate = (data: TAssociateUserSchema) => {
    associateMutation.mutate(data);
  };

  const BREADCRUMB_ITEMS = [{ label: tCompanies('title') }];

  return (
    <MainLayout breadcrumbItems={BREADCRUMB_ITEMS}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl leading-none font-bold tracking-tight text-foreground">{tCompanies('title')}</h1>
          <p className="text-sm text-muted-foreground">{tCompanies('subtitle')}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border border-border bg-card shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{tDashboard('companies')}</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{companies.length}</div>
            </CardContent>
          </Card>
          <Card className="border border-border bg-card shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{tDashboard('vehicles')}</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vehicles.length}</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-foreground">{tCompanies('title')}</h2>
          <Button onClick={handleOpenCreate} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {tCompanies('create-btn')}
          </Button>
        </div>

        <div className="rounded-md border border-border bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{tCommon('name')}</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead className="text-right">{tCommon('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isCompaniesLoading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-6">{tCommon('loading')}</TableCell>
                </TableRow>
              ) : companies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-6">{tCommon('no-data')}</TableCell>
                </TableRow>
              ) : (
                companies.map((company: any) => (
                  <TableRow key={company.id}>
                    <TableCell className="font-medium text-foreground">{company.name}</TableCell>
                    <TableCell className="text-muted-foreground">{company.cnpj}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.location.href = `/companies/${company.id}/branches`}
                          className="flex items-center gap-1"
                        >
                          <MapPin className="h-3.5 w-3.5" />
                          {tCompanies('branches-btn')}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setViewingUsersCompany(company);
                          }}
                          className="flex items-center gap-1"
                        >
                          <Users className="h-3.5 w-3.5" />
                          {tCompanies('users-btn')}
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleOpenEdit(company)}
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => deleteMutation.mutate(company.id)}
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
            <DialogTitle>{editingCompany ? tCompanies('edit-title') : tCompanies('create-btn')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleSaveSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{tCompanies('name-label')}</Label>
              <Input id="name" {...register('name')} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cnpj">{tCompanies('cnpj-label')}</Label>
              <Input id="cnpj" {...register('cnpj')} />
              {errors.cnpj && <p className="text-xs text-destructive">{errors.cnpj.message}</p>}
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

      <Sheet open={!!viewingUsersCompany} onOpenChange={(open) => !open && setViewingUsersCompany(null)}>
        <SheetContent className="bg-card text-foreground w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{tCompanies('users-title')}</SheetTitle>
            <SheetDescription>
              {viewingUsersCompany?.name}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold">{tCompanies('users-title')}</h3>
              <Button size="sm" onClick={() => { resetAssociate(); setIsAssociateOpen(true); }} className="flex items-center gap-1">
                <Plus className="h-3.5 w-3.5" />
                {tCompanies('associate-btn')}
              </Button>
            </div>

            <div className="space-y-3">
              {companyUsers.map((cu: any) => (
                <div key={cu.id} className="flex justify-between items-center p-3 rounded-lg border border-border bg-muted/20">
                  <div>
                    <p className="text-sm font-medium text-foreground">{cu.user?.name || cu.userId}</p>
                    <p className="text-xs text-muted-foreground">{cu.user?.email}</p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono">
                        {cu.role}
                      </span>
                      <span className="text-[10px] bg-accent/30 text-accent-foreground px-1.5 py-0.5 rounded font-mono">
                        {cu.permission}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => {
                        const newPermission = cu.permission === 'read-only' ? 'read-write' : 'read-only';
                        updatePermissionMutation.mutate({ userId: cu.userId, role: cu.role, permission: newPermission });
                      }}
                    >
                      <Shield className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:bg-destructive/10"
                      onClick={() => disassociateMutation.mutate(cu.userId)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={isAssociateOpen} onOpenChange={setIsAssociateOpen}>
        <DialogContent className="bg-card text-foreground">
          <DialogHeader>
            <DialogTitle>{tCompanies('associate-btn')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAssociateSubmit(handleAssociate)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userId">User</Label>
              <select
                id="userId"
                className="flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                {...regAssociate('userId')}
              >
                <option value="">Select User</option>
                {allUsers.map((u: any) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
              {assocErrors.userId && <p className="text-xs text-destructive">{assocErrors.userId.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                className="flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                {...regAssociate('role')}
              >
                <option value="employee">Employee</option>
                <option value="owner">Owner</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="permission">Permission</Label>
              <select
                id="permission"
                className="flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                {...regAssociate('permission')}
              >
                <option value="read-only">Read Only</option>
                <option value="read-write">Read Write</option>
              </select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAssociateOpen(false)}>
                {tCommon('cancel')}
              </Button>
              <Button type="submit">
                {tCompanies('associate-btn')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
