import { getCountries, getNewVsReturning } from '@/lib/analytics';
import type { DateRange } from '@/lib/types';
import { formatNumber, formatPercent } from '@/lib/format';
import Card from '../Card';
import SectionHeading from '../SectionHeading';
import EmptyState from '../EmptyState';

export default async function AudienceSection({ range }: { range: DateRange }) {
  const [countries, split] = await Promise.all([
    getCountries(range),
    getNewVsReturning(range),
  ]);

  const maxVisitors = Math.max(1, ...countries.map((c) => c.visitors));
  const total = split.newVisitors + split.returningVisitors;
  const newPct = total === 0 ? 0 : split.newVisitors / total;

  return (
    <section id="audience" className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Top countries / cities */}
      <Card className="p-5">
        <SectionHeading title="Top locations" subtitle="Countries & cities by visitors" />
        {countries.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="flex flex-col gap-3 mt-1">
            {countries.map((c) => (
              <li key={`${c.country}-${c.city}`} className="flex items-center gap-3">
                <span className="w-[140px] shrink-0 text-[13px] text-ink truncate">
                  {c.country} <span className="text-faint">· {c.city}</span>
                </span>
                <span className="flex-1 h-2 rounded-full bg-cobalt/10 overflow-hidden">
                  <span
                    className="block h-full bg-cobalt rounded-full"
                    style={{ width: `${(c.visitors / maxVisitors) * 100}%` }}
                  />
                </span>
                <span className="w-14 text-right text-[13px] text-muted tabular-nums">
                  {formatNumber(c.visitors)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* New vs returning */}
      <Card className="p-5">
        <SectionHeading title="New vs returning" subtitle="First-time vs repeat visitors" />
        {total === 0 ? (
          <EmptyState />
        ) : (
          <div className="mt-2">
            <div className="flex h-3 rounded-full overflow-hidden">
              <span className="bg-cobalt" style={{ width: `${newPct * 100}%` }} />
              <span className="flex-1 bg-cobalt/25" />
            </div>
            <div className="flex justify-between mt-5">
              <div>
                <p className="text-ink text-[26px] font-medium tracking-[-1px] leading-none">
                  {formatNumber(split.newVisitors)}
                </p>
                <p className="text-faint text-[12px] mt-1.5">
                  New · {formatPercent(newPct, 0)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-ink text-[26px] font-medium tracking-[-1px] leading-none">
                  {formatNumber(split.returningVisitors)}
                </p>
                <p className="text-faint text-[12px] mt-1.5">
                  Returning · {formatPercent(1 - newPct, 0)}
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>
    </section>
  );
}
