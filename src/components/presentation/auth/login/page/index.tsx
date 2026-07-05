'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, TLoginSchema } from '@src/domain/auth/schemas/login.schema';
import useAuth from '@src/@shared/hooks/auth/use-auth.hook';
import { Button } from '@src/components/@shared/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@src/components/@shared/components/ui/card';
import { Input } from '@src/components/@shared/components/ui/input';
import { Label } from '@src/components/@shared/components/ui/label';
import { Checkbox } from '@src/components/@shared/components/ui/checkbox';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { Car } from 'lucide-react';

export default function LoginPagePresentation() {
  const { login } = useAuth();
  const t = useTranslations('Auth');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = (data: TLoginSchema) => {
    setError(null);
    startTransition(async () => {
      try {
        await login(data);
      } catch (err: any) {
        setError(err?.response?.data?.message || t('invalid-credentials'));
      }
    });
  };

  return (
    <Card className="border border-border shadow-md">
      <CardHeader className="space-y-1 flex flex-col items-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground mb-2">
          <Car className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight text-center">{t('login-title')}</CardTitle>
        <CardDescription className="text-center">{t('login-subtitle')}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive font-medium">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="login">{t('email')}</Label>
            <Input
              id="login"
              type="email"
              placeholder="name@company.com"
              {...register('login')}
            />
            {errors.login && (
              <p className="text-xs text-destructive">{errors.login.message}</p>
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
          <div className="flex items-center space-x-2">
            <Checkbox
              id="rememberMe"
              onCheckedChange={(checked) => setValue('rememberMe', !!checked)}
            />
            <Label htmlFor="rememberMe" className="text-sm font-medium cursor-pointer">
              {t('remember-me')}
            </Label>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? '...' : t('login-btn')}
          </Button>
          <Link
            href="/auth/signup"
            className="text-sm text-muted-foreground hover:text-primary transition-colors text-center w-full"
          >
            {t('go-to-signup')}
          </Link>
        </CardFooter>
      </form>
    </Card>
  );
}
