// ---------------------------------------------------------------------------
// THE DATA SEAM.
// Every section of the dashboard reads from these functions. They return either
// believable mock data or LIVE aggregates from the Supabase `events` table —
// controlled by one env flag. The rest of the app neither knows nor cares which
// one is live; both return the exact shapes in lib/types.ts.
//
//   NEXT_PUBLIC_ANALYTICS_LIVE=true  -> read real rows from `events`
//   (unset / anything else)          -> mock data (buildMockDashboard)
//
// Live reads use the AUTHENTICATED server client (lib/supabase/server.ts), so
// RLS permits the SELECT (authenticated-only). The service_role key is never
// used here.
//
// Aggregation note: PostgREST can't GROUP BY over the data API, so groupings
// (sources, devices, projects, timeseries) fetch the range's rows and tally
// them in JS — fine for this small, first-party dataset. Scalar trend counts
// for the previous period ARE aggregated in SQL via head+count queries. If the
// table ever grows large, replace `liveSource` with a Postgres RPC returning
// the same DashboardData shape; nothing else changes.
// ---------------------------------------------------------------------------

import 'server-only';

import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
import { buildMockDashboard } from './mock-data';
import type {
  CountryStat,
  DashboardData,
  DateRange,
  DeviceKind,
  DeviceStat,
  MetricsSummary,
  NewVsReturning,
  ProjectStat,
  SourceStat,
  TimeseriesPoint,
} from './types';

/** Flip live mode on with NEXT_PUBLIC_ANALYTICS_LIVE=true. Unset -> mock data. */
const LIVE = process.env.NEXT_PUBLIC_ANALYTICS_LIVE === 'true';

/** Simulated network latency so loading skeletons are visible during dev. */
const LATENCY = { fast: 180, medium: 280, slow: 380 };

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Validate an untrusted range value (e.g. from a URL searchParam). */
export function normalizeRange(input?: string | string[] | null): DateRange {
  const v = Array.isArray(input) ? input[0] : input;
  return v === 'today' || v === '7d' || v === '30d' || v === 'all' ? v : '7d';
}

// === Live aggregation ======================================================

/** One row of the `events` table, narrowed to the columns we aggregate. */
interface EventRow {
  event_type: string;
  project_slug: string | null;
  source: string | null;
  device: string | null;
  country: string | null;
  city: string | null;
  is_returning: boolean | null;
  duration_ms: number | null;
  created_at: string;
}

const DAY_MS = 86_400_000;

/** Rolling window length per range. `all` has no cutoff (whole table). */
const RANGE_SPAN_MS: Record<DateRange, number | null> = {
  today: DAY_MS,
  '7d': 7 * DAY_MS,
  '30d': 30 * DAY_MS,
  all: null,
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Map the lowercase device values we store onto the UI's DeviceKind. */
const DEVICE_LABELS: Record<string, DeviceKind> = {
  mobile: 'Mobile',
  desktop: 'Desktop',
  tablet: 'Tablet',
};

/** Current window cutoff + the equally-sized previous window (for trend %). */
function windowBounds(range: DateRange): {
  start: string | null;
  previous: { start: string; end: string } | null;
} {
  const span = RANGE_SPAN_MS[range];
  if (span === null) return { start: null, previous: null }; // 'all' -> no trend
  const now = Date.now();
  const startMs = now - span;
  return {
    start: new Date(startMs).toISOString(),
    previous: {
      start: new Date(startMs - span).toISOString(),
      end: new Date(startMs).toISOString(),
    },
  };
}

/** Integer % change, guarded against divide-by-zero (no prior data -> flat). */
function pctChange(current: number, previous: number): number {
  if (previous <= 0) return 0;
  return Math.round(((current - previous) / previous) * 100);
}

/** "2026-06-25" -> "Jun 25" (UTC, as returned by Postgres). */
function dayLabel(day: string): string {
  const [, m, d] = day.split('-').map(Number);
  return `${MONTHS[(m ?? 1) - 1]} ${d}`;
}

/** "project-1" -> "Project 1". Slug is all we store, so derive a display name. */
function slugToName(slug: string): string {
  const name = slug
    .split(/[-_]/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  return name || slug;
}

/** Count occurrences of a key across rows; null/empty keys are skipped. */
function tally<T>(items: T[], key: (item: T) => string | null | undefined): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    const k = key(item);
    if (k == null || k === '') continue;
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return counts;
}

type ServerClient = ReturnType<typeof createClient>;

/** SQL-side count of one event type within [start, end). */
async function countEvents(
  supabase: ServerClient,
  eventType: string,
  start: string,
  end: string,
): Promise<number> {
  const { count, error } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })
    .eq('event_type', eventType)
    .gte('created_at', start)
    .lt('created_at', end);
  if (error) throw new Error(`Analytics count failed: ${error.message}`);
  return count ?? 0;
}

// --- shape builders (each survives 0 rows, rounds, guards division) ---------

