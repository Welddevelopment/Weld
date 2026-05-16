'use client'

import { useLayoutEffect, useRef, useState, useCallback } from 'react'

type RegionKey = 'rate' | 'bio' | 'socials' | 'games' | 'mywork'
type ThreadKey = 'rate' | 'pitch' | 'games' | 'mywork'
type HoveredKey = RegionKey | ThreadKey

const REGION_TO_THREAD: Record<RegionKey, ThreadKey> = {
  rate: 'rate', bio: 'pitch', socials: 'pitch', games: 'games', mywork: 'mywork',
}
const THREAD_TO_REGIONS: Record<ThreadKey, RegionKey[]> = {
  rate: ['rate'], pitch: ['bio', 'socials'], games: ['games'], mywork: ['mywork'],
}

function getActiveThread(h: HoveredKey): ThreadKey {
  if (['rate','bio','socials','games','mywork'].includes(h)) return REGION_TO_THREAD[h as RegionKey]
  return h as ThreadKey
}
function getActiveRegions(h: HoveredKey): RegionKey[] {
  return THREAD_TO_REGIONS[getActiveThread(h)]
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function IconRoblox() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
      <path d="M5.24 0 0 18.75 18.76 24 24 5.25ZM15.1 15.17l-6.35-1.7 1.7-6.35 6.35 1.7Z" />
    </svg>
  )
}
function IconExternal() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" width="10" height="10" aria-hidden="true">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
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

interface Message { who: 'dev' | 'studio2'; text: string; gap?: string }

interface ThreadProps {
  title: string; channel: string; messages: Message[]
  footer: string; footerKind: 'bad' | 'cold'
  highlight: boolean; dim: boolean
  style?: React.CSSProperties
  onMouseEnter?: () => void; onMouseLeave?: () => void
  threadRef?: (el: HTMLDivElement | null) => void
}

