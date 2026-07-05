interface DistributionBarItem {
  label: string;
  count: number;
  percentage: number;
  barColor: string;
  valueColor: string;
}

interface DistributionBarsProps {
  title: string;
  items: DistributionBarItem[];
}

export type { DistributionBarItem };

export default function DistributionBars({ title, items }: DistributionBarsProps) {
  return (
    <div className="rounded-2xl border border-border bg-white dark:bg-card p-5 shadow-xs">
      <h3 className="mb-4 text-sm font-semibold text-foreground">{title}</h3>
      <div className="flex flex-col gap-4">
        {items.map(item => (
          <div key={item.label} className="flex items-center gap-3">
            <span className="w-24 shrink-0 text-xs font-semibold text-muted-foreground">{item.label}</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full transition-all" style={{ width: `${item.percentage}%`, backgroundColor: item.barColor }} />
            </div>
            <span className="w-8 text-right text-xs font-semibold" style={{ color: item.valueColor }}>
              {item.count}
            </span>
            <span className="w-10 text-right text-xs text-muted-foreground">{item.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
