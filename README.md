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

### Going live (real data)

Edit **only** `lib/analytics.ts`. Flip `LIVE = true` and implement the reads
against a Supabase `events` table (schema documented at the top of that file)
or Umami's API. The shapes in `lib/types.ts` stay the same, so no UI changes.

## TODO (your real content)

- Replace project images/titles/descriptions in `components/Projects.tsx`
- Add your GitHub / LinkedIn / X links in `components/Contact.tsx`

> The original static design is kept as `isaac_portfolio_full_cyber_cobalt.html`.
