'use client';

import { useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { TimeseriesPoint } from '@/lib/types';
import { AXIS_LINE, AXIS_TEXT, COBALT, GRID_LINE } from './chart-theme';
import ChartTooltip from './ChartTooltip';

type Metric = 'visitors' | 'pageViews';

const TABS: { key: Metric; label: string }[] = [
  { key: 'visitors', label: 'Visitors' },
  { key: 'pageViews', label: 'Page views' },
];

export default function VisitorsChart({ data }: { data: TimeseriesPoint[] }) {
  const [metric, setMetric] = useState<Metric>('visitors');

  return (
    <div>
      <div className="flex justify-end mb-3">
        <div className="inline-flex gap-1 p-1 rounded-lg bg-bg border-[0.5px] border-cobalt/20">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setMetric(t.key)}
              aria-pressed={metric === t.key}
              className={`text-[12px] px-3 py-1 rounded-md transition-colors ${
                metric === t.key ? 'bg-cobalt text-bg font-medium' : 'text-muted hover:text-ink'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 8, right: 6, left: -14, bottom: 0 }}>
          <defs>
            <linearGradient id="visitorsFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COBALT} stopOpacity={0.35} />
              <stop offset="100%" stopColor={COBALT} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={GRID_LINE} vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: AXIS_TEXT, fontSize: 11 }}
            axisLine={{ stroke: AXIS_LINE }}
            tickLine={false}
            minTickGap={24}
          />
          <YAxis
            tick={{ fill: AXIS_TEXT, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={44}
            allowDecimals={false}
          />
          <Tooltip
            content={<ChartTooltip />}
            cursor={{ stroke: 'rgba(56,138,221,0.35)', strokeWidth: 1 }}
          />
          <Area
            type="monotone"
            dataKey={metric}
            name={metric === 'visitors' ? 'visitors' : 'page views'}
            stroke={COBALT}
            strokeWidth={2}
            fill="url(#visitorsFill)"
            dot={false}
            activeDot={{ r: 4, fill: COBALT, stroke: '#060a14', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
