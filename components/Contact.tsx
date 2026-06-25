const socials = [
  { label: 'Email', href: 'mailto:isaacerian5@gmail.com', external: false },
  { label: 'GitHub', href: 'https://github.com/IsaacAdel-1', external: true },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/isaac-adel-359343415/',
    external: true,
  },
  { label: 'WhatsApp', href: 'https://wa.me/201500934506', external: true },
];

export default function Contact() {
  return (
    <section
      id="contact"
      className="overflow-hidden px-[clamp(32px,7vw,130px)] py-20 border-t border-cobalt/10 relative"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left — About */}
        <div id="about">
          <p className="reveal text-faint text-xs tracking-[2.5px] uppercase mb-2.5 font-medium">
            About
          </p>
          <h2 className="reveal font-display text-[clamp(26px,4vw,34px)] font-semibold text-ink tracking-[-1px] mb-4">
            Self-taught, client-obsessed.
          </h2>
          <p className="reveal text-muted text-base leading-[1.75] max-w-[480px]">
            Frontend engineer based in Egypt, building production web apps with
            React &amp; Next.js — clean architecture and interfaces that actually
            ship.
          </p>
        </div>

        {/* Right — Contact */}
        <div className="lg:pl-12 lg:border-l border-cobalt/10">
          <p className="reveal text-faint text-xs tracking-[2.5px] uppercase mb-2.5 font-medium">
            Contact
          </p>
          <h2 className="reveal font-display text-[clamp(26px,4vw,34px)] font-semibold text-ink tracking-[-1px] mb-3.5">
            Let&apos;s build something.
          </h2>
          <p className="reveal text-muted text-base max-w-[420px] mb-7">
            Got a project in mind? I&apos;m open for freelance and full-time work.
          </p>

          <div className="reveal flex gap-3.5 flex-wrap">
            <a
              href="mailto:isaacerian5@gmail.com"
              className="bg-cobalt text-bg text-[15px] font-semibold px-8 py-[14px] rounded-[9px] transition-all duration-300 ease-smooth hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(56,138,221,0.35)]"
            >
              Say hello →
            </a>
          </div>

          <div className="reveal mt-[30px] flex gap-[22px] flex-wrap">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                {...(s.external
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
                className="text-faint text-[13px] hover:text-cobalt transition-colors"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
