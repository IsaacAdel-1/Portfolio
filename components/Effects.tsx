'use client';

import { useEffect, useRef } from 'react';

export default function Effects() {
  const spot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // --- Scroll reveal ---
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll<HTMLElement>('.reveal').forEach((el, i) => {
      el.style.transitionDelay = `${(i % 6) * 60}ms`;
      io.observe(el);
    });

    // --- Animated counters ---
    const animateCount = (el: HTMLElement) => {
      const target = Number(el.dataset.count);
      const suffix = el.dataset.suffix ?? '';
      const dur = 1400;
      let start: number | null = null;
      const tick = (now: number) => {
        if (start === null) start = now;
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const countObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            animateCount(e.target as HTMLElement);
            countObs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    document
      .querySelectorAll<HTMLElement>('[data-count]')
      .forEach((el) => countObs.observe(el));

    // --- Cursor spotlight (desktop only) ---
    const fine = window.matchMedia('(pointer:fine)').matches;
    const onMove = (e: MouseEvent) => {
      if (!spot.current) return;
      spot.current.style.opacity = '1';
      spot.current.style.left = `${e.clientX}px`;
      spot.current.style.top = `${e.clientY}px`;
    };
    if (fine) window.addEventListener('mousemove', onMove);

    return () => {
      io.disconnect();
      countObs.disconnect();
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <div
      ref={spot}
      className="fixed w-[600px] h-[600px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[1] opacity-0 transition-opacity duration-300 bg-[radial-gradient(circle,rgba(56,138,221,0.07),transparent_60%)]"
    />
  );
}
