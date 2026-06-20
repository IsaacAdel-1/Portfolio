import { getTimeseries } from '@/lib/analytics';
import type { DateRange } from '@/lib/types';
import Card from '../Card';
import SectionHeading from '../SectionHeading';
import EmptyState from '../EmptyState';
import VisitorsChart from '../charts/VisitorsChart';

export default async function VisitorsSection({ range }: { range: DateRange }) {
  const data = await getTimeseries(range);
  const hasData = data.some((p) => p.visitors > 0 || p.pageViews > 0);

  return (
    <Card id="visitors" className="p-5">
      <SectionHeading
        title="Visitors over time"
        subtitle="Unique visitors and page views across the period"
      />
      {hasData ? <VisitorsChart data={data} /> : <EmptyState />}
    </Card>
  );
}
