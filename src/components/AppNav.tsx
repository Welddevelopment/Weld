'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { getBrowserSupabase, hasBrowserSupabaseConfig } from '@/lib/supabase/browser'

const NAV_LINKS = [
  { href: '/home', label: 'Home' },
  { href: '/profile', label: 'Profile' },
  { href: '/swipe', label: 'Match' },
  { href: '/preview', label: 'Preview' },
  { href: '/account', label: 'Account' },
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
    <nav className="nav-shell">
      <Link href="/home" className="nav-brand" aria-label="weld home">
        <span>weld</span>
        <span className="nav-brand-dot" aria-hidden />
      </Link>

      <div className="nav-links" role="navigation">
        {NAV_LINKS.map(({ href, label }) => {
          const active = pathname === href || pathname?.startsWith(`${href}/`)
          return (
            <Link
              key={href}
              href={href}
              className={`nav-link${active ? ' nav-link--active' : ''}`}
              aria-current={active ? 'page' : undefined}
            >
              {label}
            </Link>
          )
        })}
      </div>

      {email && <span className="nav-brand-email">{email}</span>}
    </nav>
  )
}
