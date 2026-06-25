// ---------------------------------------------------------------------------
// First-party event tracking (v1) — writes visitor events into the Supabase
// `events` table using the PUBLIC anon browser client only (never service_role).
//
// Runs ALONGSIDE Umami; the two are independent. This file only WRITES events.
// Reading them into the dashboard is a separate step — lib/analytics.ts stays
// on mock data until then.
//
// v1 scope: only 'pageview' and 'project_click'. country / city / is_returning
// / duration_ms are intentionally left null/default and added later.
//
// Tracking is FAIL-SILENT: it must never throw or block the page.
// ---------------------------------------------------------------------------

import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

export type TrackEventType = 'pageview' | 'project_click';

interface TrackPayload {
  /** Set only for 'project_click' — the clicked project's identifier. */
  projectSlug?: string;
}

type DeviceKind = 'mobile' | 'tablet' | 'desktop';

/**
 * Is event recording allowed in this environment?
 *
 * Default OFF in development so local `npm run dev` sessions never pollute the
 * data — same principle as the Umami gate. ON in production builds. To record
 * events while testing locally, set NEXT_PUBLIC_TRACK_EVENTS=true in .env.local
 * (NEXT_PUBLIC_* vars are inlined at build time, so restart the dev server).
 */
export function isTrackingEnabled(): boolean {
  return (
    process.env.NEXT_PUBLIC_TRACK_EVENTS === 'true' ||
    process.env.NODE_ENV === 'production'
  );
}

/** Coarse device class from UA + viewport width. Good enough for v1. */
function deriveDevice(): DeviceKind {
  const ua = navigator.userAgent;
  const width = window.innerWidth;
  if (/iPad|Tablet/i.test(ua)) return 'tablet';
  if (/Mobi|Android|iPhone|iPod/i.test(ua) || width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

/** Coarse traffic source from the referrer hostname. */
function deriveSource(): string {
  const ref = document.referrer;
  if (!ref) return 'direct';

  let host: string;
  try {
    host = new URL(ref).hostname.toLowerCase();
  } catch {
    return 'direct';
  }

  // Arriving from our own site (internal navigation) is not an external source.
  if (host === window.location.hostname) return 'direct';

  if (host.includes('linkedin')) return 'linkedin';
  if (host.includes('google')) return 'google';
  if (host.includes('khamsat')) return 'khamsat';
  return host;
}

/**
 * Fire-and-forget event insert. Always resolves (errors are swallowed), so
 * callers can ignore the returned promise without risking an unhandled
 * rejection or a broken page / blocked navigation.
 */
export async function trackEvent(
  eventType: TrackEventType,
  payload: TrackPayload = {},
): Promise<void> {
  try {
    if (typeof window === 'undefined') return; // SSR guard
    if (!isTrackingEnabled() || !isSupabaseConfigured) return;

    const supabase = createClient();
    await supabase.from('events').insert({
      event_type: eventType,
      project_slug: payload.projectSlug ?? null,
      source: deriveSource(),
      device: deriveDevice(),
      // country / city / is_returning / duration_ms: left null/default for v1.
    });
  } catch {
    // Swallow — tracking must never break the page.
  }
}
