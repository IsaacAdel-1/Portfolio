import { getDevices, getSources } from '@/lib/analytics';
import type { DateRange } from '@/lib/types';
import Card from '../Card';
import SectionHeading from '../SectionHeading';
import EmptyState from '../EmptyState';
import DonutChart from '../charts/DonutChart';
import { COBALT_RAMP, DEVICE_RAMP } from '../charts/chart-theme';

export default async function TrafficSection({ range }: { range: DateRange }) {
  const [sources, devices] = await Promise.all([getSources(range), getDevices(range)]);

  const sourceData = sources.map((s) => ({ name: s.source, value: s.visitors }));
  const deviceData = devices.map((d) => ({ name: d.device, value: d.visitors }));

  const hasSources = sourceData.some((d) => d.value > 0);
  const hasDevices = deviceData.some((d) => d.value > 0);

  return (
    <section id="traffic" className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card className="p-5">
        <SectionHeading title="Traffic sources" subtitle="Where visitors come from" />
        {hasSources ? (
          <DonutChart data={sourceData} colors={COBALT_RAMP} centerLabel="Visitors" />
        ) : (
          <EmptyState />
        )}
      </Card>

      <Card className="p-5">
        <SectionHeading title="Devices" subtitle="What they browse on" />
        {hasDevices ? (
          <DonutChart data={deviceData} colors={DEVICE_RAMP} centerLabel="Visitors" />
        ) : (
          <EmptyState />
        )}
      </Card>
    </section>
  );
}
