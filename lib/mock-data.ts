// ---------------------------------------------------------------------------
// Believable MOCK analytics, shaped exactly like the real API response.
// Everything is derived from a single 30-day anchor + per-range multipliers so
// totals stay internally consistent across ranges. Fully deterministic (no
// Math.random) so numbers are stable between renders.
//
// To go live: replace the body of lib/analytics.ts — this file can be deleted.
// ---------------------------------------------------------------------------

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

// ---- Anchor totals (last 30 days) ----------------------------------------
const BASE_30D = { visitors: 4820, pageViews: 11230, contactClicks: 86 };

// Scale the anchor to each range.
const RANGE_MULTIPLIER: Record<DateRange, number> = {
  today: 0.035,
  '7d': 0.23,
  '30d': 1,
  all: 6.4,
};

// Average time on page (seconds) — an average, so it does NOT scale.
const AVG_TIME_SEC: Record<DateRange, number> = {
  today: 151,
  '7d': 146,
  '30d': 142,
  all: 139,
};

// Trend vs. previous comparable period (%). 'all' has no prior period -> flat.
const CHANGE_PCT: Record<
  DateRange,
  { visitors: number; pageViews: number; contactClicks: number; avgTime: number }
> = {
  today: { visitors: 12, pageViews: 9, contactClicks: 33, avgTime: 6 },
  '7d': { visitors: 18, pageViews: 14, contactClicks: 24, avgTime: 3 },
  '30d': { visitors: 9, pageViews: 7, contactClicks: 16, avgTime: -2 },
  all: { visitors: 0, pageViews: 0, contactClicks: 0, avgTime: 0 },
};

// ---- Distribution shares --------------------------------------------------
// Traffic sources (sum = 1) — LinkedIn-led, Khamsat strong (freelance market).
const SOURCE_SHARES: { source: string; share: number }[] = [
  { source: 'LinkedIn', share: 0.38 },
  { source: 'Khamsat', share: 0.22 },
  { source: 'Google', share: 0.18 },
  { source: 'Direct', share: 0.14 },
  { source: 'Other', share: 0.08 },
];

// Devices (sum = 1) — mobile-heavy audience.
const DEVICE_SHARES: { device: DeviceStat['device']; share: number }[] = [
  { device: 'Mobile', share: 0.62 },
  { device: 'Desktop', share: 0.31 },
  { device: 'Tablet', share: 0.07 },
];

// Top countries / cities (sum < 1; remainder is the long tail).
const COUNTRY_SHARES: { country: string; city: string; share: number }[] = [
  { country: 'Egypt', city: 'Cairo', share: 0.34 },
  { country: 'Saudi Arabia', city: 'Riyadh', share: 0.19 },
  { country: 'United Arab Emirates', city: 'Dubai', share: 0.12 },
  { country: 'United States', city: 'New York', share: 0.09 },
  { country: 'Germany', city: 'Berlin', share: 0.06 },
  { country: 'United Kingdom', city: 'London', share: 0.05 },
];

const NEW_RETURNING_SHARES = { newVisitors: 0.71, returningVisitors: 0.29 };

// Project performance anchor (30 days). Two clear standouts by outbound clicks.
const PROJECTS_30D: ProjectStat[] = [
  { slug: 'nexus-analytics', name: 'Nexus Analytics', views: 1840, outboundClicks: 358 },
  { slug: 'devlink-portal', name: 'DevLink Portal', views: 1320, outboundClicks: 247 },
  { slug: 'cobalt-ui', name: 'Cobalt UI Kit', views: 980, outboundClicks: 121 },
  { slug: 'taskforge', name: 'TaskForge', views: 760, outboundClicks: 74 },
  { slug: 'snippet-vault', name: 'Snippet Vault', views: 540, outboundClicks: 38 },
];

// ---- Helpers --------------------------------------------------------------

/** Split `total` into integers proportional to `shares`, preserving the sum. */
function split(total: number, shares: number[]): number[] {
  const raw = shares.map((s) => total * s);
  const out = raw.map(Math.floor);
  const used = out.reduce((a, b) => a + b, 0);
  let remainder = Math.round(raw.reduce((a, b) => a + b, 0)) - used;
  const byFraction = raw
    .map((v, i) => ({ i, frac: v - Math.floor(v) }))
    .sort((a, b) => b.frac - a.frac);
  for (let k = 0; k < remainder && k < byFraction.length; k++) out[byFraction[k].i]++;
  return out;
}

function scale(value: number, range: DateRange): number {
  return Math.max(0, Math.round(value * RANGE_MULTIPLIER[range]));
}

