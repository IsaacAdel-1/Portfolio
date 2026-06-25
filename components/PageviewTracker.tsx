'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/track';

/**
 * Fires a single 'pageview' event on initial load. Mounted ONLY from the public
 * portfolio (app/page.tsx), so /dashboard and /login never record pageviews.
 * Fire-and-forget; renders nothing.
 */
export default function PageviewTracker() {
  useEffect(() => {
    trackEvent('pageview');
  }, []);

  return null;
}
