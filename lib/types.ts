// ---------------------------------------------------------------------------
// Analytics types — the exact shape the dashboard consumes.
// The real data source (Supabase events table or Umami API) must map ONTO
// these types. Swapping mock -> live data means changing lib/analytics.ts only.
// ---------------------------------------------------------------------------

export type DateRange = 'today' | '7d' | '30d' | 'all';

export const DATE_RANGES: { value: DateRange; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: '7d', label: '7d' },
  { value: '30d', label: '30d' },
  { value: 'all', label: 'All' },
];

export const DATE_RANGE_LABELS: Record<DateRange, string> = {
  today: 'Today',
  '7d': 'Last 7 days',
  '30d': 'Last 30 days',
  all: 'All time',
};

/** A metric value paired with its % change vs. the previous comparable period. */
export interface TrendMetric {
  /** Current value for the selected range. */
  value: number;
  /** Percent change vs. the previous period. Positive = up, negative = down. */
  changePct: number;
}

export interface MetricsSummary {
  visitors: TrendMetric;
  pageViews: TrendMetric;
  contactClicks: TrendMetric;
  /** Average time on page, in seconds. */
  avgTimeOnPageSec: TrendMetric;
}

/** One point on the visitors-over-time chart. */
export interface TimeseriesPoint {
  /** Pre-formatted, human-readable label for the X axis (e.g. "Mar 4", "14:00", "Jan"). */
  label: string;
  visitors: number;
  pageViews: number;
}

export interface ProjectStat {
  slug: string;
  name: string;
  /** How many people viewed the project card. */
  views: number;
  /** Clicked through to the live demo / GitHub link — the key signal. */
  outboundClicks: number;
}

export interface SourceStat {
  source: string;
  visitors: number;
}

export type DeviceKind = 'Mobile' | 'Desktop' | 'Tablet';

export interface DeviceStat {
  device: DeviceKind;
  visitors: number;
}

export interface CountryStat {
  country: string;
  city: string;
  visitors: number;
}

export interface NewVsReturning {
  newVisitors: number;
  returningVisitors: number;
}

/** Everything the dashboard needs for one date range. */
export interface DashboardData {
  range: DateRange;
  metrics: MetricsSummary;
  timeseries: TimeseriesPoint[];
  projects: ProjectStat[];
  sources: SourceStat[];
  devices: DeviceStat[];
  countries: CountryStat[];
  newVsReturning: NewVsReturning;
}

/** Click-through rate as a fraction (0–1). views === 0 -> 0. */
export function clickThroughRate(p: ProjectStat): number {
  return p.views === 0 ? 0 : p.outboundClicks / p.views;
}