function ChatThread({ title, channel, messages, footer, footerKind, highlight, dim, style, onMouseEnter, onMouseLeave, threadRef }: ThreadProps) {
  const cls = ['cs-thread', highlight ? 'cs-thread--highlight' : '', dim ? 'cs-thread--dim' : ''].filter(Boolean).join(' ')
  return (
    <div className={cls} style={style} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} ref={threadRef}>
      <div className="cs-thread-header">
        <span className="cs-thread-title">{title}</span>
        <span className="cs-thread-channel">{channel}</span>
      </div>
      <div className="cs-thread-divider" />
      <div className="cs-thread-messages">
        {messages.map((msg, i) => (
          <div key={i}>
            {msg.gap && <div className="cs-thread-gap"><span>{msg.gap}</span></div>}
            <div className={`cs-thread-msg cs-thread-msg--${msg.who}`}>
              <div className="cs-thread-avatar" />
              <div className="cs-thread-bubble">{msg.text}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="cs-thread-divider cs-thread-divider--footer" />
      <div className={`cs-thread-footer cs-thread-footer--${footerKind}`}>
        <span className="cs-thread-footer-dot" />{footer}
      </div>
    </div>
  )
}

// ── Thread data ────────────────────────────────────────────────────────────────

const THREAD_WIDTH = 270
const THREAD_MARGIN = 56

const THREADS = [
  {
    key: 'rate' as ThreadKey, side: 'left' as const, top: 80,
    title: '#for-hire · roblox-devs', channel: "a dev's pitch",
    messages: [
      { who: 'studio2' as const, text: '🚀 Roblox Scripter for hire! DM for inquiries' },
      { who: 'dev' as const, text: "hey what's your rate?" },
      { who: 'studio2' as const, text: 'depends on the project!' },
      { who: 'dev' as const, text: 'ballpark? 40 or 80?' },
      { who: 'dev' as const, text: 'bumping this 🙏', gap: '3 days later' },
    ],
    footer: 'No rate given · still searching', footerKind: 'bad' as const,
  },
  {
    key: 'pitch' as ThreadKey, side: 'right' as const, top: 80,
    title: '@scripter_x', channel: 'dm · "describe yourself"',
    messages: [
      { who: 'dev' as const, text: 'how would you describe your work style?' },
      { who: 'studio2' as const, text: 'top-quality work, every project 💪' },
      { who: 'dev' as const, text: 'got a portfolio or socials I can browse?' },
      { who: 'studio2' as const, text: 'sending the links over today 👍', gap: '2 days later' },
      { who: 'dev' as const, text: 'still nothing - the links?' },
    ],
    footer: 'No links ever sent', footerKind: 'bad' as const,
  },
  {
    key: 'games' as ThreadKey, side: 'left' as const, top: 420,
    title: '@scripter_x', channel: 'dm · "Games" question',
    messages: [
      { who: 'dev' as const, text: 'what games have you actually shipped on?' },
      { who: 'studio2' as const, text: 'worked on a huge pet sim, mostly NDA stuff' },
      { who: 'dev' as const, text: 'any specific names you can share?' },
      { who: 'studio2' as const, text: "lots of sim games, you'd know them 🎮" },
      { who: 'dev' as const, text: 'still need one game name 🙏', gap: '2 days later' },
    ],
    footer: 'No specific game ever named', footerKind: 'bad' as const,
  },
  {
    key: 'mywork' as ThreadKey, side: 'right' as const, top: 420,
    title: '@buildbot_dev', channel: 'dm · "My Work" question',
    messages: [
      { who: 'dev' as const, text: 'we need a tycoon economy system, done anything similar?' },
      { who: 'studio2' as const, text: "haven't done exactly that but similar mechanics" },
      { who: 'dev' as const, text: 'code samples? a repo I can browse?' },
      { who: 'studio2' as const, text: 'lemme dig through old projects' },
      { who: 'studio2' as const, text: "couldn't find them, cleaned my drive 😬", gap: '3 days later' },
    ],
    footer: 'No similar work to evaluate', footerKind: 'bad' as const,
  },
] as const

// Which card region connects to which thread, and which side
const LINE_ANCHORS: Array<{ regionKey: RegionKey; threadKey: ThreadKey; threadSide: 'left' | 'right' }> = [
  { regionKey: 'rate',    threadKey: 'rate',   threadSide: 'left' },
  { regionKey: 'bio',     threadKey: 'pitch',  threadSide: 'right' },
  { regionKey: 'socials', threadKey: 'pitch',  threadSide: 'right' },
  { regionKey: 'games',   threadKey: 'games',  threadSide: 'left' },
  { regionKey: 'mywork',  threadKey: 'mywork', threadSide: 'right' },
]

// ── Layout measurement types ───────────────────────────────────────────────────

interface ThreadRect { left: number; top: number; width: number; height: number }

interface Layout {
  sectionWidth: number
  cardLeft: number   // section-relative
  cardTop: number    // section-relative
  regions: Map<RegionKey, DOMRect>          // relative to card
  threads: Map<ThreadKey, ThreadRect>       // section-relative, accounting for zoom
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function ComparisonSection() {
  const [hovered, setHovered] = useState<HoveredKey>('rate')
  const sectionRef = useRef<HTMLElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const threadEls = useRef<Map<ThreadKey, HTMLDivElement>>(new Map())
  const [layout, setLayout] = useState<Layout | null>(null)

  const measure = useCallback(() => {
    if (!sectionRef.current || !cardRef.current) return
    const sectionRect = sectionRef.current.getBoundingClientRect()
    const cardRect = cardRef.current.getBoundingClientRect()

    // Card position relative to section
    const cardLeft = cardRect.left - sectionRect.left
    const cardTop = cardRect.top - sectionRect.top

    // Region rects relative to card
    const regionMap = new Map<RegionKey, DOMRect>()
    for (const key of ['rate','bio','socials','games','mywork'] as RegionKey[]) {
      const el = cardRef.current.querySelector(`[data-region="${key}"]`) as HTMLElement | null
      if (el) {
        const r = el.getBoundingClientRect()
        regionMap.set(key, new DOMRect(r.left - cardRect.left, r.top - cardRect.top, r.width, r.height))
      }
    }

    // Thread rects relative to section
    // zoom: 0.8 on .cs-thread means getBoundingClientRect returns scaled values,
    // but the inline style top/left are layout positions in the parent (unscaled).
    // We read the actual rendered rects directly.
    const threadMap = new Map<ThreadKey, ThreadRect>()
    for (const [key, el] of threadEls.current) {
      const r = el.getBoundingClientRect()
      threadMap.set(key, {
        left: r.left - sectionRect.left,
        top: r.top - sectionRect.top,
        width: r.width,
        height: r.height,
      })
    }

    setLayout({
      sectionWidth: sectionRect.width,
      cardLeft,
      cardTop,
      regions: regionMap,
      threads: threadMap,
    })
  }, [])

  useLayoutEffect(() => {
    measure()
    const ro = new ResizeObserver(measure)
    if (sectionRef.current) ro.observe(sectionRef.current)
    if (cardRef.current) ro.observe(cardRef.current)
    return () => ro.disconnect()
  }, [measure])

  const activeThread = getActiveThread(hovered)
  const activeRegions = getActiveRegions(hovered)

  // Thread left/right position style
  function threadStyleLeft(side: 'left' | 'right', sectionWidth: number): number {
    return side === 'left'
      ? THREAD_MARGIN
      : sectionWidth - THREAD_MARGIN - THREAD_WIDTH
  }

  // Build SVG path for a line anchor
  function buildPath(anchor: typeof LINE_ANCHORS[number]): { d: string; active: boolean } | null {
    if (!layout) return null
    const region = layout.regions.get(anchor.regionKey)
    const thread = layout.threads.get(anchor.threadKey)
    if (!region || !thread) return null

    const active = activeThread === anchor.threadKey

    // Thread connection point: inside edge (right edge for left threads, left edge for right)
    const tx = anchor.threadSide === 'left' ? thread.left + thread.width : thread.left
    const ty = thread.top + thread.height / 2

    // Card region connection point: outside edge toward the thread side
    const rx = anchor.threadSide === 'left'
      ? layout.cardLeft + region.left             // left edge of region → toward left thread
      : layout.cardLeft + region.left + region.width  // right edge → toward right thread
    const ry = layout.cardTop + region.top + region.height / 2

    const mx = (tx + rx) / 2
    const d = `M ${tx},${ty} C ${mx},${ty} ${mx},${ry} ${rx},${ry}`
    return { d, active }
  }

  // Computed thread left positions (used for initial render before measure)
  const estSectionWidth = layout?.sectionWidth ?? 1280

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

      {/* Stage */}
      <div className="cs-stage">

        {/* SVG connection lines — rendered over everything */}
        <svg className="cs-lines" aria-hidden="true">
          {LINE_ANCHORS.map((anchor) => {
            const path = buildPath(anchor)
            if (!path || !path.d) return null
            const active = path.active
            return (
              <path
                key={`${anchor.regionKey}-${anchor.threadKey}`}
                d={path.d}
                fill="none"
                stroke={active ? '#0E5BC8' : 'rgba(14,26,43,0.18)'}
                strokeWidth={active ? 1.75 : 1}
                strokeDasharray={active ? undefined : '4 4'}
                style={{ transition: 'stroke 0.2s ease, stroke-width 0.2s ease' }}
              />
            )
          })}
        </svg>

        {/* Thread cards */}
        {THREADS.map((thread) => {
          const isActive = activeThread === thread.key
          return (
            <ChatThread
              key={thread.key}
              title={thread.title}
              channel={thread.channel}
              messages={thread.messages as unknown as Message[]}
              footer={thread.footer}
              footerKind={thread.footerKind}
              highlight={isActive}
              dim={!isActive}
              style={{
                position: 'absolute',
                left: threadStyleLeft(thread.side, estSectionWidth),
                top: thread.top,
                width: THREAD_WIDTH,
              }}
              onMouseEnter={() => setHovered(thread.key)}
              onMouseLeave={() => setHovered('rate')}
              threadRef={(el) => {
                if (el) threadEls.current.set(thread.key, el)
                else threadEls.current.delete(thread.key)
              }}
            />
          )
        })}

        {/* Centered card */}
        <div className="cs-card-wrap" ref={cardRef}>
          <div className="cs-sample-badge">SAMPLE</div>

          <div className="npc-card cs-card-static">
            {/* Top: avatar + stats */}
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

                {/* Socials / links — hover region */}
                <div
                  className="npc-socials cs-region-socials"
                  data-region="socials"
                  data-active={activeRegions.includes('socials') ? '' : undefined}
                  onMouseEnter={() => setHovered('socials')}
                  onMouseLeave={() => setHovered('rate')}
                >
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
                <span className="npc-verified"><IconVerified /></span>
              </div>
              <p className="npc-role">4yr experience</p>
            </div>

            <div className="npc-divider" />

            {/* Bio — hover region */}
            <p
              className="npc-bio"
              data-region="bio"
              data-active={activeRegions.includes('bio') ? '' : undefined}
              onMouseEnter={() => setHovered('bio')}
              onMouseLeave={() => setHovered('rate')}
            >
              I&apos;ve been building Roblox games professionally for four years, shipping everything from solo indie projects to large-team live titles. My strength is owning full game systems end-to-end.
            </p>

            {/* Rate + skills — hover region */}
            <div
              className="npc-rate-skills"
              data-region="rate"
              data-active={activeRegions.includes('rate') ? '' : undefined}
              onMouseEnter={() => setHovered('rate')}
              onMouseLeave={() => setHovered('rate')}
            >
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

            {/* Entry buttons — separate hover regions */}
            <div className="npc-entries">
              <div
                className="npc-entry-btn"
                data-region="games"
                data-active={activeRegions.includes('games') ? '' : undefined}
                onMouseEnter={() => setHovered('games')}
                onMouseLeave={() => setHovered('rate')}
              >
                <div className="npc-entry-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 2 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                </div>
                <div className="npc-entry-title">Games</div>
                <div className="npc-entry-sub">See games I&apos;ve worked on →</div>
              </div>
              <div
                className="npc-entry-btn"
                data-region="mywork"
                data-active={activeRegions.includes('mywork') ? '' : undefined}
                onMouseEnter={() => setHovered('mywork')}
                onMouseLeave={() => setHovered('rate')}
              >
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
