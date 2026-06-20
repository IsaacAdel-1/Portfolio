import type { Metadata } from 'next';
import Sidebar from '@/components/dashboard/Sidebar';
import { requireUser } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Analytics — Isaac',
  robots: { index: false, follow: false },
};

// Never statically render or cache the dashboard — it is per-user, auth-gated
// data. Applies to this segment and everything nested under it.
export const dynamic = 'force-dynamic';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side auth gate (defense in depth — does not rely on middleware alone).
  await requireUser();

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-bg">
      <Sidebar />
      <main className="relative flex-1 min-w-0">
        {/* Subtle 40px grid across the main area */}
        <div className="absolute inset-0 dash-grid pointer-events-none" />
        <div className="relative p-6 md:p-8 lg:p-10">{children}</div>
      </main>
    </div>
  );
}
