const stats = [
  { count: 15, suffix: '+', label: 'Projects shipped' },
  { count: 3, suffix: '+', label: 'Years coding' },
  { count: 100, suffix: '%', label: 'Client focus' },
];

export default function Hero() {
  return (
    <section className="min-h-[calc(100vh-74px)] flex flex-col justify-center px-[clamp(32px,7vw,130px)] pt-12 pb-14 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.6fr] gap-14 items-center">
        {/* Left */}
        <div>
          <span className="reveal inline-flex items-center gap-2.5 text-faint text-[13px] tracking-[3px] uppercase mb-[18px]">
            <span className="w-[7px] h-[7px] rounded-full bg-[#3ad17a] animate-pulse2" />
            Frontend Engineer · Available for work
          </span>

          <h1 className="reveal font-display text-[clamp(46px,8vw,86px)] font-bold tracking-[-3px] leading-[0.95] text-ink">
            Isaac
            <br />
            <span className="bg-gradient-to-r from-cobalt via-cobalt-bright to-[#7bc0ff] bg-clip-text text-transparent">
              builds the web.
            </span>
          </h1>

          <p className="reveal text-muted text-[clamp(15px,2.4vw,18px)] max-w-[540px] leading-[1.65] mt-6 mb-9">
            React · Next.js · TypeScript. Interfaces that feel fast, look sharp,
            and ship clean.
          </p>

          <div className="reveal flex gap-4 items-center flex-wrap">
            <a
              href="#work"
              className="bg-cobalt text-bg text-[14.5px] font-semibold px-7 py-[14px] rounded-[9px] transition-all duration-300 ease-smooth hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(56,138,221,0.35)]"
            >
              See my work →
            </a>
            <a
              href="#contact"
              className="text-faint text-[14.5px] pb-[3px] border-b border-faint transition-colors hover:text-ink hover:border-ink"
            >
              Get in touch
            </a>
          </div>
        </div>

        {/* Right — stat cards */}
        <div className="flex gap-3.5 flex-col sm:flex-row lg:flex-col lg:max-w-[300px] lg:ml-auto w-full">
          {stats.map((s) => (
            <div
              key={s.label}
              className="reveal group relative overflow-hidden flex-1 flex flex-col gap-1 border border-cobalt/25 rounded-[14px] px-[26px] py-6 bg-cobalt/[0.03] transition-all duration-300 ease-smooth hover:translate-x-1.5 hover:border-cobalt/55 hover:bg-cobalt/[0.07]"
            >
              <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-cobalt to-cobalt-bright opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span
                className="num font-display text-[42px] text-ink font-bold tracking-[-1.5px] leading-none"
                data-count={s.count}
                data-suffix={s.suffix}
              >
                0
              </span>
              <span className="text-[13px] text-faint tracking-[0.3px]">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
