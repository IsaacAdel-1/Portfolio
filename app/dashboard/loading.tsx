import {
  AudienceSkeleton,
  ChartSkeleton,
  MetricsSkeleton,
  TableSkeleton,
  TwoDonutSkeleton,
} from '@/components/dashboard/Skeletons';

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-8 max-w-[1280px]">
      <div className="h-11 w-40 bg-cobalt/10 rounded animate-pulse" />
      <MetricsSkeleton />
      <ChartSkeleton />
      <TableSkeleton />
      <TwoDonutSkeleton />
      <AudienceSkeleton />
    </div>
  );
}
