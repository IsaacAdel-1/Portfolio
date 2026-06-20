import { DATE_RANGE_LABELS, type DateRange } from '@/lib/types';

export default function DashboardHeader({ range }: { range: DateRange }) {
  return (
    <header className="relative">
      {/* Soft radial glow — header only */}
      <div className="absolute -top-12 -left-10 w-[520px] h-[260px] dash-header-glow pointer-events-none" />

      <div className="relative flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-ink text-[28px] leading-none font-medium tracking-[-1px]">
            Analytics
          </h1>
          <p className="text-muted text-sm mt-2">{DATE_RANGE_LABELS[range]}</p>
        </div>

        <div className="flex items-center gap-2 text-[12px] tracking-[2px] uppercase text-faint">
          <span className="relative flex w-2 h-2">
            <span className="absolute inline-flex w-2 h-2 rounded-full bg-positive opacity-60 animate-ping" />
            <span className="relative inline-flex w-2 h-2 rounded-full bg-positive" />
          </span>
          Live
        </div>
      </div>
    </header>
  );
}
