'use client';

import { RadialBar, RadialBarChart, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';

type TData = { label: string; value: number };
type TProps = { title: string; data: TData[] };

export default function RadialChart({ title, data }: TProps) {
  const getFillColor = (value: number) => {
    if (value >= 76) return 'var(--success)';
    if (value >= 51 && value < 76) return 'var(--color-blue-500)';
    if (value >= 26 && value <= 50) return 'var(--warning)';
    if (value < 26) return 'var(--danger)';
    return 'var(--danger)';
  };

  const chartData = (data || [])
    .map(item => ({
      skillName: item.label,
      name: item.label,
      value: item.value,
      fill: getFillColor(item.value)
    }))
    .sort((a, b) => a.value - b.value);

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="mb-1 font-semibold text-foreground">{title}</h2>
      <ResponsiveContainer width="100%" height={220}>
        <RadialBarChart data={chartData} startAngle={90} endAngle={-270} innerRadius="20%" outerRadius="100%">
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <Tooltip
            cursor={false}
            contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
            labelStyle={{ display: 'none' }}
            formatter={(value, name, props) => [`${value}%`, props.payload.skillName]}
          />
          <RadialBar dataKey="value" background />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: item.fill }} />
            <span className="text-muted-foreground capitalize">
              {item.name}: <span className="text-foreground">{item.value}%</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
