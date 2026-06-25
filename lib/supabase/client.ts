'use client';

import { createBrowserClient } from '@supabase/ssr';

export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

/** Supabase client for the browser — use in Client Components (e.g. login). */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Fail loud, not with a silent 401. A missing/undefined publishable key is
  // inlined as `undefined` at build time and the request goes out with no key,
  // which Supabase rejects as Unauthorized. This guard makes that case obvious.
  if (!url || !key) {
    throw new Error(
      'Supabase browser client is misconfigured: NEXT_PUBLIC_SUPABASE_URL and ' +
        'NEXT_PUBLIC_SUPABASE_ANON_KEY (the sb_publishable_… key) must both be ' +
        'set in .env.local, and the dev server restarted after editing it.',
    );
  }

  // New-format publishable key (sb_publishable_…) is passed as the supabaseKey
  // exactly like the legacy anon JWT — the library sends it as both the `apikey`
  // header and the `Authorization: Bearer` token, which is what PostgREST needs.
  return createBrowserClient(url, key);
}
