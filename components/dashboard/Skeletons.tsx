import type { CSSProperties } from 'react';
import Card from './Card';

const Shimmer = ({
  className = '',
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) => <div className={`animate-pulse bg-cobalt/10 rounded ${className}`} style={style} />;

export function MetricsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="p-5 flex flex-col gap-3">
          <Shimmer className="h-3 w-24" />
          <Shimmer className="h-8 w-28" />
          <Shimmer className="h-3 w-20" />
        </Card>
      ))}
    </div>
  );
}

export function ChartSkeleton({ height = 320 }: { height?: number }) {
  return (
    <Card className="p-5">
      <Shimmer className="h-4 w-40 mb-2" />
      <Shimmer className="h-3 w-56 mb-5" />
      <Shimmer className="w-full rounded-lg" style={{ height }} />
    </Card>
  );
}

export function TableSkeleton() {
  return (
    <Card className="p-5">
      <Shimmer className="h-4 w-44 mb-2" />
      <Shimmer className="h-3 w-72 mb-5" />
      <div className="flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Shimmer key={i} className="h-9 w-full rounded-lg" />
        ))}
      </div>
    </Card>
  );
}

export function TwoDonutSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {Array.from({ length: 2 }).map((_, i) => (
        <Card key={i} className="p-5">
          <Shimmer className="h-4 w-32 mb-2" />
          <Shimmer className="h-3 w-40 mb-5" />
          <div className="flex justify-center">
            <Shimmer className="h-[168px] w-[168px] rounded-full" />
          </div>
          <div className="flex flex-col gap-2 mt-5">
            {Array.from({ length: 4 }).map((_, j) => (
              <Shimmer key={j} className="h-3 w-full" />
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

export function AudienceSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {Array.from({ length: 2 }).map((_, i) => (
        <Card key={i} className="p-5">
          <Shimmer className="h-4 w-36 mb-2" />
          <Shimmer className="h-3 w-44 mb-5" />
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, j) => (
              <Shimmer key={j} className="h-3 w-full" />
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
