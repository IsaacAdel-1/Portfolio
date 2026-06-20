import { getProjectStats } from '@/lib/analytics';
import { clickThroughRate, type DateRange } from '@/lib/types';
import { formatNumber, formatPercent } from '@/lib/format';
import Card from '../Card';
import SectionHeading from '../SectionHeading';
import EmptyState from '../EmptyState';

export default async function ProjectsSection({ range }: { range: DateRange }) {
  const projects = await getProjectStats(range);
  const maxClicks = Math.max(1, ...projects.map((p) => p.outboundClicks));

  return (
    <Card id="projects" className="p-5">
      <SectionHeading
        title="Project performance"
        subtitle="Ranked by outbound clicks — who actually clicks through to the demo / repo"
      />

      {projects.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[480px]">
            {/* Header */}
            <div className="grid grid-cols-[1.7fr_repeat(3,minmax(72px,0.7fr))] gap-3 px-3 pb-2 text-[11px] tracking-[1.5px] uppercase text-faint">
              <span>Project</span>
              <span className="text-right">Views</span>
              <span className="text-right">Outbound</span>
              <span className="text-right">CTR</span>
            </div>

            <div className="flex flex-col">
              {projects.map((p, i) => {
                const ctr = clickThroughRate(p);
                const barWidth = `${(p.outboundClicks / maxClicks) * 100}%`;
                return (
                  <div
                    key={p.slug}
                    className="relative grid grid-cols-[1.7fr_repeat(3,minmax(72px,0.7fr))] items-center gap-3 px-3 py-3 rounded-lg overflow-hidden border-[0.5px] border-transparent hover:border-cobalt/20 transition-colors"
                  >
                    {/* outbound-clicks bar behind the row */}
                    <span
                      className="absolute inset-y-1 left-0 bg-cobalt/[0.08] rounded-md"
                      style={{ width: barWidth }}
                    />
                    <span className="relative text-ink text-[14px] truncate">
                      <span className="text-faint mr-1.5">{i + 1}.</span>
                      {p.name}
                    </span>
                    <span className="relative text-right text-muted text-[13px] tabular-nums">
                      {formatNumber(p.views)}
                    </span>
                    <span className="relative text-right text-ink text-[13px] font-medium tabular-nums">
                      {formatNumber(p.outboundClicks)}
                    </span>
                    <span
                      className={`relative text-right text-[13px] tabular-nums ${
                        ctr >= 0.15 ? 'text-positive' : 'text-muted'
                      }`}
                    >
                      {formatPercent(ctr)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
