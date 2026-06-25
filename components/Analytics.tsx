import Script from 'next/script';

/**
 * Umami analytics tracking script.
 *
 * Renders only in production builds (`NODE_ENV === "production"`), so local
 * `npm run dev` visits never send events. This is a Server Component — the
 * gate runs on the server, so in dev the <Script> is never added to the tree
 * and the tag is absent from the rendered HTML (not just hidden).
 *
 * The website ID and src are read from NEXT_PUBLIC_* env vars (public by
 * design — the ID is meant to live in client-side HTML).
 */
export default function Analytics() {
  if (process.env.NODE_ENV !== 'production') return null;

  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  if (!websiteId) return null;

  const src =
    process.env.NEXT_PUBLIC_UMAMI_SRC ?? 'https://cloud.umami.is/script.js';

  return (
    <Script
      src={src}
      data-website-id={websiteId}
      strategy="afterInteractive"
      defer
    />
  );
}
