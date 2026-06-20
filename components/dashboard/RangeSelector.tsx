'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { DATE_RANGES, type DateRange } from '@/lib/types';

export default function RangeSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const active = (params.get('range') as DateRange) || '7d';

  function select(range: DateRange) {
    const next = new URLSearchParams(params.toString());
    next.set('range', range);
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  }

  return (
    <div className="grid grid-cols-4 gap-1 p-1 rounded-lg bg-bg border-[0.5px] border-cobalt/20">
      {DATE_RANGES.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => select(value)}
          aria-pressed={active === value}
          className={`text-[12px] py-1.5 rounded-md transition-colors ${
            active === value
              ? 'bg-cobalt text-bg font-medium'
              : 'text-muted hover:text-ink'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
