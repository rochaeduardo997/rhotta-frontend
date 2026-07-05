'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, TSignupSchema } from '@src/domain/auth/schemas/signup.schema';
import useAuth from '@src/@shared/hooks/auth/use-auth.hook';
import { Button } from '@src/components/@shared/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@src/components/@shared/components/ui/card';
import { Input } from '@src/components/@shared/components/ui/input';
import { Label } from '@src/components/@shared/components/ui/label';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { Car } from 'lucide-react';

export default function SignupPagePresentation() {
  const { signup } = useAuth();
  const t = useTranslations('Auth');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<TSignupSchema>({
    resolver: zodResolver(signupSchema)
  });

  const onSubmit = (data: TSignupSchema) => {
    setError(null);
    startTransition(async () => {
      try {
        await signup(data);
      } catch (err: any) {
        setError(err?.response?.data?.message || t('error-signup'));
      }
    });
  };

  return (
    <Card className="border border-border shadow-md">
      <CardHeader className="space-y-1 flex flex-col items-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground mb-2">
          <Car className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight text-center">{t('signup-title')}</CardTitle>
        <CardDescription className="text-center">{t('signup-subtitle')}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive font-medium">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="name">{t('name')}</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t('email')}</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@company.com"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t('password')}</Label>
            <Input
              id="password"
              type="password"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">{t('company')}</Label>
            <Input
              id="company"
              type="text"
              placeholder="Tech Corp"
              {...register('company')}
            />
            {errors.company && (
              <p className="text-xs text-destructive">{errors.company.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? '...' : t('signup-btn')}
          </Button>
          <Link
            href="/auth/login"
            className="text-sm text-muted-foreground hover:text-primary transition-colors text-center w-full"
          >
            {t('go-to-login')}
          </Link>
        </CardFooter>
      </form>
    </Card>
  );
}
