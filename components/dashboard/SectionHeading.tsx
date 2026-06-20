import type { ReactNode } from 'react';

export default function SectionHeading({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 mb-4">
      <div>
        <h2 className="text-ink text-[15px] font-medium tracking-[-0.3px]">{title}</h2>
        {subtitle && <p className="text-faint text-[12px] mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
