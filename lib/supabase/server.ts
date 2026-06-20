import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from '@/lib/auth';

export { isSupabaseConfigured };

/** Supabase client bound to the request cookies — use in Server Components,
 *  Route Handlers, and Server Actions. */
export function createClient() {
  const cookieStore = cookies();
  return createServerClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component — cookies are read-only here.
          // The middleware refreshes the session, so this is safe to ignore.
        }
      },
    },
  });
}

/**
 * Server-side auth guard — defense in depth alongside the middleware. Redirects
 * to /login unless a valid user exists. The ONLY unauthenticated path allowed is
 * the local dev preview (no Supabase configured, NODE_ENV === 'development').
 * In production this always fails closed.
 */
export async function requireUser() {
  if (!isSupabaseConfigured) {
    if (process.env.NODE_ENV === 'development') return null;
    redirect('/login'); // fail closed in production
  }

  const supabase = createClient();
  let user = null;
  try {
    const { data, error } = await supabase.auth.getUser();
    if (!error) user = data.user;
  } catch {
    user = null;
  }

  // redirect() is intentionally OUTSIDE the try so its control-flow throw is
  // never swallowed by the catch above.
  if (!user) redirect('/login');
  return user;
}
