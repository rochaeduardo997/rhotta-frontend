'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Edit, Trash2 } from 'lucide-react';

import adminFindAllUsersService from '@src/domain/user/applications/admin-find-all-users.service';
import adminCreateUserService from '@src/domain/user/applications/admin-create-user.service';
import adminUpdateUserService from '@src/domain/user/applications/admin-update-user.service';
import adminDeleteUserService from '@src/domain/user/applications/admin-delete-user.service';

import { Button } from '@src/components/@shared/components/ui/button';
import { Input } from '@src/components/@shared/components/ui/input';
import { Label } from '@src/components/@shared/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@src/components/@shared/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@src/components/@shared/components/ui/table';
import { toast } from '@src/components/@shared/components/ui/use-toast';
import { userSaveSchema, TUserSaveSchema } from '@src/domain/user/schemas/user-save.schema';
import MainLayout from '@src/components/@shared/components/main-layout';
import { ERole } from '@src/domain/user/entities/role.type';

export default function UsersMainPagePresentation() {
  const tCommon = useTranslations('Common');
  const tUsers = useTranslations('Users');
  const queryClient = useQueryClient();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);

  const { data: usersResponse, isLoading: isUsersLoading } = useQuery({
    queryKey: ['admin-users-list'],
    queryFn: () => adminFindAllUsersService.execute()
  });
  const users = usersResponse?.items || [];

  const saveMutation = useMutation({
    mutationFn: (data: TUserSaveSchema) => {
      if (editingUser) {
        return adminUpdateUserService.execute(editingUser.id, data);
      }
      return adminCreateUserService.execute(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users-list'] });
      setIsCreateOpen(false);
      setEditingUser(null);
      toast({ title: tUsers('save-success') });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminDeleteUserService.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users-list'] });
      toast({ title: tUsers('delete-success') });
    }
  });

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<TUserSaveSchema>({
    resolver: zodResolver(userSaveSchema)
  });

  const handleOpenCreate = () => {
    reset({
      name: '',
      email: '',
      password: '',
      role: ERole.BASIC
    });
    setEditingUser(null);
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (user: any) => {
    setEditingUser(user);
    setValue('name', user.name);
    setValue('email', user.email);
    setValue('password', '');
    setValue('role', user.role);
    setIsCreateOpen(true);
  };

  const handleSaveSubmit = (data: TUserSaveSchema) => {
    saveMutation.mutate(data);
  };

  const BREADCRUMB_ITEMS = [{ label: 'Users Management' }];

  return (
    <MainLayout breadcrumbItems={BREADCRUMB_ITEMS}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl leading-none font-bold tracking-tight text-foreground">
              {tUsers('title')}
            </h1>
            <p className="text-sm text-muted-foreground">
              {tUsers('subtitle')}
            </p>
          </div>
          <Button onClick={handleOpenCreate} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {tUsers('create-btn')}
          </Button>
        </div>

        <div className="rounded-md border border-border bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{tCommon('name')}</TableHead>
                <TableHead>{tCommon('email')}</TableHead>
                <TableHead>{tCommon('role')}</TableHead>
                <TableHead className="text-right">{tCommon('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isUsersLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6">{tCommon('loading')}</TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6">{tCommon('no-data')}</TableCell>
                </TableRow>
              ) : (
                users.map((user: any) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium text-foreground">{user.name}</TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset bg-primary/10 text-primary">
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleOpenEdit(user)}
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => deleteMutation.mutate(user.id)}
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
            <DialogTitle>{editingUser ? tUsers('edit-title') : tUsers('create-btn')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleSaveSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{tCommon('name')}</Label>
              <Input id="name" {...register('name')} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{tCommon('email')}</Label>
              <Input id="email" type="email" {...register('email')} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password {editingUser && '(leave blank to keep unchanged)'}</Label>
              <Input id="password" type="password" {...register('password')} />
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">{tCommon('role')}</Label>
              <select
                id="role"
                className="flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                {...register('role')}
              >
                <option value={ERole.BASIC}>Basic</option>
                <option value={ERole.ADMIN}>Admin</option>
                <option value={ERole.SUPERVISOR}>Supervisor</option>
                <option value={ERole.API}>API</option>
              </select>
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
