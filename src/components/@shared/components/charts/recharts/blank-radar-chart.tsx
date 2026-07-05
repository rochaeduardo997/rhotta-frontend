'use client';

import { RADAR_CHART_COLORS } from '@src/@shared/constants/charts/radar-colors';
import { cn } from '@src/lib/utils';
import { Legend, PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts';
import { TruncatedTextTooltip } from '../../truncate-text-tooltip';

type TData = { area: string; score: number; datasetName?: string };
type TBarData = { title: string; description?: string; score: number };
type TProps = { title: string; description?: string; data: TData[][]; barData: TBarData[][] };

export default function BlankRadarChart({ data, title, description, barData }: TProps) {
  const chartData =
    data?.[0]?.map((item, index) => {
      const row: Record<string, string | number> = { area: item.area };
      data.forEach((dataset, datasetIndex) => (row[`dataset${datasetIndex}`] = dataset[index]?.score ?? 0));
      return row;
    }) ?? [];

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="mb-1 font-semibold text-foreground">{title}</h2>
      {description && <p className="mb-3 text-xs text-muted-foreground">{description}</p>}
      <ResponsiveContainer width="100%" height={250}>
        <RadarChart data={chartData}>
          <PolarGrid stroke="var(--border)" />
          <PolarAngleAxis
            dataKey="area"
            tick={{
              fontSize: 9,
              fill: 'var(--muted-foreground)'
            }}
          />
          <Tooltip
            formatter={value => [`${value}%`, 'Score']}
            contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
          />
          {(data || []).map((d, index) => (
            <Radar
              key={index}
              // name={`${d?.[0].datasetName ?? 'Dataset' + index}`}
              dataKey={`dataset${index}`}
              stroke={RADAR_CHART_COLORS[index]}
              fill={RADAR_CHART_COLORS[index]}
              fillOpacity={0.15}
              strokeWidth={2}
            />
          ))}
          {(barData || []).length > 1 && <Legend iconSize={8} wrapperStyle={{ fontSize: '11px' }} />}
        </RadarChart>
      </ResponsiveContainer>

      {(barData || []).length === 1 && (
        <div className="mt-4 flex flex-col gap-2">
          {(barData[0] || []).map((bd, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-28 shrink-0 truncate text-xs text-muted-foreground">
                <TruncatedTextTooltip text={bd.title} maxLength={28} />
              </span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                <div
                  className={cn('h-full rounded-full transition-all', {
                    'bg-success': bd.score >= 76,
                    'bg-blue-500': bd.score >= 51 && bd.score < 76,
                    'bg-warning': bd.score >= 26 && bd.score <= 50,
                    'bg-danger': bd.score < 26
                  })}
                  style={{ width: `${Math.max(0, Math.min(100, bd.score))}%` }}
                />
              </div>
              <span className="w-8 text-right text-xs font-medium text-foreground">{bd.score}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
