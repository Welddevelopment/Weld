'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { getBrowserSupabase, hasBrowserSupabaseConfig } from '@/lib/supabase/browser'

export default function HomePage() {
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    if (!hasBrowserSupabaseConfig()) return
    const supabase = getBrowserSupabase()
    supabase.auth.getSession().then(({ data }) => {
      setEmail(data.session?.user.email ?? null)
    })
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user.email ?? null)
    })
    return () => data.subscription.unsubscribe()
  }, [])

  return (
    <>
      <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-white/10 bg-[rgba(12,14,15,0.92)] px-6 py-4 backdrop-blur-[12px]">
        <div className="flex flex-col">
          <Link
            href="/"
            className="font-display text-2xl italic tracking-[-0.05em] text-white/90"
          >
            weld.
          </Link>
          {email && (
            <span className="font-mono text-[10px] tracking-[0.08em] text-white/40">
              {email}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/account"
            className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.13em] text-white/70 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white/90"
          >
            Account
          </Link>
          <Link
            href="/profile"
            className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.13em] text-white/70 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white/90"
          >
            Profile
          </Link>
          <Link
            href="/swipe"
            className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.13em] text-white/70 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white/90"
          >
            Match
          </Link>
        </div>
      </nav>

      <main className="flex min-h-screen flex-col items-center justify-center bg-[#0c0e0f] text-white/60">
        <p className="font-mono text-sm uppercase tracking-[0.16em]">More coming soon</p>
      </main>
    </>
  )
}
