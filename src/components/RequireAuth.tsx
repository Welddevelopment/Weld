'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { getBrowserSupabase, hasBrowserSupabaseConfig } from '@/lib/supabase/browser'

type AuthStatus = 'loading' | 'authed' | 'unauthed'

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading')

  useEffect(() => {
    if (!hasBrowserSupabaseConfig()) {
      setStatus('unauthed')
      return
    }
    const supabase = getBrowserSupabase()
    supabase.auth.getSession().then(({ data }) => {
      setStatus(data.session ? 'authed' : 'unauthed')
    })
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setStatus(session ? 'authed' : 'unauthed')
    })
    return () => data.subscription.unsubscribe()
  }, [])

  if (status === 'loading') return null

  if (status === 'unauthed') {
    return (
      <div className="flex flex-col items-center justify-center gap-5 py-32">
        <p className="font-mono text-sm text-white/50">
          You need to be logged in to view this page.
        </p>
        <Link
          href="/login"
          className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.13em] text-white/60 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white/90"
        >
          Log in →
        </Link>
      </div>
    )
  }

  return <>{children}</>
}
