import { Suspense } from 'react';
import { normalizeRange } from '@/lib/analytics';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import MetricsSection from '@/components/dashboard/sections/MetricsSection';
import VisitorsSection from '@/components/dashboard/sections/VisitorsSection';
import ProjectsSection from '@/components/dashboard/sections/ProjectsSection';
import TrafficSection from '@/components/dashboard/sections/TrafficSection';
import AudienceSection from '@/components/dashboard/sections/AudienceSection';
import {
  AudienceSkeleton,
  ChartSkeleton,
  MetricsSkeleton,
  TableSkeleton,
  TwoDonutSkeleton,
} from '@/components/dashboard/Skeletons';

// Auth-gated, per-request data — never prerender or cache.
export const dynamic = 'force-dynamic';

export default function DashboardPage({
  searchParams,
}: {
  searchParams: { range?: string };
}) {
  const range = normalizeRange(searchParams.range);

  return (
    <div className="flex flex-col gap-8 max-w-[1280px]">
      <DashboardHeader range={range} />

      {/* Each section streams independently; `key` re-triggers the skeleton on
          every range change. */}
      <Suspense key={`metrics-${range}`} fallback={<MetricsSkeleton />}>
        <MetricsSection range={range} />
      </Suspense>

      <Suspense key={`visitors-${range}`} fallback={<ChartSkeleton />}>
        <VisitorsSection range={range} />
      </Suspense>

      <Suspense key={`projects-${range}`} fallback={<TableSkeleton />}>
        <ProjectsSection range={range} />
      </Suspense>

      <Suspense key={`traffic-${range}`} fallback={<TwoDonutSkeleton />}>
        <TrafficSection range={range} />
      </Suspense>

      <Suspense key={`audience-${range}`} fallback={<AudienceSkeleton />}>
        <AudienceSection range={range} />
      </Suspense>
    </div>
  );
}
