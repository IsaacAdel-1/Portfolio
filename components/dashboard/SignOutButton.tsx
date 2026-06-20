'use client';

import { useRouter } from 'next/navigation';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

export default function SignOutButton() {
  const router = useRouter();

  // Nothing to sign out of when auth is disabled in dev.
  if (!isSupabaseConfigured) return null;

  async function signOut() {
    await createClient().auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={signOut}
      className="w-full text-left text-[13px] text-muted hover:text-ink transition-colors px-3 py-2 rounded-lg hover:bg-cobalt/5 border-[0.5px] border-transparent hover:border-cobalt/20"
    >
      Sign out
    </button>
  );
}
