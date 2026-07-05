'use client';

import { useEffect, useState, type ComponentProps } from 'react';
import { Building2, LayoutDashboard, Users, User, Car } from 'lucide-react';
import { Sidebar as SidebarUI, SidebarContent, SidebarFooter, SidebarHeader } from '@src/components/@shared/components/ui/sidebar';
import { Skeleton } from '@src/components/@shared/components/ui/skeleton';
import useAuth from '@src/@shared/hooks/auth/use-auth.hook';
import NavLogo from './nav-logo';
import NavMain from './nav-main';
import NavUser from './nav-user';
import { useTranslations } from 'next-intl';

export default function Sidebar({ ...props }: ComponentProps<typeof SidebarUI>) {
  const { user } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  const t = useTranslations('Sidebar');

  const items = [
    {
      title: t('dashboard'),
      url: `/companies`,
      icon: LayoutDashboard
    },
    {
      title: t('companies'),
      url: `/companies/list`,
      icon: Building2
    },
    {
      title: t('vehicles'),
      url: `/vehicles`,
      icon: Car
    },
    ...(user?.role === 'admin'
      ? [
          {
            title: t('users'),
            url: `/users`,
            icon: Users
          }
        ]
      : []),
    {
      title: t('profile'),
      url: `/profile`,
      icon: User
    }
  ];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <SidebarUI collapsible="icon" {...props}>
      <div className="flex h-full w-full flex-col bg-sidebar dark:bg-card">
        <SidebarHeader className="border-b border-border bg-transparent p-0">
          <NavLogo />
        </SidebarHeader>
        <SidebarContent className="bg-transparent p-0">
          {isMounted ? (
            <NavMain items={items} />
          ) : (
            <div className="p-2">
              <Skeleton className="h-72 w-full" />
            </div>
          )}
        </SidebarContent>
        <SidebarFooter className="bg-transparent p-0 py-4">
          {isMounted && user && <NavUser user={user} />}
        </SidebarFooter>
      </div>
    </SidebarUI>
  );
}
