'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import AppNav from '@/components/AppNav'
import { getBrowserSupabase, hasBrowserSupabaseConfig } from '@/lib/supabase/browser'

type Tile = {
  href: string
  kicker: string
  title: string
  body: string
  cta: string
  tone?: 'orange' | 'green' | 'blue'
  soon?: boolean
  icon: React.ReactNode
}

const TILES: Tile[] = [
  {
    href: '/profile',
    kicker: 'Identity',
    title: 'Build your profile',
    body: 'Show shipped work, rates, and availability so studios can find you without a Discord beg.',
    cta: 'Open builder',
    tone: 'orange',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="3.6" />
        <path d="M4 20c1.6-3.6 4.6-5.4 8-5.4S18.4 16.4 20 20" />
      </svg>
    ),
  },
  {
    href: '/swipe',
    kicker: 'Discovery',
    title: 'Match the pool',
    body: 'Swipe through Roblox-native developers and studios. Like, pass, talk to fits.',
    cta: 'Start matching',
    tone: 'green',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.8 4.6a5 5 0 0 0-7 0L12 6.4l-1.8-1.8a5 5 0 0 0-7 7l8.8 8.8 8.8-8.8a5 5 0 0 0 0-7z" />
      </svg>
    ),
  },
  {
    href: '/preview',
    kicker: 'Preview',
    title: 'Tour the matching feed',
    body: 'See exactly how studios will see you. Toggle developer / studio mode and tune filters.',
    cta: 'Open preview',
    tone: 'blue',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1.5 12s4-8 10.5-8 10.5 8 10.5 8-4 8-10.5 8S1.5 12 1.5 12z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    href: '/account',
    kicker: 'Account',
    title: 'Account & sign-out',
    body: 'Manage your session and the email attached to your draft.',
    cta: 'Open account',
    tone: 'orange',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
  },
  {
    href: '#',
    kicker: 'Soon',
    title: 'Threads & briefs',
    body: 'Direct messages, scoped briefs, and contract handoff are landing in the next pass.',
    cta: 'Coming next',
    tone: 'green',
    soon: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a4 4 0 0 1-4 4H8l-5 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8z" />
      </svg>
    ),
  },
  {
    href: '#',
    kicker: 'Soon',
    title: 'Studio briefs',
    body: 'Post a paid brief, get matched developers in 48h. In private beta with select studios.',
    cta: 'Request access',
    tone: 'blue',
    soon: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7h18v12H3z" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
    ),
  },
]

export default function HomePage() {
  const [name, setName] = useState<string | null>(null)

  useEffect(() => {
    if (!hasBrowserSupabaseConfig()) return
    const supabase = getBrowserSupabase()
    supabase.auth.getSession().then(({ data }) => {
      const email = data.session?.user.email ?? null
      if (email) setName(email.split('@')[0])
    })
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <AppNav />
      <main className="dash-shell">
        <span className="dash-grain" aria-hidden />
        <div className="dash-wrap">
          <header className="dash-hero">
            <span className="dash-eyebrow">Live · weld console</span>
            <h1 className="dash-title">
              {name ? <>Welcome back, <em>{name}</em>.</> : <>Get found <em>without begging</em> in Discord threads.</>}
            </h1>
            <p className="dash-sub">
              Pick up where you left off. Build your profile, tune your matching feed, and put shipped work in front of the studios that pay.
            </p>
          </header>

          <section className="dash-stats" aria-label="status">
            <div>
              <span className="dash-stat-label">Profile</span>
              <span className="dash-stat-value">Draft</span>
            </div>
            <div>
              <span className="dash-stat-label">Matches</span>
              <span className="dash-stat-value">0</span>
            </div>
            <div>
              <span className="dash-stat-label">Threads</span>
              <span className="dash-stat-value">—</span>
            </div>
            <div>
              <span className="dash-stat-label">Status</span>
              <span className="dash-stat-value" style={{ color: '#9DFFCB' }}>Ready</span>
            </div>
          </section>

          <section className="dash-grid">
            {TILES.map(t => {
              const Wrapper = t.soon ? 'div' : Link
              const wrapperProps = t.soon ? {} : { href: t.href }
              return (
                <Wrapper
                  key={t.title}
                  {...(wrapperProps as { href: string })}
                  className={`dash-card${t.tone ? ` dash-card--${t.tone}` : ''}${t.soon ? ' dash-card--soon' : ''}`}
                >
                  <span className="dash-card-icon" aria-hidden>{t.icon}</span>
                  <span className="dash-card-kicker">{t.kicker}</span>
                  <h2 className="dash-card-title">{t.title}</h2>
                  <p className="dash-card-body">{t.body}</p>
                  <span className="dash-card-cta">{t.cta} <span aria-hidden>→</span></span>
                </Wrapper>
              )
            })}
          </section>
        </div>
      </main>
    </div>
  )
}
