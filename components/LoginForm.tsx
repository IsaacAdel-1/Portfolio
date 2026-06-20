'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get('redirect') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        setError(signInError.message);
        return;
      }
      router.push(redirect);
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="text-center">
        <p className="text-muted text-sm leading-relaxed mb-6">
          Supabase isn&apos;t configured yet, so authentication is disabled in
          development. Add your keys to{' '}
          <code className="text-cobalt">.env.local</code> to lock this down.
        </p>
        <a
          href={redirect}
          className="inline-block bg-cobalt text-bg text-sm font-medium px-6 py-3 rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(56,138,221,0.35)]"
        >
          Continue to dashboard →
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-[12px] tracking-[2px] uppercase text-faint">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-bg border-[0.5px] border-cobalt/25 rounded-lg px-3.5 py-2.5 text-ink text-sm outline-none transition-colors focus:border-cobalt placeholder:text-faint/60"
          placeholder="you@example.com"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-[12px] tracking-[2px] uppercase text-faint">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-bg border-[0.5px] border-cobalt/25 rounded-lg px-3.5 py-2.5 text-ink text-sm outline-none transition-colors focus:border-cobalt placeholder:text-faint/60"
          placeholder="••••••••"
        />
      </div>

      {error && (
        <p className="text-negative text-[13px] leading-snug -mt-1">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-1 bg-cobalt text-bg text-sm font-medium px-6 py-3 rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(56,138,221,0.35)] disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none"
      >
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
