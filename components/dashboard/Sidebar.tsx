'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Logo from '@/components/Logo';
import RangeSelector from './RangeSelector';
import SignOutButton from './SignOutButton';

type NavItem = { id: string; label: string; icon: ReactNode };

const ICON = 'w-[16px] h-[16px]';

const items: NavItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={ICON}>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={ICON}>
        <line x1="4" y1="20" x2="4" y2="12" />
        <line x1="10" y1="20" x2="10" y2="6" />
        <line x1="16" y1="20" x2="16" y2="9" />
        <line x1="20" y1="20" x2="4" y2="20" />
      </svg>
    ),
  },
  {
    id: 'traffic',
    label: 'Traffic',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={ICON}>
        <path d="M21 12a9 9 0 1 1-9-9" />
        <path d="M12 12 21 3" />
        <path d="M12 3v9h9" opacity="0.5" />
      </svg>
    ),
  },
  {
    id: 'visitors',
    label: 'Visitors',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={ICON}>
        <circle cx="9" cy="8" r="3.2" />
        <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
        <path d="M16 5.2a3 3 0 0 1 0 5.6" opacity="0.6" />
        <path d="M17.5 14.2A5.5 5.5 0 0 1 20.5 19" opacity="0.6" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const [active, setActive] = useState('overview');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 },
    );
    items.forEach((it) => {
      const el = document.getElementById(it.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <aside className="z-40 bg-surface border-cobalt/15 border-b md:border-b-0 md:border-r md:sticky md:top-0 md:h-screen md:w-[220px] md:shrink-0 flex flex-col">
      <div className="px-5 py-5">
        <Logo />
      </div>

      <nav className="px-3 flex md:flex-col gap-1 overflow-x-auto">
        {items.map((it) => {
          const isActive = active === it.id;
          return (
            <a
              key={it.id}
              href={`#${it.id}`}
              onClick={() => setActive(it.id)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13.5px] shrink-0 transition-colors border-[0.5px] ${
                isActive
                  ? 'bg-cobalt/10 text-ink border-cobalt/30'
                  : 'text-muted hover:text-ink hover:bg-cobalt/5 border-transparent'
              }`}
            >
              <span className={isActive ? 'text-cobalt' : 'text-faint'}>{it.icon}</span>
              {it.label}
            </a>
          );
        })}
      </nav>

      <div className="px-4 py-4 md:mt-auto flex flex-col gap-3">
        <div>
          <p className="text-[11px] tracking-[2px] uppercase text-faint mb-2">Date range</p>
          <RangeSelector />
        </div>
        <SignOutButton />
      </div>
    </aside>
  );
}
