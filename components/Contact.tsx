const socials = [
  { label: 'Email', href: 'mailto:samyadel99901@gmail.com', external: false },
  { label: 'GitHub', href: '#', external: true },
  { label: 'LinkedIn', href: '#', external: true },
  { label: 'X / Twitter', href: '#', external: true },
];

export default function Contact() {
  return (
    <section
      id="contact"
      className="text-center overflow-hidden px-[clamp(32px,7vw,130px)] py-20 border-t border-cobalt/10 relative"
    >
      <p className="reveal text-faint text-xs tracking-[2.5px] uppercase mb-2.5 font-medium">
        04 — Contact
      </p>
      <h2 className="reveal font-display text-[clamp(28px,5vw,38px)] font-semibold text-ink tracking-[-1px] mb-3.5">
        Let&apos;s build something.
      </h2>
      <p className="reveal text-muted text-base max-w-[400px] mx-auto mb-7">
        Got a project in mind? I&apos;m open for freelance and full-time work.
      </p>

      <div className="reveal flex gap-3.5 justify-center flex-wrap">
        <a
          href="mailto:samyadel99901@gmail.com"
          className="bg-cobalt text-bg text-[15px] font-semibold px-8 py-[14px] rounded-[9px] transition-all duration-300 ease-smooth hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(56,138,221,0.35)]"
        >
          Say hello →
        </a>
      </div>

      <div className="reveal mt-[34px] flex gap-[22px] justify-center flex-wrap">
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
    </section>
  );
}
