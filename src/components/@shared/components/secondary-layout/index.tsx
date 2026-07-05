import type { ReactNode } from 'react';
import { cn } from '@src/lib/utils';

type TProps = { className?: string; children: ReactNode };

export default function SecondaryLayout({ className, ...props }: TProps) {
  return <div className={cn('text-primary-dark bg-gray-light rounded-lg p-3', className)} {...props} />;
}
