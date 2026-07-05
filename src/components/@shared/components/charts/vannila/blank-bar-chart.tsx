'use client';

import { cn, getMatchLevelColorClass } from '@src/lib/utils';

type TData = { label: string; value: number; isPercentage?: boolean };
type TProps = { title: string; data: TData[] };

export default function BlankBarChart({ data, title }: TProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="mb-3 font-semibold text-foreground">{title}</h2>
      <div className="flex max-h-80 min-h-0 flex-col gap-2.5 overflow-auto">
        {(data || []).map((d, i) => (
          <div key={i}>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs font-medium text-foreground">{d.label}</span>
              <span className="text-xs text-muted-foreground">
                {d.value}
                {d.isPercentage ? '%' : ''}
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
              <div className={cn('h-full rounded-full transition-all', getMatchLevelColorClass(d.value))} style={{ width: `${d.value}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
