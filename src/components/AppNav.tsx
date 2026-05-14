'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { getBrowserSupabase, hasBrowserSupabaseConfig } from '@/lib/supabase/browser'

const NAV_LINKS = [
  { href: '/home', label: 'Home' },
  { href: '/messages', label: 'Messages' },
  { href: '/account', label: 'Account' },
  { href: '/profile', label: 'Profile' },
  { href: '/swipe', label: 'Swipe' },
  { href: '/preview', label: 'Preview' },
]

const TESTER_EMAILS = new Set(['joeljeon7@gmail.com'])

export default function AppNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(null)
  const [toast, setToast] = useState(false)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

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

  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current) }, [])

  function handleNavClick(href: string) {
    if (email && TESTER_EMAILS.has(email)) {
      router.push(href)
      return
    }
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast(true)
    toastTimer.current = setTimeout(() => setToast(false), 3200)
  }

  async function handleSignOut() {
    if (!hasBrowserSupabaseConfig()) return
    await getBrowserSupabase().auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <>
    <nav className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-[rgba(8,24,39,0.08)] bg-[rgba(251,252,255,0.88)] px-6 py-4 backdrop-blur-[12px]">
      <div className="flex flex-col">
        <Link
          href="/home"
          className="font-display text-2xl italic tracking-[-0.05em] text-[#081827]"
        >
          weld.
        </Link>
        {email && (
          <span className="font-mono text-[10px] tracking-[0.08em] text-[rgba(8,24,39,0.42)]">{email}</span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {NAV_LINKS.map(({ href, label }) => {
          const active = pathname === href
          return (
            <button
              key={href}
              type="button"
              onClick={() => handleNavClick(href)}
              className={`rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.13em] transition ${
                active
                  ? 'border-[rgba(18,103,216,0.3)] bg-[rgba(18,103,216,0.08)] text-[#1267d8]'
                  : 'border-[rgba(8,24,39,0.10)] bg-[rgba(8,24,39,0.03)] text-[rgba(8,24,39,0.55)] hover:border-[rgba(8,24,39,0.18)] hover:bg-[rgba(8,24,39,0.06)] hover:text-[#081827]'
              }`}
            >
              {label}
            </button>
          )
        })}

        <div className="ml-2 h-4 w-px bg-[rgba(8,24,39,0.10)]" />

        {email ? (
          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-full border border-[rgba(8,24,39,0.10)] bg-[rgba(8,24,39,0.03)] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.13em] text-[rgba(8,24,39,0.55)] transition hover:border-[rgba(8,24,39,0.18)] hover:bg-[rgba(8,24,39,0.06)] hover:text-[#081827]"
          >
            Sign out
          </button>
        ) : (
          <Link
            href="/login"
            className="rounded-full border border-[rgba(8,24,39,0.10)] bg-[rgba(8,24,39,0.03)] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.13em] text-[rgba(8,24,39,0.55)] transition hover:border-[rgba(8,24,39,0.18)] hover:bg-[rgba(8,24,39,0.06)] hover:text-[#081827]"
          >
            Log in
          </Link>
        )}
      </div>
    </nav>
    <div aria-hidden="true" className="h-[65px] shrink-0" />

    <div
      style={{
        position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)',
        zIndex: 9999, pointerEvents: 'none',
        transition: 'opacity 0.25s ease, transform 0.25s ease',
        opacity: toast ? 1 : 0,
        translate: toast ? '0 0' : '0 8px',
      }}
    >
      <div style={{
        background: 'rgba(8,24,39,0.88)', backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.10)', borderRadius: 999,
        padding: '10px 20px', whiteSpace: 'nowrap',
        fontFamily: 'var(--font-mono)', fontSize: 11,
        letterSpacing: '0.08em', color: 'rgba(255,255,255,0.82)',
      }}>
        Coming soon — this feature will be available at full launch.
      </div>
    </div>
    </>
  )
}
