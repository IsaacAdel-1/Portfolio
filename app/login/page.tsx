import { Suspense } from 'react';
import type { Metadata } from 'next';
import Logo from '@/components/Logo';
import LoginForm from '@/components/LoginForm';

export const metadata: Metadata = {
  title: 'Sign in — Isaac Analytics',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
      <div className="absolute inset-0 dash-grid opacity-60" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] dash-header-glow pointer-events-none" />

      <div className="relative z-10 w-full max-w-[380px]">
        <div className="flex flex-col items-center mb-7">
          <Logo />
          <p className="mt-4 text-[12px] tracking-[2px] uppercase text-faint">
            Analytics · Private
          </p>
        </div>

        <div className="bg-surface border-[0.5px] border-cobalt/20 rounded-xl p-7">
          <h1 className="text-ink text-xl font-medium tracking-[-0.5px] mb-1">
            Sign in
          </h1>
          <p className="text-muted text-[13px] mb-6">
            This dashboard is private. Sign in to continue.
          </p>

          <Suspense fallback={<div className="h-[220px]" />}>
            <LoginForm />
          </Suspense>
        </div>

        <p className="text-center text-faint text-[12px] mt-6">
          <a href="/" className="hover:text-cobalt transition-colors">
            ← Back to site
          </a>
        </p>
      </div>
    </main>
  );
}
