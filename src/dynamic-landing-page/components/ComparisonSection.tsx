'use client'

import { useLayoutEffect, useRef, useState, useEffect } from 'react'

type RegionKey = 'rate' | 'bio' | 'socials' | 'games' | 'mywork'
type ThreadKey = 'rate' | 'pitch' | 'games' | 'mywork'

const REGION_TO_THREAD: Record<RegionKey, ThreadKey> = {
  rate: 'rate',
  bio: 'pitch',
  socials: 'pitch',
  games: 'games',
  mywork: 'mywork',
}

const THREAD_TO_REGIONS: Record<ThreadKey, RegionKey[]> = {
  rate: ['rate'],
  pitch: ['bio', 'socials'],
  games: ['games'],
  mywork: ['mywork'],
}

type HoveredKey = RegionKey | ThreadKey

function isRegionKey(k: HoveredKey): k is RegionKey {
  return ['rate', 'bio', 'socials', 'games', 'mywork'].includes(k)
}

function getActiveThread(hovered: HoveredKey): ThreadKey {
  if (isRegionKey(hovered)) return REGION_TO_THREAD[hovered]
  return hovered as ThreadKey
}

function getActiveRegions(hovered: HoveredKey): RegionKey[] {
  const thread = getActiveThread(hovered)
  return THREAD_TO_REGIONS[thread]
}

// ── Icons (reused from SwipeCard) ─────────────────────────────────────────────

function IconRoblox() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M5.24 0 0 18.75 18.76 24 24 5.25ZM15.1 15.17l-6.35-1.7 1.7-6.35 6.35 1.7Z" />
    </svg>
  )
}

function IconExternal() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" width="10" height="10" aria-hidden="true">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

function IconVerified() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
      <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  )
}

// ── ChatThread ─────────────────────────────────────────────────────────────────

interface Message {
  who: 'dev' | 'studio2'
  text: string
  gap?: string
}

