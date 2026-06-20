export default function About() {
  return (
    <section
      id="about"
      className="px-[clamp(32px,7vw,130px)] py-20 border-t border-cobalt/10 relative"
    >
      <p className="reveal text-faint text-xs tracking-[2.5px] uppercase mb-2.5 font-medium">
        01 — About
      </p>
      <h2 className="reveal font-display text-[clamp(26px,4vw,34px)] font-semibold text-ink tracking-[-1px] mb-5">
        Self-taught, client-obsessed.
      </h2>
      <p className="reveal text-muted text-base leading-[1.75] max-w-[560px]">
        I&apos;m a frontend engineer based in Egypt, building production web apps
        with React and Next.js. From admin dashboards to client portfolios, I
        care about clean architecture and interfaces that actually ship.
      </p>
    </section>
  );
}
