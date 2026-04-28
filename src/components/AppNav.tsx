'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { getBrowserSupabase, hasBrowserSupabaseConfig } from '@/lib/supabase/browser'

const NAV_LINKS = [
  { href: '/home', label: 'Home' },
  { href: '/account', label: 'Account' },
  { href: '/profile', label: 'Profile' },
  { href: '/swipe', label: 'Match' },
  { href: '/preview', label: 'Preview' },
]

export default function AppNav() {
  const pathname = usePathname()
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
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-white/10 bg-[rgba(12,14,15,0.92)] px-6 py-4 backdrop-blur-[12px]">
      <div className="flex flex-col">
        <Link
          href="/home"
          className="font-display text-2xl italic tracking-[-0.05em] text-white/90"
        >
          weld.
        </Link>
        {email && (
          <span className="font-mono text-[10px] tracking-[0.08em] text-white/40">{email}</span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {NAV_LINKS.map(({ href, label }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.13em] transition ${
                active
                  ? 'border-white/25 bg-white/[0.10] text-white/95'
                  : 'border-white/10 bg-white/[0.04] text-white/70 hover:border-white/20 hover:bg-white/[0.08] hover:text-white/90'
              }`}
            >
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
