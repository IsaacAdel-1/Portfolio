'use client';

import Image from 'next/image';
import { trackEvent } from '@/lib/track';

type Project = {
  /** Stable identifier sent with project_click events. */
  slug: string;
  img: string;
  alt: string;
  title: string;
  desc: string;
  tags: string[];
  /** Live demo / site URL. Empty for not-yet-launched placeholders. */
  href: string;
  /** When false, the card is a non-clickable "coming soon" placeholder. */
  live: boolean;
};

const projects: Project[] = [
  {
    slug: 'grees',
    img: '/proj-1.png',
    alt: 'Grees& — handcrafted furniture brand site',
    title: 'Grees&',
    desc: 'A warm, editorial storefront for a handcrafted furniture brand — calm, premium, and effortless to browse.',
    tags: ['Next.js', 'Tailwind', 'E-commerce'],
    href: 'https://grees-and.vercel.app/',
    live: true,
  },
  {
    slug: 'basma',
    img: '/proj-2.png',
    alt: 'Basma (بصمتي) — handmade wall-art store',
    title: 'Basma — بصمتي',
    desc: 'A right-to-left Arabic store for handmade wall art — turning your walls into a gallery of your story.',
    tags: ['Next.js', 'RTL / Arabic', 'E-commerce'],
    href: 'https://basma-one.vercel.app/',
    live: true,
  },
  {
    slug: 'avaris-media',
    img: '/avaris-video.png',
    alt: 'Avaris — media production & video editing company',
    title: 'Avaris Media',
    desc: 'A bold, cinematic site for a video production studio — aerial reels, services, and project intake.',
    tags: ['Next.js', 'Motion', 'Studio'],
    href: 'https://avaris-website.vercel.app/',
    live: true,
  },
  // Temporarily hidden — pending the company's permission (privacy).
  // Uncomment to bring it back.
  // {
  //   slug: 'radio-mazboot',
  //   img: '/proj-4.png',
  //   alt: 'Radio Mazboot (راديو مظبوط) — Arabic audio app',
  //   title: 'Radio Mazboot — راديو مظبوط',
  //   desc: 'A focused Arabic audio app for radio & recordings, deployed on Cloudflare Workers for instant global delivery.',
  //   tags: ['React', 'Cloudflare', 'Audio'],
  //   href: 'https://radio-mazboot.isaacerian5.workers.dev/',
  //   live: true,
  // },
  {
    slug: 'modernshop',
    img: '/proj-5.png',
    alt: 'ModernShop — e-commerce storefront',
    title: 'ModernShop',
    desc: 'A modern e-commerce storefront — collections, product search, and cart with a clean shopping flow.',
    tags: ['Next.js', 'E-commerce', 'Cart'],
    href: 'https://e-commerce-gold-eight-69.vercel.app/',
    live: true,
  },
  {
    slug: 'analytics-dashboard',
    img: '/proj-6.png',
    alt: 'Analytics Dashboard — admin dashboard',
    title: 'Analytics Dashboard',
    desc: 'An analytics admin dashboard — projects, clients, revenue trends, and product breakdowns at a glance.',
    tags: ['React', 'Dashboard', 'In progress'],
    href: '',
    live: false,
  },
  {
    slug: 'project-3',
    img: '/proj-3.png',
    alt: 'Upcoming project',
    title: 'Coming soon',
    desc: 'A new project — details landing soon.',
    tags: ['In progress'],
    href: '',
    live: false,
  },
];

const cardClass =
  'reveal group flex flex-col border border-cobalt/20 rounded-[14px] overflow-hidden bg-cobalt/[0.02] transition-all duration-300 ease-smooth';
const liveCardClass =
  'hover:-translate-y-[5px] hover:border-cobalt/50 hover:shadow-[0_18px_44px_rgba(0,0,0,0.45)]';

function CardInner({ p }: { p: Project }) {
  return (
    <>
      <div className="relative h-[170px] overflow-hidden border-b border-cobalt/20">
        <Image
          src={p.img}
          alt={p.alt}
          fill
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
          className={`object-cover object-top [filter:saturate(0.92)_brightness(0.92)] transition-transform duration-500 ease-smooth ${
            p.live ? 'group-hover:scale-[1.07]' : 'opacity-60'
          }`}
        />
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_top,rgba(6,10,20,0.7),rgba(56,138,221,0.12)_60%,transparent)]" />
      </div>
      <div className="flex-1 px-5 py-[18px]">
        <div className="flex justify-between items-center mb-[7px]">
          <span className="text-ink text-[17px] font-semibold">{p.title}</span>
          {p.live ? (
            <span className="text-cobalt text-[15px] transition-transform duration-300 ease-smooth group-hover:translate-x-[3px] group-hover:-translate-y-[3px]">
              ↗
            </span>
          ) : (
            <span className="text-faint text-[11px] tracking-[1px] uppercase">Soon</span>
          )}
        </div>
        <p className="text-muted text-[13px] leading-[1.55] mb-3">{p.desc}</p>
        <div className="flex gap-1.5 flex-wrap">
          {p.tags.map((t) => (
            <span
              key={t}
              className="text-[11px] text-faint border border-cobalt/30 px-[9px] py-[3px] rounded-md"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

export default function Projects() {
  return (
    <section
      id="work"
      className="px-[clamp(32px,7vw,130px)] py-20 border-t border-cobalt/10 relative"
    >
      <p className="reveal text-faint text-xs tracking-[2.5px] uppercase mb-2.5 font-medium">
        Selected work
      </p>
      <h2 className="reveal font-display text-[clamp(26px,4vw,34px)] font-semibold text-ink tracking-[-1px] mb-6">
        Projects.
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[18px]">
        {projects.map((p) =>
          p.live ? (
            <a
              key={p.slug}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('project_click', { projectSlug: p.slug })}
              className={`${cardClass} ${liveCardClass}`}
            >
              <CardInner p={p} />
            </a>
          ) : (
            <div key={p.slug} className={`${cardClass} cursor-default`} aria-disabled="true">
              <CardInner p={p} />
            </div>
          ),
        )}
      </div>
    </section>
  );
}
