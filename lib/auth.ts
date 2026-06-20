// ---------------------------------------------------------------------------
// Edge-safe auth/env helpers. NO `next/headers`, NO `server-only` — so this can
// be imported from middleware (Edge runtime) AND server components alike.
// ---------------------------------------------------------------------------

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** Both public Supabase values are present. */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/**
 * The ONLY condition under which unauthenticated dashboard access is allowed:
 * local development WITH no Supabase configured.
 *
 * `process.env.NODE_ENV` is statically inlined at build time, so in a
 * production build this is the literal `false` and the bypass branches that
 * depend on it are removed by dead-code elimination — the bypass code path
 * does not exist in production.
 */
export const isDevPreviewBypass =
  process.env.NODE_ENV === 'development' && !isSupabaseConfigured;