function buildMetrics(
  pageviews: EventRow[],
  contactClicks: number,
  prev: { pageview: number; contact: number },
): MetricsSummary {
  // No session/visitor id in the schema yet, so a "visitor" is approximated by
  // a pageview load — visitors and pageViews are equal until we track sessions.
  const visitors = pageviews.length;
  const durations = pageviews
    .map((r) => r.duration_ms)
    .filter((d): d is number => typeof d === 'number');
  const avgSec =
    durations.length === 0
      ? 0
      : Math.round(durations.reduce((a, b) => a + b, 0) / durations.length / 1000);

  return {
    visitors: { value: visitors, changePct: pctChange(visitors, prev.pageview) },
    pageViews: { value: visitors, changePct: pctChange(visitors, prev.pageview) },
    contactClicks: { value: contactClicks, changePct: pctChange(contactClicks, prev.contact) },
    avgTimeOnPageSec: { value: avgSec, changePct: 0 }, // duration_ms null for now
  };
}

function buildTimeseries(pageviews: EventRow[]): TimeseriesPoint[] {
  const byDay = new Map<string, number>();
  for (const r of pageviews) {
    const day = r.created_at.slice(0, 10); // YYYY-MM-DD
    byDay.set(day, (byDay.get(day) ?? 0) + 1);
  }
  return Array.from(byDay.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, count]) => ({ label: dayLabel(day), visitors: count, pageViews: count }));
}

function buildProjects(projectClicks: EventRow[]): ProjectStat[] {
  // Only project_click is tracked, so views are unknown (0); rank by clicks.
  return Array.from(tally(projectClicks, (r) => r.project_slug ?? 'unknown').entries())
    .map(([slug, outboundClicks]) => ({ slug, name: slugToName(slug), views: 0, outboundClicks }))
    .sort((a, b) => b.outboundClicks - a.outboundClicks);
}

function buildSources(pageviews: EventRow[]): SourceStat[] {
  return Array.from(tally(pageviews, (r) => r.source ?? 'Unknown').entries())
    .map(([source, visitors]) => ({ source, visitors }))
    .sort((a, b) => b.visitors - a.visitors);
}

function buildDevices(pageviews: EventRow[]): DeviceStat[] {
  return Array.from(
    tally(pageviews, (r) => {
      const key = r.device?.toLowerCase();
      return key ? DEVICE_LABELS[key] : null; // skip unknown device strings
    }).entries(),
  )
    .map(([device, visitors]) => ({ device: device as DeviceKind, visitors }))
    .sort((a, b) => b.visitors - a.visitors);
}

function buildCountries(pageviews: EventRow[]): CountryStat[] {
  // country/city are null for now -> empty array (UI shows an empty state).
  const located = pageviews.filter((r) => r.country);
  if (located.length === 0) return [];
  const byPlace = new Map<string, CountryStat>();
  for (const r of located) {
    const country = r.country as string;
    const city = r.city ?? '';
    const k = `${country}|${city}`;
    const cur = byPlace.get(k) ?? { country, city, visitors: 0 };
    cur.visitors += 1;
    byPlace.set(k, cur);
  }
  return Array.from(byPlace.values()).sort((a, b) => b.visitors - a.visitors);
}

function buildNewVsReturning(pageviews: EventRow[]): NewVsReturning {
  // is_returning defaults to false -> everyone counts as new for now.
  const returningVisitors = pageviews.filter((r) => r.is_returning === true).length;
  return {
    newVisitors: Math.max(0, pageviews.length - returningVisitors),
    returningVisitors,
  };
}

/** Fetch the range's rows once and assemble the full dashboard payload. */
async function liveSource(range: DateRange): Promise<DashboardData> {
  const supabase = createClient();
  const { start, previous } = windowBounds(range);

  let rowsQuery = supabase
    .from('events')
    .select(
      'event_type, project_slug, source, device, country, city, is_returning, duration_ms, created_at',
    )
    .order('created_at', { ascending: true });
  if (start) rowsQuery = rowsQuery.gte('created_at', start);

  const { data, error } = await rowsQuery.returns<EventRow[]>();
  if (error) throw new Error(`Analytics query failed: ${error.message}`);
  const rows = data ?? [];

  const pageviews = rows.filter((r) => r.event_type === 'pageview');
  const projectClicks = rows.filter((r) => r.event_type === 'project_click');
  const contactClicks = rows.filter((r) => r.event_type === 'contact_click').length;

  const prev = previous
    ? {
        pageview: await countEvents(supabase, 'pageview', previous.start, previous.end),
        contact: await countEvents(supabase, 'contact_click', previous.start, previous.end),
      }
    : { pageview: 0, contact: 0 };

  return {
    range,
    metrics: buildMetrics(pageviews, contactClicks, prev),
    timeseries: buildTimeseries(pageviews),
    projects: buildProjects(projectClicks),
    sources: buildSources(pageviews),
    devices: buildDevices(pageviews),
    countries: buildCountries(pageviews),
    newVsReturning: buildNewVsReturning(pageviews),
  };
}

// Dedupe the live fetch across all sections within one request — each section
// awaits its own getter (preserving Suspense streaming) but they share a single
// set of DB round-trips instead of querying seven times.
const loadLiveDashboard = cache(liveSource);

// === The seam ==============================================================

async function source(range: DateRange): Promise<DashboardData> {
  return LIVE ? loadLiveDashboard(range) : buildMockDashboard(range);
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
