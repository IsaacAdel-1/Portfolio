export default function EmptyState({
  label = 'No data for this range yet.',
  className = '',
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center min-h-[160px] text-faint text-sm ${className}`}
    >
      {label}
    </div>
  );
}
