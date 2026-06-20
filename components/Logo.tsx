export default function Logo() {
  return (
    <span className="group inline-flex items-center font-display text-[20px] font-semibold tracking-[-0.5px] text-ink">
      Isaac
      {/* Hollow cobalt ring — scales with the text (~28% of font-size) */}
      <span className="ml-1 mb-px inline-block h-[6px] w-[6px] rounded-full border-[1.5px] border-cobalt transition-colors duration-300 group-hover:bg-cobalt" />
    </span>
  );
}
