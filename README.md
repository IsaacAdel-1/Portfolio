# Isaac — Portfolio (Next.js + Tailwind)

Personal portfolio site. Cyber-cobalt theme. Built with the App Router,
TypeScript, and Tailwind CSS.

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000

## Structure

```
app/
  layout.tsx      # fonts, metadata, global styles
  page.tsx        # composes all sections
  globals.css     # theme resets, grid bg, reveal animation
components/
  Background.tsx  # fixed grid + glow orbs
  Effects.tsx     # scroll reveal, animated counters, cursor spotlight (client)
  Nav.tsx         # sticky nav + mobile menu (client)
  Hero.tsx        # headline + stat cards
  About.tsx
  Skills.tsx      # stack cards with brand SVG logos
  Projects.tsx    # project cards (next/image)
  Contact.tsx
  Footer.tsx
```

## Analytics dashboard (`/dashboard`)

Private, authenticated admin view of portfolio traffic. Cyber-cobalt themed,
built with Recharts + Supabase auth.

```
app/dashboard/        layout (sidebar + grid), page (sections in Suspense), loading skeleton
app/login/            Supabase email/password sign-in
middleware.ts         protects /dashboard (redirects to /login when signed out)
lib/types.ts          analytics shapes the UI consumes
lib/mock-data.ts      believable mock, per date range
lib/analytics.ts      THE DATA SEAM — swap mock -> live here (one file)
lib/supabase/         server + browser clients
components/dashboard/  Sidebar, header, cards, sections, themed charts, skeletons
```

### Auth setup

1. Create a Supabase project → Settings → API.
2. `cp .env.local.example .env.local` and fill:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Authentication → Users → add yourself (email + password).
4. Restart `npm run dev`. `/dashboard` now redirects to `/login` unless signed in.

> Until those env vars are set, the dashboard is **open locally** (dev bypass in
> `middleware.ts`) so you can preview it.

### Live data (implemented)

The dashboard reads **real** aggregates from the Supabase `events` table, gated
by one env flag in [lib/analytics.ts](lib/analytics.ts):

- `NEXT_PUBLIC_ANALYTICS_LIVE=true` → live reads from `events`.
- unset / anything else → mock data (`buildMockDashboard`). **This is how you
  flip back to mock** — comment the var out (or set it to `false`) and restart.

Live reads use the **authenticated** server client ([lib/supabase/server.ts](lib/supabase/server.ts)),
so RLS (authenticated-only SELECT) permits them — you must be logged in. The
`service_role` key is never used. All output still matches `lib/types.ts`, so
there are **no UI changes**.

What's mapped from the current schema: visitors / page views (pageview rows),
project performance (project_click grouped by `project_slug`), traffic sources,
devices, and a per-day timeseries — all with trend % vs. the previous period.
`contact clicks` (not tracked yet) shows 0; `countries` (null) shows an empty
state; new-vs-returning treats everyone as new until `is_returning` is tracked.
Every section renders cleanly at 0 rows. Aggregation is in JS over the range's
rows (small dataset); swap `liveSource` for a Postgres RPC later if it grows.

## Analytics tracking (Umami)

Pageviews/events are sent to [Umami](https://umami.is) via its tracking script.
The script is wired in [components/Analytics.tsx](components/Analytics.tsx) and
rendered from the root layout.

**Production-only.** The component is a Server Component gated on
`process.env.NODE_ENV === "production"`, so the `<script>` is injected **only**
in production builds. On `npm run dev` (localhost) the tag is never added to the
HTML — your own dev visits never pollute the analytics.

Configured via two public env vars (see `.env.local.example`):

- `NEXT_PUBLIC_UMAMI_WEBSITE_ID` — your Umami website ID (required; if unset the
  script is skipped even in production).
- `NEXT_PUBLIC_UMAMI_SRC` — script host, optional, defaults to
  `https://cloud.umami.is/script.js`.

> `NEXT_PUBLIC_*` vars are inlined at build time, so set them in your host's
> build environment (e.g. Vercel project settings) for the deployed site.

**Verify:**

- Dev (absent): `npm run dev`, open http://localhost:3000, View Source — there
  is **no** `cloud.umami.is` script tag.
- Prod (present): `npm run build && npm start`, open http://localhost:3000, View
  Source — the `<script ... src="…/script.js" data-website-id="…">` tag **is**
  there.

## First-party event tracking (Supabase `events`)

Alongside Umami, the site writes its own visitor events into a Supabase
`events` table via [lib/track.ts](lib/track.ts) using the **public anon**
browser client (never `service_role`). This is the WRITE side only — the
dashboard still reads mock data (`LIVE = false` in
[lib/analytics.ts](lib/analytics.ts)) until reads are wired in a later step.

**v1 scope** — two event types: `pageview` (fired once on load of the public
portfolio `/`, never on `/dashboard` or `/login`) and `project_click` (fired
when a project card is clicked, with its `project_slug`). `source` and `device`
are derived client-side; `country` / `city` / `is_returning` / `duration_ms`
are left null/default for now.

**Dev sessions don't count by default.** Recording is gated:
`process.env.NODE_ENV === "production"` **OR**
`NEXT_PUBLIC_TRACK_EVENTS === "true"`. So `npm run dev` records nothing unless
you opt in.

**To test locally:** set `NEXT_PUBLIC_TRACK_EVENTS=true` in `.env.local`
(a commented line is already there to uncomment), restart `npm run dev`, then
load `/` or click a project.

**Verify rows land in Supabase:**

1. With recording enabled (prod build, or the dev flag above), load the
   portfolio `/` — that inserts one `pageview` row. Click a project card — that
   inserts a `project_click` row with `project_slug` set.
2. In Supabase → **Table Editor → `events`**, the new rows appear with
   `event_type`, `source`, `device`, and `created_at` populated (other columns
   null for now). Inserts work because RLS allows anon INSERT; the public site
   still can't SELECT.

> Tracking is fire-and-forget and fail-silent — a tracking error never throws,
> blocks navigation, or breaks the page.

## TODO (your real content)

- Replace project images/titles/descriptions in `components/Projects.tsx`
- Add your GitHub / LinkedIn / X links in `components/Contact.tsx`

> The original static design is kept as `isaac_portfolio_full_cyber_cobalt.html`.
