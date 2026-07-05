'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';

import findProfileService from '@src/domain/user/applications/find-profile.service';
import updateProfileService from '@src/domain/user/applications/update-profile.service';

import { Button } from '@src/components/@shared/components/ui/button';
import { Input } from '@src/components/@shared/components/ui/input';
import { Label } from '@src/components/@shared/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@src/components/@shared/components/ui/card';
import { toast } from '@src/components/@shared/components/ui/use-toast';
import { userProfileSchema, TUserProfileSchema } from '@src/domain/user/schemas/user-profile.schema';
import MainLayout from '@src/components/@shared/components/main-layout';

export default function ProfileMainPagePresentation() {
  const tCommon = useTranslations('Common');
  const tProfile = useTranslations('Profile');
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: () => findProfileService.execute()
  });

  const updateMutation = useMutation({
    mutationFn: (data: TUserProfileSchema) => updateProfileService.execute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      toast({ title: tProfile('save-success') });
    }
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TUserProfileSchema>({
    resolver: zodResolver(userProfileSchema)
  });

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name,
        email: profile.email
      });
    }
  }, [profile, reset]);

  const onSubmit = (data: TUserProfileSchema) => {
    const submitData = { ...data };
    if (!submitData.password) {
      delete submitData.password;
    }
    updateMutation.mutate(submitData);
  };

  const BREADCRUMB_ITEMS = [{ label: 'My Profile' }];

  return (
    <MainLayout breadcrumbItems={BREADCRUMB_ITEMS}>
      <div className="space-y-6 max-w-lg mx-auto pt-6">
        <div>
          <h1 className="text-3xl leading-none font-bold tracking-tight text-foreground">
            {tProfile('title')}
          </h1>
          <p className="text-sm text-muted-foreground">
            {tProfile('subtitle')}
          </p>
        </div>

        {isLoading ? (
          <div className="text-center text-muted-foreground">{tCommon('loading')}</div>
        ) : (
          <Card className="border border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Update your personal details below.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
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
                  <Label htmlFor="password">New Password (leave blank to keep unchanged)</Label>
                  <Input id="password" type="password" {...register('password')} />
                  {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
                </div>
              </CardContent>
              <CardFooter className="border-t border-border pt-4 flex justify-end">
                <Button type="submit" disabled={updateMutation.isPending}>
                  {tCommon('save')}
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
