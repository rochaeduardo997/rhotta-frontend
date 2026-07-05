'use client';

import { SidebarInset, SidebarProvider } from '@src/components/@shared/components/ui/sidebar';
import Sidebar from '@src/components/@shared/components/sidebar';

type TProps = Readonly<{ children: React.ReactNode }>;

export default function AuthenticatedLayout({ children }: TProps) {
  return (
    <SidebarProvider>
      <Sidebar className="border-none py-3 pl-3" />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
