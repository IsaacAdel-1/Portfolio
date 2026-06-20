// ---------------------------------------------------------------------------
// THE DATA SEAM.
// Every section of the dashboard reads from these functions. Today they return
// believable mock data; to go live you change ONLY this file.
//
// Option B (recommended, Supabase already in stack):
//   A `events` table the portfolio writes to:
//     id, event_type, project_slug, source, country, city, device,
//     is_returning, duration_ms, created_at
//   Then aggregate per range with SQL/RPC and map onto lib/types.ts shapes.
//
//   Example (inside getMetrics):
//     const supabase = await createClient();
//     const since = rangeStart(range);
//     const { data } = await supabase.rpc('dashboard_metrics', { since });
//     return mapMetrics(data);
//
// Option A: fetch Umami's API and map its response onto the same shapes.
//
// The rest of the app neither knows nor cares which one is live.
// ---------------------------------------------------------------------------

import 'server-only';

import { buildMockDashboard } from './mock-data';
import type {
  CountryStat,
  DashboardData,
  DateRange,
  DeviceStat,
  MetricsSummary,
  NewVsReturning,
  ProjectStat,
  SourceStat,
  TimeseriesPoint,
} from './types';

/** Flip to true once a real source is wired below. */
const LIVE = false;

/** Simulated network latency so loading skeletons are visible during dev. */
const LATENCY = { fast: 180, medium: 280, slow: 380 };

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Validate an untrusted range value (e.g. from a URL searchParam). */
export function normalizeRange(input?: string | string[] | null): DateRange {
  const v = Array.isArray(input) ? input[0] : input;
  return v === 'today' || v === '7d' || v === '30d' || v === 'all' ? v : '7d';
}

async function source(range: DateRange): Promise<DashboardData> {
  if (LIVE) {
    // TODO: replace with real Supabase/Umami aggregation.
    throw new Error('Live analytics source not configured yet.');
  }
  return buildMockDashboard(range);
}

// --- Per-section reads (each independently awaitable for streaming) ---------

export async function getMetrics(range: DateRange): Promise<MetricsSummary> {
  await wait(LATENCY.fast);
  return (await source(range)).metrics;
}

export async function getTimeseries(range: DateRange): Promise<TimeseriesPoint[]> {
  await wait(LATENCY.medium);
  return (await source(range)).timeseries;
}

export async function getProjectStats(range: DateRange): Promise<ProjectStat[]> {
  await wait(LATENCY.medium);
  return (await source(range)).projects;
}

export async function getSources(range: DateRange): Promise<SourceStat[]> {
  await wait(LATENCY.slow);
  return (await source(range)).sources;
}

export async function getDevices(range: DateRange): Promise<DeviceStat[]> {
  await wait(LATENCY.slow);
  return (await source(range)).devices;
}

export async function getCountries(range: DateRange): Promise<CountryStat[]> {
  await wait(LATENCY.slow);
  return (await source(range)).countries;
}

export async function getNewVsReturning(range: DateRange): Promise<NewVsReturning> {
  await wait(LATENCY.slow);
  return (await source(range)).newVsReturning;
}

/** Convenience: everything at once (used if you prefer a single fetch). */
export async function getDashboardData(range: DateRange): Promise<DashboardData> {
  await wait(LATENCY.medium);
  return source(range);
}