interface ThreadProps {
  title: string
  channel: string
  messages: Message[]
  footer: string
  footerKind: 'bad' | 'cold'
  highlight: boolean
  dim: boolean
  style?: React.CSSProperties
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

function ChatThread({ title, channel, messages, footer, footerKind, highlight, dim, style, onMouseEnter, onMouseLeave }: ThreadProps) {
  const cls = [
    'cs-thread',
    highlight ? 'cs-thread--highlight' : '',
    dim ? 'cs-thread--dim' : '',
  ].filter(Boolean).join(' ')

  return (
    <div className={cls} style={style} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <div className="cs-thread-header">
        <span className="cs-thread-title">{title}</span>
        <span className="cs-thread-channel">{channel}</span>
      </div>
      <div className="cs-thread-divider" />
      <div className="cs-thread-messages">
        {messages.map((msg, i) => (
          <div key={i}>
            {msg.gap && (
              <div className="cs-thread-gap">
                <span>{msg.gap}</span>
              </div>
            )}
            <div className={`cs-thread-msg cs-thread-msg--${msg.who}`}>
              <div className="cs-thread-avatar" />
              <div className="cs-thread-bubble">{msg.text}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="cs-thread-divider cs-thread-divider--footer" />
      <div className={`cs-thread-footer cs-thread-footer--${footerKind}`}>
        <span className="cs-thread-footer-dot" />
        {footer}
      </div>
    </div>
  )
}

// ── Thread data ────────────────────────────────────────────────────────────────

const RATE_THREAD = {
  key: 'rate' as ThreadKey,
  title: '#for-hire · roblox-devs',
  channel: "a dev's pitch",
  messages: [
    { who: 'studio2' as const, text: '🚀 Roblox Scripter for hire! DM for inquiries' },
    { who: 'dev' as const, text: "hey what's your rate?" },
    { who: 'studio2' as const, text: 'depends on the project!' },
    { who: 'dev' as const, text: 'ballpark? 40 or 80?' },
    { who: 'dev' as const, text: 'bumping this 🙏', gap: '3 days later' },
  ],
  footer: 'No rate given · still searching',
  footerKind: 'bad' as const,
  side: 'left' as const,
  top: 140,
}

const PITCH_THREAD = {
  key: 'pitch' as ThreadKey,
  title: '@scripter_x',
  channel: 'dm · "describe yourself"',
  messages: [
    { who: 'dev' as const, text: 'how would you describe your work style?' },
    { who: 'studio2' as const, text: 'top-quality work, every project 💪' },
    { who: 'dev' as const, text: 'got a portfolio or socials I can browse?' },
    { who: 'studio2' as const, text: 'sending the links over today 👍', gap: '2 days later' },
    { who: 'dev' as const, text: 'still nothing - the links?' },
  ],
  footer: 'No links ever sent',
  footerKind: 'bad' as const,
  side: 'right' as const,
  top: 130,
}

const GAMES_THREAD = {
  key: 'games' as ThreadKey,
  title: '@scripter_x',
  channel: 'dm · "Games" question',
  messages: [
    { who: 'dev' as const, text: 'what games have you actually shipped on?' },
    { who: 'studio2' as const, text: 'worked on a huge pet sim, mostly NDA stuff' },
    { who: 'dev' as const, text: 'any specific names you can share?' },
    { who: 'studio2' as const, text: "lots of sim games, you'd know them 🎮" },
    { who: 'dev' as const, text: 'still need one game name 🙏', gap: '2 days later' },
  ],
  footer: 'No specific game ever named',
  footerKind: 'bad' as const,
  side: 'left' as const,
  top: 470,
}

const MYWORK_THREAD = {
  key: 'mywork' as ThreadKey,
  title: '@buildbot_dev',
  channel: 'dm · "My Work" question',
  messages: [
    { who: 'dev' as const, text: 'we need a tycoon economy system, done anything similar?' },
    { who: 'studio2' as const, text: "haven't done exactly that but similar mechanics" },
    { who: 'dev' as const, text: 'code samples? a repo I can browse?' },
    { who: 'studio2' as const, text: 'lemme dig through old projects' },
    { who: 'studio2' as const, text: "couldn't find them, cleaned my drive 😬", gap: '3 days later' },
  ],
  footer: 'No similar work to evaluate',
  footerKind: 'bad' as const,
  side: 'right' as const,
  top: 490,
}

const THREADS = [RATE_THREAD, PITCH_THREAD, GAMES_THREAD, MYWORK_THREAD]
const THREAD_WIDTH = 270
const THREAD_MARGIN = 60
const CARD_WIDTH = 340

// ── Connection line paths ──────────────────────────────────────────────────────

interface LineAnchor {
  regionKey: RegionKey
  threadKey: ThreadKey
  threadSide: 'left' | 'right'
  threadTop: number
}

const LINE_ANCHORS: LineAnchor[] = [
  { regionKey: 'rate',    threadKey: 'rate',   threadSide: 'left',  threadTop: RATE_THREAD.top },
  { regionKey: 'bio',     threadKey: 'pitch',  threadSide: 'right', threadTop: PITCH_THREAD.top },
  { regionKey: 'socials', threadKey: 'pitch',  threadSide: 'right', threadTop: PITCH_THREAD.top },
  { regionKey: 'games',   threadKey: 'games',  threadSide: 'left',  threadTop: GAMES_THREAD.top },
  { regionKey: 'mywork',  threadKey: 'mywork', threadSide: 'right', threadTop: MYWORK_THREAD.top },
]

// ── Main component ─────────────────────────────────────────────────────────────

export default function ComparisonSection() {
  const [hovered, setHovered] = useState<HoveredKey>('rate')
  const sectionRef = useRef<HTMLElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const [regions, setRegions] = useState<Map<RegionKey, DOMRect>>(new Map())
  const [sectionWidth, setSectionWidth] = useState(1280)
  const [threadHeights, setThreadHeights] = useState<Map<ThreadKey, number>>(new Map())
  const threadRefs = useRef<Map<ThreadKey, HTMLDivElement>>(new Map())

  // Measure card regions relative to card
  useLayoutEffect(() => {
    if (!cardRef.current) return
    const measure = () => {
      if (!cardRef.current) return
      const cardRect = cardRef.current.getBoundingClientRect()
      const map = new Map<RegionKey, DOMRect>()
      const keys: RegionKey[] = ['rate', 'bio', 'socials', 'games', 'mywork']
      for (const key of keys) {
        const el = cardRef.current.querySelector(`[data-region="${key}"]`) as HTMLElement | null
        if (el) {
          const r = el.getBoundingClientRect()
          map.set(key, new DOMRect(r.left - cardRect.left, r.top - cardRect.top, r.width, r.height))
        }
      }
      setRegions(map)
      if (sectionRef.current) setSectionWidth(sectionRef.current.offsetWidth)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(cardRef.current)
    if (sectionRef.current) ro.observe(sectionRef.current)
    return () => ro.disconnect()
  }, [])

  // Measure thread heights
  useEffect(() => {
    const map = new Map<ThreadKey, number>()
    for (const [key, el] of threadRefs.current) {
      map.set(key, el.offsetHeight)
    }
    setThreadHeights(map)
  }, [])

  const activeThread = getActiveThread(hovered)
  const activeRegions = getActiveRegions(hovered)

  // Card horizontal offset within section
  const cardLeft = (sectionWidth - CARD_WIDTH) / 2

  // Thread left offsets (absolute within section)
  function threadLeft(side: 'left' | 'right') {
    return side === 'left' ? THREAD_MARGIN : sectionWidth - THREAD_MARGIN - THREAD_WIDTH
  }

  // Build SVG paths
  function buildPath(anchor: LineAnchor): { d: string; active: boolean } {
    const region = regions.get(anchor.regionKey)
    if (!region) return { d: '', active: false }

    const active = activeThread === anchor.threadKey

    const threadH = threadHeights.get(anchor.threadKey) ?? 160

    // Thread anchor point
    const tx = anchor.threadSide === 'left'
      ? threadLeft('left') + THREAD_WIDTH   // right edge of left thread
      : threadLeft('right')                  // left edge of right thread
    const ty = anchor.threadTop + threadH / 2

    // Card region anchor point
    const rx = anchor.threadSide === 'left'
      ? cardLeft + region.left              // left edge of region (for left-side threads)
      : cardLeft + region.left + region.width // right edge of region (for right-side threads)

    // Card region Y relative to section: need section-relative card top
    // The card sits below the header band (~130px from section top) plus padding
    const cardTopInSection = 130
    const ry = cardTopInSection + region.top + region.height / 2

    const mx = (tx + rx) / 2
    const d = `M ${tx},${ty} C ${mx},${ty} ${mx},${ry} ${rx},${ry}`
    return { d, active }
  }

  return (
    <section className="cs-section" ref={sectionRef} id="compare">
      {/* Header */}
      <div className="cs-header">
        <span className="cs-eyebrow">For studios · the difference, annotated</span>
        <h2 className="cs-headline">
          Discord hides them.{' '}
          <span className="cs-headline-accent">Weld shows them.</span>
        </h2>
        <p className="cs-subhead">Hover any field on the card to see the days-long search you avoided.</p>
      </div>

      {/* Stage: threads + card */}
      <div className="cs-stage">

        {/* SVG connection lines */}
        <svg className="cs-lines" aria-hidden="true">
          {LINE_ANCHORS.map((anchor) => {
            const { d, active } = buildPath(anchor)
            if (!d) return null
            return (
              <path
                key={`${anchor.regionKey}-${anchor.threadKey}`}
                d={d}
                fill="none"
                stroke={active ? 'var(--marine, #0E5BC8)' : 'rgba(14,26,43,0.18)'}
                strokeWidth={active ? 1.75 : 1}
                strokeDasharray={active ? 'none' : '4 4'}
                style={{ transition: 'stroke 0.2s ease, stroke-width 0.2s ease' }}
              />
            )
          })}
        </svg>

        {/* Threads */}
        {THREADS.map((thread) => {
          const isActive = activeThread === thread.key
          const isDim = !isActive
          const left = threadLeft(thread.side)
          return (
            <ChatThread
              key={thread.key}
              title={thread.title}
              channel={thread.channel}
              messages={thread.messages}
              footer={thread.footer}
              footerKind={thread.footerKind}
              highlight={isActive}
              dim={isDim}
              style={{ position: 'absolute', left, top: thread.top, width: THREAD_WIDTH }}
              onMouseEnter={() => setHovered(thread.key)}
              onMouseLeave={() => setHovered('rate')}
              // @ts-expect-error ref on function component via callback
              ref={(el: HTMLDivElement | null) => {
                if (el) threadRefs.current.set(thread.key, el)
                else threadRefs.current.delete(thread.key)
              }}
            />
          )
        })}

        {/* Centered card */}
        <div className="cs-card-wrap" ref={cardRef}>
          <div className="cs-sample-badge">SAMPLE</div>

          <div className="npc-card cs-card-static">
            {/* Top: avatar + stats + socials */}
            <div className="npc-top">
              <div className="npc-avatar-wrap">
                <div className="npc-avatar-bg" style={{ background: '#f5ede0' }} />
                <div className="npc-avatar-initials">DD</div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="npc-avatar-img"
                  src="https://tr.rbxcdn.com/30DAY-AvatarHeadshot-E3EC434BF92DD2F46E81D91592065FD9-Png/150/150/AvatarHeadshot/Png/noFilter"
                  alt="DevDave"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
                <div className="npc-online-dot" />
              </div>

              <div className="npc-top-right">
                <div className="npc-stats">
                  <div className="npc-stat">
                    <div className="npc-stat-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                    <div className="npc-stat-val">4+ yrs</div>
                    <div className="npc-stat-lbl">Experience</div>
                  </div>
                  <div className="npc-stat">
                    <div className="npc-stat-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
                      </svg>
                    </div>
                    <div className="npc-stat-val">38</div>
                    <div className="npc-stat-lbl">Projects</div>
                  </div>
                  <div className="npc-stat">
                    <div className="npc-stat-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
                      </svg>
                    </div>
                    <div className="npc-stat-val">12</div>
                    <div className="npc-stat-lbl">Scripts</div>
                  </div>
                  <div className="npc-stat">
                    <div className="npc-stat-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" />
                      </svg>
                    </div>
                    <div className="npc-stat-val">9</div>
                    <div className="npc-stat-lbl">Skills</div>
                  </div>
                </div>

                {/* Socials region */}
                <div className="npc-socials" data-region="socials"
                  onMouseEnter={() => setHovered('socials')}
                  onMouseLeave={() => setHovered('rate')}>
                  <a href="#" className="npc-portfolio-top-link" onClick={(e) => e.preventDefault()}>
                    <IconRoblox /> Roblox Profile
                  </a>
                  <a href="#" className="npc-portfolio-top-link" onClick={(e) => e.preventDefault()}>
                    <IconExternal /> GitHub
                  </a>
                </div>
              </div>
            </div>

            {/* Identity */}
            <div className="npc-identity">
              <div className="npc-name-row">
                <h2 className="npc-name">DevDave</h2>
                <span className="npc-verified" title="Pro Developer"><IconVerified /></span>
              </div>
              <p className="npc-role">4yr experience</p>
            </div>

            <div className="npc-divider" />

            {/* Bio region */}
            <p className="npc-bio" data-region="bio"
              onMouseEnter={() => setHovered('bio')}
              onMouseLeave={() => setHovered('rate')}>
              I&apos;ve been building Roblox games professionally for four years, shipping everything from solo indie projects to large-team live titles. My strength is owning full game systems end-to-end.
            </p>

            {/* Rate + skills region */}
            <div className="npc-rate-skills" data-region="rate"
              onMouseEnter={() => setHovered('rate')}
              onMouseLeave={() => setHovered('rate')}>
              <div className="npc-rate-pill">
                <div className="npc-rate-amount">$65 / hr</div>
                <div className="npc-rate-type">Hourly or milestone</div>
              </div>
              <div className="npc-skills-wrap">
                {['Scripting', 'UI Design', 'VFX', 'DataStore'].map((sk) => (
                  <span key={sk} className="npc-skill-chip">{sk}</span>
                ))}
              </div>
            </div>

            {/* Games + My Work regions */}
            <div className="npc-entries">
              <div className="npc-entry-btn" data-region="games"
                onMouseEnter={() => setHovered('games')}
                onMouseLeave={() => setHovered('rate')}>
                <div className="npc-entry-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 2 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                </div>
                <div className="npc-entry-title">Games</div>
                <div className="npc-entry-sub">See games I&apos;ve worked on →</div>
              </div>
              <div className="npc-entry-btn" data-region="mywork"
                onMouseEnter={() => setHovered('mywork')}
                onMouseLeave={() => setHovered('rate')}>
                <div className="npc-entry-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <div className="npc-entry-title">My Work</div>
                <div className="npc-entry-sub">View projects I&apos;ve built →</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
