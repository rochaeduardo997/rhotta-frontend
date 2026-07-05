import type { ReactNode } from 'react';

type TProps = { label: string; children: ReactNode };

export default function FilterItem({ label, children }: TProps) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-input-border bg-white dark:bg-card p-3 capitalize shadow-md">
      <label className="text-primary-dark dark:text-foreground text-xs font-medium">{label}</label>
      {children}
    </div>
  );
}
