import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from '@/lib/auth';

/** Default-deny response. API routes get a 401; pages redirect to /login. */
function deny(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const url = request.nextUrl.clone();
  url.pathname = '/login';
  url.searchParams.set('redirect', request.nextUrl.pathname + request.nextUrl.search);
  return NextResponse.redirect(url);
}

export async function middleware(request: NextRequest) {
  // --- No Supabase configured ---------------------------------------------
  if (!isSupabaseConfigured) {
    // Dev-only preview bypass. In a production build NODE_ENV is the literal
    // 'production', so this branch is statically false and is stripped out —
    // there is no reachable code path that serves the dashboard without auth.
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.next();
    }
    return deny(request); // fail closed
  }

  // --- Configured: verify the session, failing closed on ANY error ---------
  let response = NextResponse.next({ request });
  try {
    const supabase = createServerClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    });

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) return deny(request);
    return response;
  } catch {
    // Supabase unreachable / unexpected failure -> deny, never fall through.
    return deny(request);
  }
}

export const config = {
  // Every dashboard route (top-level + nested) and any dashboard data API.
  matcher: ['/dashboard', '/dashboard/:path*', '/api/dashboard/:path*'],
};