// Per-range timeseries shape (labels + weight curve).
function seriesShape(range: DateRange): { labels: string[]; weights: number[] } {
  if (range === 'today') {
    const labels = Array.from({ length: 24 }, (_, h) => `${String(h).padStart(2, '0')}:00`);
    const g = (h: number, mu: number, s: number) => Math.exp(-((h - mu) ** 2) / (2 * s * s));
    const weights = labels.map((_, h) => 0.05 + 0.7 * g(h, 14, 4) + 0.5 * g(h, 20, 2.5));
    return { labels, weights };
  }
  if (range === '7d') {
    return {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      weights: [0.95, 1.05, 1.12, 1.18, 1.25, 0.82, 0.68],
    };
  }
  if (range === 'all') {
    return {
      labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      weights: [0.4, 0.5, 0.55, 0.62, 0.7, 0.8, 0.85, 0.95, 1.05, 1.15, 1.25, 1.4],
    };
  }
  // 30d — organic daily wave.
  const labels = Array.from({ length: 30 }, (_, i) => `${i + 1}`);
  const weights = labels.map(
    (_, i) => 1 + 0.3 * Math.sin((i / 30) * Math.PI * 3) + 0.12 * Math.cos((i / 30) * Math.PI * 7),
  );
  return { labels, weights };
}

// ---- Builders -------------------------------------------------------------

function buildMetrics(range: DateRange): MetricsSummary {
  const c = CHANGE_PCT[range];
  return {
    visitors: { value: scale(BASE_30D.visitors, range), changePct: c.visitors },
    pageViews: { value: scale(BASE_30D.pageViews, range), changePct: c.pageViews },
    contactClicks: { value: scale(BASE_30D.contactClicks, range), changePct: c.contactClicks },
    avgTimeOnPageSec: { value: AVG_TIME_SEC[range], changePct: c.avgTime },
  };
}

function buildTimeseries(range: DateRange): TimeseriesPoint[] {
  const { labels, weights } = seriesShape(range);
  const sum = weights.reduce((a, b) => a + b, 0);
  const norm = weights.map((w) => w / sum);
  const visitors = split(scale(BASE_30D.visitors, range), norm);
  const pageViews = split(scale(BASE_30D.pageViews, range), norm);
  return labels.map((label, i) => ({
    label,
    visitors: visitors[i],
    pageViews: pageViews[i],
  }));
}

function buildProjects(range: DateRange): ProjectStat[] {
  return PROJECTS_30D.map((p) => ({
    ...p,
    views: scale(p.views, range),
    outboundClicks: scale(p.outboundClicks, range),
  })).sort((a, b) => b.outboundClicks - a.outboundClicks);
}

function buildSources(range: DateRange): SourceStat[] {
  const total = scale(BASE_30D.visitors, range);
  const counts = split(total, SOURCE_SHARES.map((s) => s.share));
  return SOURCE_SHARES.map((s, i) => ({ source: s.source, visitors: counts[i] })).sort(
    (a, b) => b.visitors - a.visitors,
  );
}

function buildDevices(range: DateRange): DeviceStat[] {
  const total = scale(BASE_30D.visitors, range);
  const counts = split(total, DEVICE_SHARES.map((d) => d.share));
  return DEVICE_SHARES.map((d, i) => ({ device: d.device, visitors: counts[i] }));
}

function buildCountries(range: DateRange): CountryStat[] {
  const total = scale(BASE_30D.visitors, range);
  const counts = split(total, COUNTRY_SHARES.map((c) => c.share));
  return COUNTRY_SHARES.map((c, i) => ({
    country: c.country,
    city: c.city,
    visitors: counts[i],
  })).sort((a, b) => b.visitors - a.visitors);
}

function buildNewVsReturning(range: DateRange): NewVsReturning {
  const total = scale(BASE_30D.visitors, range);
  const [n, r] = split(total, [
    NEW_RETURNING_SHARES.newVisitors,
    NEW_RETURNING_SHARES.returningVisitors,
  ]);
  return { newVisitors: n, returningVisitors: r };
}

/** The full believable dashboard payload for a range. */
export function buildMockDashboard(range: DateRange): DashboardData {
  return {
    range,
    metrics: buildMetrics(range),
    timeseries: buildTimeseries(range),
    projects: buildProjects(range),
    sources: buildSources(range),
    devices: buildDevices(range),
    countries: buildCountries(range),
    newVsReturning: buildNewVsReturning(range),
  };
}
