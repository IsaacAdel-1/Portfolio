'use client';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { formatNumber, formatPercent } from '@/lib/format';
import ChartTooltip from './ChartTooltip';

export interface DonutDatum {
  name: string;
  value: number;
}

export default function DonutChart({
  data,
  colors,
  centerLabel = 'Total',
}: {
  data: DonutDatum[];
  colors: string[];
  centerLabel?: string;
}) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div>
      <div className="relative">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={58}
              outerRadius={84}
              paddingAngle={2}
              stroke="none"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={colors[i % colors.length]} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-ink text-xl font-medium tracking-[-0.5px]">
            {formatNumber(total)}
          </span>
          <span className="text-faint text-[10px] tracking-[2px] uppercase mt-0.5">
            {centerLabel}
          </span>
        </div>
      </div>

      <ul className="mt-4 flex flex-col gap-2">
        {data.map((d, i) => (
          <li key={d.name} className="flex items-center justify-between text-[13px]">
            <span className="flex items-center gap-2 text-muted">
              <span
                className="w-2 h-2 rounded-sm shrink-0"
                style={{ background: colors[i % colors.length] }}
              />
              {d.name}
            </span>
            <span className="text-ink tabular-nums">
              {formatNumber(d.value)}{' '}
              <span className="text-faint">
                ({total === 0 ? '0%' : formatPercent(d.value / total, 0)})
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
