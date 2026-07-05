import type { ReactNode } from 'react';
import { cn } from '@src/lib/utils';

type TProps = {
  title?: string;
  className?: string;
  headerButton?: ReactNode;
  children: ReactNode;
};

export default function MainCardLayout({ title, className, headerButton, children, ...props }: TProps) {
  return (
    <div className={cn('space-y-4 rounded-lg bg-white dark:bg-card p-6 shadow', className)} {...props}>
      <header className="flex flex-wrap items-center justify-between gap-4">
        {title && <h3 className="text-base font-medium">{title}</h3>}
        {headerButton}
      </header>
      {children}
    </div>
  );
}
