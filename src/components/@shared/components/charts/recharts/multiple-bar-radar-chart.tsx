'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { RADAR_CHART_COLORS } from '@src/@shared/constants/charts/radar-colors';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type TData = Record<string, string | number>;
type TBarData = { title: string; description?: string };
type TProps = { title: string; description?: string; data: TData[]; barData: TBarData[]; dataKey: string };

export default function BlankMultipleBarChart({ data, title, description, barData, dataKey }: TProps) {
  const t = useTranslations('Default');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const activePage = Math.min(currentPage, Math.max(1, totalPages));

  const getRowStats = (row: TData) => {
    let compatibleCount = 0;
    let scoreSum = 0;
    barData.forEach(b => {
      const val = row[b.title];
      if (typeof val === 'number' && val > 0) {
        compatibleCount++;
        scoreSum += val;
      }
    });
    return { compatibleCount, scoreSum };
  };

  const sortedData = [...data].sort((a, b) => {
    const statsA = getRowStats(a);
    const statsB = getRowStats(b);
    if (statsA.compatibleCount !== statsB.compatibleCount) {
      return statsB.compatibleCount - statsA.compatibleCount;
    }
    return statsB.scoreSum - statsA.scoreSum;
  });

  const hasPagination = sortedData.length > itemsPerPage;
  const paginatedData = hasPagination ? sortedData.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage) : sortedData;

  const displayCount = hasPagination ? itemsPerPage : data.length;
  const categoryHeight = Math.max(35, barData.length * 9 + 8);
  const chartHeight = displayCount > 0 ? displayCount * categoryHeight + 70 : 220;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="mb-1 font-semibold text-foreground">{title}</h2>
      <p className="mb-4 text-xs text-muted-foreground">{description}</p>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart data={paginatedData} barSize={7} barGap={1} layout="vertical">
          <CartesianGrid horizontal={false} stroke="var(--border)" />
          <XAxis type="number" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
          <YAxis
            type="category"
            dataKey={dataKey}
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
            width={130}
          />
          <Tooltip
            contentStyle={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: '12px'
            }}
            formatter={(value, label) => [`${label}: ${value}%`]}
          />
          <Legend iconSize={8} iconType="square" wrapperStyle={{ paddingTop: '16px', fontSize: '12px' }} />
          {barData.map((a, i) => (
            <Bar key={i} dataKey={a.title} fill={RADAR_CHART_COLORS[i % RADAR_CHART_COLORS.length]} radius={[0, 4, 4, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
      {hasPagination && (
        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <span className="text-xs text-muted-foreground">
            {t('showing-pagination', {
              start: (activePage - 1) * itemsPerPage + 1,
              end: Math.min(activePage * itemsPerPage, data.length),
              total: data.length
            })}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(activePage - 1)}
              disabled={activePage === 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-foreground transition-colors hover:bg-accent disabled:opacity-50 disabled:hover:bg-background"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs font-medium text-foreground">
              {t('page')} {activePage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(activePage + 1)}
              disabled={activePage === totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-foreground transition-colors hover:bg-accent disabled:opacity-50 disabled:hover:bg-background"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
