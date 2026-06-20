/** 4820 -> "4,820" */
export const formatNumber = (n: number): string => Math.round(n).toLocaleString('en-US');

/** 142 -> "2m 22s", 38 -> "38s" */
export function formatDuration(seconds: number): string {
  const s = Math.round(seconds);
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return m > 0 ? `${m}m ${rem}s` : `${rem}s`;
}

/** 0.1733 -> "17.3%" */
export const formatPercent = (fraction: number, digits = 1): string =>
  `${(fraction * 100).toFixed(digits)}%`;
