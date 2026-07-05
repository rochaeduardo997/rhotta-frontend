'use client';

import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@src/components/@shared/components/ui/chart';

type TProps = {
  title: string;
  description?: string;
  data: { label: string; value: number }[];
  isLoading?: boolean;
  barColor?: string;
  barSize?: number;
};

export default function BarChart({
  title,
  description,
  data,
  isLoading = false,
  barColor = 'var(--brand)',
  barSize = 16
}: TProps) {
  const chartConfig = {
    value: {
      label: title,
      color: barColor
    }
  } satisfies ChartConfig;

  const chartData = (data || []).map((item) => ({
    label: item.label,
    value: item.value
  }));

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4">
        <h2 className="font-semibold text-foreground">{title}</h2>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      {isLoading ? (
        <div className="flex h-[150px] w-full items-end gap-6 px-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-2">
              <div className="w-full animate-pulse rounded bg-muted" style={{ height: `${20 + i * 15}px` }} />
              <div className="h-3.5 w-8 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      ) : (
        <ChartContainer config={chartConfig} className="h-[150px] w-full">
          <RechartsBarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="value" fill={barColor} radius={[4, 4, 0, 0]} barSize={barSize} />
          </RechartsBarChart>
        </ChartContainer>
      )}
    </div>
  );
}
