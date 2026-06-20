'use client';

import { formatNumber } from '@/lib/format';

interface TooltipPayloadItem {
  name?: string;
  value?: number;
  color?: string;
  payload?: Record<string, unknown>;
}

export default function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="bg-surface border-[0.5px] border-cobalt/30 rounded-lg px-3 py-2 shadow-[0_12px_32px_rgba(0,0,0,0.5)]">
      {label && <p className="text-faint text-[11px] mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} className="text-ink text-[13px] font-medium flex items-center gap-2">
          {p.color && (
            <span
              className="w-2 h-2 rounded-sm shrink-0"
              style={{ background: p.color }}
            />
          )}
          {formatNumber(p.value ?? 0)}{' '}
          <span className="text-muted font-normal capitalize">{p.name}</span>
        </p>
      ))}
    </div>
  );
}
