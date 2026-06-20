'use client';

import { useState } from 'react';
import Logo from './Logo';

const links = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between w-full px-[clamp(22px,7vw,130px)] py-[18px] border-b border-cobalt/20 bg-bg/70 backdrop-blur-[14px]">
      <a href="#top" aria-label="Isaac — home">
        <Logo />
      </a>

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle menu"
        className="md:hidden flex flex-col gap-[5px] p-1.5 z-50"
      >
        <span
          className={`w-[22px] h-0.5 bg-ink rounded transition-all duration-300 ${open ? 'translate-y-[7px] rotate-45' : ''}`}
        />
        <span
          className={`w-[22px] h-0.5 bg-ink rounded transition-all duration-300 ${open ? 'opacity-0' : ''}`}
        />
        <span
          className={`w-[22px] h-0.5 bg-ink rounded transition-all duration-300 ${open ? '-translate-y-[7px] -rotate-45' : ''}`}
        />
      </button>

      <div
        className={`flex items-center md:gap-7
          max-md:absolute max-md:top-full max-md:right-[22px] max-md:left-[22px] max-md:mt-2.5
          max-md:flex-col max-md:items-start max-md:gap-1 max-md:rounded-xl max-md:border max-md:border-cobalt/20
          max-md:bg-bgsoft max-md:px-[18px] max-md:py-[14px] max-md:shadow-[0_18px_40px_rgba(0,0,0,0.5)] max-md:transition-all max-md:duration-300
          ${open
            ? 'max-md:opacity-100 max-md:translate-y-0 max-md:pointer-events-auto'
            : 'max-md:opacity-0 max-md:-translate-y-2 max-md:pointer-events-none'}`}
      >
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            className="text-[13.5px] text-muted hover:text-ink transition-colors max-md:py-2 max-md:w-full"
          >
            {l.label}
          </a>
        ))}
        <a
          href="#contact"
          onClick={() => setOpen(false)}
          className="text-bg bg-cobalt px-[17px] py-2 rounded-lg font-semibold transition-all duration-300 ease-smooth hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(56,138,221,0.35)] max-md:mt-1.5"
        >
          Contact
        </a>
      </div>
    </nav>
  );
}
