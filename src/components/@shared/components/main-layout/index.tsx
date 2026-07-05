'use client';

import { Suspense, type ReactNode } from 'react';
import { SidebarTrigger } from '@src/components/@shared/components/ui/sidebar';
import { Separator } from '@src/components/@shared/components/ui/separator';
import Footer from './footer';
import Breadcrumb, { TItem } from '../breadcrumb';
import ThemeToggle from './theme-toggle';

type TProps = {
  children: ReactNode;
  breadcrumbItems?: TItem[];
};

export default function MainLayout({ children, breadcrumbItems }: TProps) {
  return (
    <div className="h-screen space-y-4 p-5">
      <div className="flex h-full flex-col justify-between">
        <div>
          <header className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              {breadcrumbItems && (
                <>
                  <Separator orientation="vertical" className="mr-2 h-4" />
                  <Breadcrumb items={breadcrumbItems} />
                </>
              )}
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
            </div>
          </header>
          <main
            id="scrollable-main"
            className="grid h-[calc(100vh-120px)] overflow-y-auto rounded-xl border border-border bg-card p-5 text-foreground shadow-sm"
          >
            {children}
          </main>
        </div>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </div>
    </div>
  );
}
