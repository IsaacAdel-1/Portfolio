import { getMetrics } from '@/lib/analytics';
import type { DateRange, TrendMetric } from '@/lib/types';
import { formatDuration, formatNumber } from '@/lib/format';
import Card from '../Card';
import TrendPill from '../TrendPill';

function MetricCard({
  label,
  metric,
  display,
  featured = false,
}: {
  label: string;
  metric: TrendMetric;
  display: string;
  featured?: boolean;
}) {
  return (
    <Card featured={featured} className="p-5 flex flex-col gap-3">
      <span className="text-[12px] tracking-[2px] uppercase text-faint">{label}</span>
      <div className="flex items-end justify-between gap-2">
        <span className="text-ink text-[30px] leading-none font-medium tracking-[-1px]">
          {display}
        </span>
        <TrendPill changePct={metric.changePct} />
      </div>
      <span className="text-faint text-[11px]">vs. previous period</span>
    </Card>
  );
}

export default async function MetricsSection({ range }: { range: DateRange }) {
  const m = await getMetrics(range);

  return (
    <section id="overview" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <MetricCard label="Total visitors" metric={m.visitors} display={formatNumber(m.visitors.value)} />
      <MetricCard label="Page views" metric={m.pageViews} display={formatNumber(m.pageViews.value)} />
      <MetricCard
        label="Contact clicks"
        metric={m.contactClicks}
        display={formatNumber(m.contactClicks.value)}
        featured
      />
      <MetricCard
        label="Avg. time on page"
        metric={m.avgTimeOnPageSec}
        display={formatDuration(m.avgTimeOnPageSec.value)}
      />
    </section>
  );
}
