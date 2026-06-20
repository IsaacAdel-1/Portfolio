import Image from 'next/image';

type Project = {
  img: string;
  alt: string;
  title: string;
  desc: string;
  tags: string[];
};

const projects: Project[] = [
  {
    img: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=700&q=80',
    alt: 'Code on a screen',
    title: 'Project name',
    desc: 'Short description of what you built and the impact it had.',
    tags: ['Next.js', 'Tailwind'],
  },
  {
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=700&q=80',
    alt: 'Analytics dashboard',
    title: 'Project name',
    desc: 'Placeholder description of the project and its impact.',
    tags: ['React'],
  },
  {
    img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=700&q=80',
    alt: 'Source code editor',
    title: 'Project name',
    desc: 'Placeholder description of the project and its impact.',
    tags: ['Supabase'],
  },
  {
    img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=700&q=80',
    alt: 'Developer workspace',
    title: 'Project name',
    desc: 'Placeholder description of the project and its impact.',
    tags: ['TypeScript'],
  },
];

export default function Projects() {
  return (
    <section
      id="work"
      className="px-[clamp(32px,7vw,130px)] py-20 border-t border-cobalt/10 relative"
    >
      <p className="reveal text-faint text-xs tracking-[2.5px] uppercase mb-2.5 font-medium">
        03 — Selected work
      </p>
      <h2 className="reveal font-display text-[clamp(26px,4vw,34px)] font-semibold text-ink tracking-[-1px] mb-6">
        Projects.
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[18px]">
        {projects.map((p, i) => (
          <a
            key={i}
            href="#"
            className="reveal group flex flex-col border border-cobalt/20 rounded-[14px] overflow-hidden bg-cobalt/[0.02] transition-all duration-300 ease-smooth hover:-translate-y-[5px] hover:border-cobalt/50 hover:shadow-[0_18px_44px_rgba(0,0,0,0.45)]"
          >
            <div className="relative h-[170px] overflow-hidden border-b border-cobalt/20">
              <Image
                src={p.img}
                alt={p.alt}
                fill
                sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
                className="object-cover [filter:saturate(0.92)_brightness(0.92)] transition-transform duration-500 ease-smooth group-hover:scale-[1.07]"
              />
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_top,rgba(6,10,20,0.7),rgba(56,138,221,0.12)_60%,transparent)]" />
            </div>
            <div className="flex-1 px-5 py-[18px]">
              <div className="flex justify-between items-center mb-[7px]">
                <span className="text-ink text-[17px] font-semibold">
                  {p.title}
                </span>
                <span className="text-cobalt text-[15px] transition-transform duration-300 ease-smooth group-hover:translate-x-[3px] group-hover:-translate-y-[3px]">
                  ↗
                </span>
              </div>
              <p className="text-muted text-[13px] leading-[1.55] mb-3">
                {p.desc}
              </p>
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
          </a>
        ))}
      </div>
    </section>
  );
}
