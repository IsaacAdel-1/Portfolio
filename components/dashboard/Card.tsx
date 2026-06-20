import type { ReactNode } from 'react';

export default function Card({
  children,
  id,
  featured = false,
  className = '',
}: {
  children: ReactNode;
  id?: string;
  featured?: boolean;
  className?: string;
}) {
  return (
    <div
      id={id}
      className={`bg-surface rounded-xl transition-colors ${
        featured
          ? 'border-2 border-cobalt'
          : 'border-[0.5px] border-cobalt/20 hover:border-cobalt/30'
      } ${className}`}
    >
      {children}
    </div>
  );
}
