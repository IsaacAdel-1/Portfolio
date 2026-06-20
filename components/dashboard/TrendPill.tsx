export default function TrendPill({ changePct }: { changePct: number }) {
  if (changePct === 0) {
    return <span className="text-faint text-[12px]">— no change</span>;
  }
  const up = changePct > 0;
  return (
    <span
      className={`inline-flex items-center gap-1 text-[12px] font-medium px-2 py-0.5 rounded-full ${
        up ? 'text-positive bg-positive/10' : 'text-negative bg-negative/10'
      }`}
    >
      {up ? '↑' : '↓'} {Math.abs(changePct)}%
    </span>
  );
}
