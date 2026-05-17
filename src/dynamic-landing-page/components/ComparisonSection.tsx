'use client'

import { useState } from 'react'

type Audience = 'developer' | 'studio'
type RegionKey = 'rate' | 'bio' | 'socials' | 'games' | 'mywork'
type ThreadKey = 'rate' | 'pitch' | 'games' | 'mywork'
type HoveredKey = RegionKey | ThreadKey

const REGION_TO_THREAD: Record<RegionKey, ThreadKey> = {
  rate: 'rate', bio: 'pitch', socials: 'pitch', games: 'games', mywork: 'mywork',
}
const THREAD_TO_REGIONS: Record<ThreadKey, RegionKey[]> = {
  rate: ['rate'], pitch: ['bio', 'socials'], games: ['games'], mywork: ['mywork'],
}

function getActiveThread(h: HoveredKey | null): ThreadKey | null {
  if (h === null) return null
  if (h in REGION_TO_THREAD) return REGION_TO_THREAD[h as RegionKey]
  return h as ThreadKey
}
function getActiveRegions(h: HoveredKey | null): RegionKey[] {
  const thread = getActiveThread(h)
  if (!thread) return []
  return THREAD_TO_REGIONS[thread]
}

// ── Shared icons ───────────────────────────────────────────────────────────────

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

// Studio-card icons (matching the marquee StudioCard)
function CalIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
}
function BriefIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
}
function EyeIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
}
function ClockIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
}
function ChevronIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="10" height="10"><polyline points="9 18 15 12 9 6"/></svg>
}
function InfoIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="8.01"/><line x1="12" y1="12" x2="12" y2="16"/></svg>
}
function BoxIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 2 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
}

// ── ChatThread ─────────────────────────────────────────────────────────────────

interface Message { who: 'dev' | 'studio2'; text: string; gap?: string }

interface ThreadProps {
  title: string; channel: string; messages: Message[]
  footer: string; footerKind: 'bad' | 'cold'
  highlight: boolean; dim: boolean
  onMouseEnter?: () => void; onMouseLeave?: () => void
}

function ChatThread({ title, channel, messages, footer, footerKind, highlight, dim, onMouseEnter, onMouseLeave }: ThreadProps) {
  const cls = ['cs-thread', highlight ? 'cs-thread--highlight' : '', dim ? 'cs-thread--dim' : ''].filter(Boolean).join(' ')
  return (
    <div className={cls} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
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

const STUDIO_LEFT_THREADS = [
  {
    key: 'rate' as ThreadKey,
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
    key: 'games' as ThreadKey,
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
]

const STUDIO_RIGHT_THREADS = [
  {
    key: 'pitch' as ThreadKey,
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
    key: 'mywork' as ThreadKey,
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
]

const DEV_LEFT_THREADS = [
  {
    key: 'rate' as ThreadKey,
    title: '#for-hire · roblox-jobs', channel: "a studio's post",
    messages: [
      { who: 'studio2' as const, text: '🎮 Looking for a Roblox scripter! DM for inquiries' },
      { who: 'dev' as const, text: "what's the budget?" },
      { who: 'studio2' as const, text: 'depends on the experience level' },
      { who: 'dev' as const, text: 'ballpark range? $40, $80?' },
      { who: 'dev' as const, text: 'bumping this 🙏', gap: '3 days later' },
    ],
    footer: 'No budget given · still waiting', footerKind: 'bad' as const,
  },
  {
    key: 'games' as ThreadKey,
    title: '@scriptedup_studios', channel: 'dm · "Past Games" question',
    messages: [
      { who: 'dev' as const, text: "what's a game your studio actually shipped?" },
      { who: 'studio2' as const, text: 'worked on huge titles, mostly under contract' },
      { who: 'dev' as const, text: 'any specific names you can share?' },
      { who: 'studio2' as const, text: "lots, you'd know them 🎮" },
      { who: 'dev' as const, text: 'still need one game name 🙏', gap: '2 days later' },
    ],
    footer: 'No specific game ever named', footerKind: 'bad' as const,
  },
]

const DEV_RIGHT_THREADS = [
  {
    key: 'pitch' as ThreadKey,
    title: '@scriptedup_studios', channel: 'dm · "what is this?"',
    messages: [
      { who: 'dev' as const, text: "what's the project actually about?" },
      { who: 'studio2' as const, text: "we're building something HUGE in the tycoon space 🚀" },
      { who: 'dev' as const, text: 'got a studio page or past game I can check?' },
      { who: 'studio2' as const, text: 'sending the links over today 🔥', gap: '2 days later' },
      { who: 'dev' as const, text: 'still nothing - the links?' },
    ],
    footer: 'No links ever sent', footerKind: 'bad' as const,
  },
  {
    key: 'mywork' as ThreadKey,
    title: '@buildbot_studios', channel: 'dm · "Open Roles" question',
    messages: [
      { who: 'dev' as const, text: 'what would the role actually involve?' },
      { who: 'studio2' as const, text: 'helping out across the board, very dynamic role' },
      { who: 'dev' as const, text: 'can you share a brief or scope doc?' },
      { who: 'studio2' as const, text: "we'll figure it out as we go!" },
      { who: 'studio2' as const, text: "btw it's equity-only for the first 3 months 🙃", gap: '3 days later' },
    ],
    footer: 'Scope creep + unpaid bait', footerKind: 'bad' as const,
  },
]

// ── Cards ──────────────────────────────────────────────────────────────────────

const SC_SKILL_COLORS: Record<string, { bg: string; color: string }> = {
  'Scripting':   { bg: '#ede9fe', color: '#6d28d9' },
  'Scripter':    { bg: '#ede9fe', color: '#6d28d9' },
  'Building':    { bg: '#fef3c7', color: '#b45309' },
  'UI Design':   { bg: '#fce7f3', color: '#be185d' },
  'UI Designer': { bg: '#fce7f3', color: '#be185d' },
  'VFX':         { bg: '#ecfdf5', color: '#059669' },
  'Animator':    { bg: '#fff7ed', color: '#c2410c' },
}
function scSkill(s: string) {
  return SC_SKILL_COLORS[s] ?? { bg: '#f3f4f6', color: '#374151' }
}

function TalentCard({ activeRegions, onRegion, onLeave }: {
  activeRegions: RegionKey[]
  onRegion: (k: RegionKey) => void
  onLeave: () => void
}) {
  return (
    <div className="npc-card cs-card-static">
      <div className="npc-top">
        <div className="npc-avatar-wrap">
          <div className="npc-avatar-bg" style={{ background: '#f5ede0' }} />
          <div className="npc-avatar-initials">DD</div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="npc-avatar-img"
            src="https://tr.rbxcdn.com/30DAY-AvatarHeadshot-E3EC434BF92DD2F46E81D91592065FD9-Png/150/150/AvatarHeadshot/Png/noFilter"
            alt="DevDave"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
          <div className="npc-online-dot" />
        </div>
        <div className="npc-top-right">
          <div className="npc-stats">
            {[
              { val: '4+ yrs', lbl: 'Experience', icon: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></> },
              { val: '38',     lbl: 'Projects',   icon: <><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></> },
              { val: '12',     lbl: 'Scripts',    icon: <><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></> },
              { val: '9',      lbl: 'Skills',     icon: <><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></> },
            ].map(({ val, lbl, icon }) => (
              <div key={lbl} className="npc-stat">
                <div className="npc-stat-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
                </div>
                <div className="npc-stat-val">{val}</div>
                <div className="npc-stat-lbl">{lbl}</div>
              </div>
            ))}
          </div>
          <div className="npc-socials"
            data-region="socials"
            data-active={activeRegions.includes('socials') ? '' : undefined}
            onMouseEnter={() => onRegion('socials')} onMouseLeave={onLeave}>
            <a href="#" className="npc-portfolio-top-link" onClick={(e) => e.preventDefault()}><IconRoblox /> Roblox Profile</a>
            <a href="#" className="npc-portfolio-top-link" onClick={(e) => e.preventDefault()}><IconExternal /> GitHub</a>
          </div>
        </div>
      </div>

      <div className="npc-identity">
        <div className="npc-name-row">
          <h2 className="npc-name">DevDave</h2>
          <span className="npc-verified"><IconVerified /></span>
        </div>
        <p className="npc-role">4yr experience</p>
      </div>

      <div className="npc-divider" />

      <p className="npc-bio"
        data-region="bio"
        data-active={activeRegions.includes('bio') ? '' : undefined}
        onMouseEnter={() => onRegion('bio')} onMouseLeave={onLeave}>
        I&apos;ve been building Roblox games professionally for four years, shipping everything from solo indie projects to large-team live titles. My strength is owning full game systems end-to-end.
      </p>

      <div className="npc-rate-skills"
        data-region="rate"
        data-active={activeRegions.includes('rate') ? '' : undefined}
        onMouseEnter={() => onRegion('rate')} onMouseLeave={onLeave}>
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

      <div className="npc-entries">
        <div className="npc-entry-btn"
          data-region="games"
          data-active={activeRegions.includes('games') ? '' : undefined}
          onMouseEnter={() => onRegion('games')} onMouseLeave={onLeave}>
          <div className="npc-entry-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 2 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
          </div>
          <div className="npc-entry-title">Games</div>
          <div className="npc-entry-sub">See games I&apos;ve worked on →</div>
        </div>
        <div className="npc-entry-btn"
          data-region="mywork"
          data-active={activeRegions.includes('mywork') ? '' : undefined}
          onMouseEnter={() => onRegion('mywork')} onMouseLeave={onLeave}>
          <div className="npc-entry-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <div className="npc-entry-title">My Work</div>
          <div className="npc-entry-sub">View projects I&apos;ve built →</div>
        </div>
      </div>
    </div>
  )
}

function StudioCardStatic({ activeRegions, onRegion, onLeave }: {
  activeRegions: RegionKey[]
  onRegion: (k: RegionKey) => void
  onLeave: () => void
}) {
  return (
    <div className="npc-card sc-card cs-card-static">

      {/* Top: monogram + stats */}
      <div className="sc-top">
        <div className="sc-avatar-wrap">
          <div className="sc-avatar cs-sc-monogram" style={{ position: 'relative' }}>
            <span>NW</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://tr.rbxcdn.com/30DAY-AvatarHeadshot-93AE29D7B9A260DD3975F3B0276B29E5-Png/150/150/AvatarHeadshot/Png/noFilter"
              alt="Eclipse Studios"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: 20 }}
            />
          </div>
          <div className="sc-online-dot" />
        </div>
        <div className="sc-stats-box">
          <div className="sc-stats-row">
            <div className="sc-stat"><CalIcon /><strong>7+</strong><em>Studio</em></div>
            <div className="sc-stat"><BriefIcon /><strong>12</strong><em>Shipped</em></div>
            <div className="sc-stat"><EyeIcon /><strong>7</strong><em>Team</em></div>
            <div className="sc-stat"><ClockIcon /><strong>100%</strong><em>Paid</em></div>
          </div>
        </div>
      </div>

      {/* Social chips — data-region="socials" */}
      <div className="cs-sc-socials"
        data-region="socials"
        data-active={activeRegions.includes('socials') ? '' : undefined}
        onMouseEnter={() => onRegion('socials')} onMouseLeave={onLeave}>
        <span className="cs-sc-chip"><span className="cs-sc-chip-dot cs-sc-chip-dot--marine" />Studio Profile</span>
        <span className="cs-sc-chip"><span className="cs-sc-chip-dot cs-sc-chip-dot--ink" />X / Twitter</span>
      </div>

      {/* Identity */}
      <div className="sc-identity">
        <div className="sc-name-row">
          <h2 className="sc-name">NoirWorks</h2>
          <span className="npc-verified"><IconVerified /></span>
          <span className="sc-hiring-pill" style={{ background: '#dcfce7', color: '#15803d' }}>
            <span className="sc-hiring-dot" style={{ background: '#16a34a' }} />
            Actively Hiring
          </span>
        </div>
        <p className="sc-type">Live game studio · 7yr</p>
      </div>

      {/* Bio — data-region="bio" */}
      <div className="sc-bio-card"
        data-region="bio"
        data-active={activeRegions.includes('bio') ? '' : undefined}
        onMouseEnter={() => onRegion('bio')} onMouseLeave={onLeave}>
        <p className="sc-bio">We&apos;re shipping the next update of a long-running tycoon franchise. Looking for a scripter to own the combat and progression systems end-to-end. 6 months of runway, milestone-based, scope locked from week one.</p>
      </div>

      {/* Info grid */}
      <div className="sc-info-card">
        {/* Rate — data-region="rate" */}
        <div className="sc-info-col"
          data-region="rate"
          data-active={activeRegions.includes('rate') ? '' : undefined}
          onMouseEnter={() => onRegion('rate')} onMouseLeave={onLeave}>
          <div className="sc-info-label">HIRING RATE</div>
          <div className="sc-rate">$50–80/hr</div>
          <div className="sc-rate-type">Locked range,</div>
          <div className="sc-rate-note">milestone</div>
        </div>
        <div className="sc-info-col">
          <div className="sc-info-label">LOOKING FOR</div>
          <div className="sc-chips">
            {['Scripter', 'UI Designer', 'VFX', 'Animator'].map(skill => {
              const s = scSkill(skill)
              return <span key={skill} className="sc-skill-chip" style={{ background: s.bg, color: s.color }}>{skill}</span>
            })}
          </div>
        </div>
        {/* Open Roles — data-region="mywork" */}
        <div className="sc-info-col"
          data-region="mywork"
          data-active={activeRegions.includes('mywork') ? '' : undefined}
          onMouseEnter={() => onRegion('mywork')} onMouseLeave={onLeave}>
          <div className="sc-info-label">OPEN ROLES</div>
          {[
            { label: 'Sc', bg: '#ede9fe', color: '#6d28d9', title: 'Systems sc...' },
            { label: 'Bu', bg: '#fef3c7', color: '#b45309', title: 'Map builder' },
            { label: 'UI', bg: '#fce7f3', color: '#be185d', title: 'UI designer' },
          ].map(r => (
            <div key={r.title} className="sc-role-row">
              <span className="sc-role-icon" style={{ background: r.bg, color: r.color }}>{r.label}</span>
              <span className="sc-role-title">{r.title}</span>
              <ChevronIcon />
            </div>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="sc-about">
        <div className="sc-about-hd"><InfoIcon /> About</div>
        <p className="sc-about-text">NoirWorks builds tycoon games with deep progression systems. Our titles average 400K daily visits. We run tight scopes and pay on milestones — always.</p>
      </div>

      {/* Games — data-region="games" */}
      <div className="sc-games"
        data-region="games"
        data-active={activeRegions.includes('games') ? '' : undefined}
        onMouseEnter={() => onRegion('games')} onMouseLeave={onLeave}>
        <div className="sc-games-icon"><BoxIcon /></div>
        <div>
          <div className="sc-games-title">Games (6)</div>
          <div className="sc-games-link">See live games we&apos;ve launched →</div>
        </div>
      </div>

    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function ComparisonSection({ audience = 'studio' }: { audience?: Audience }) {
  const [hovered, setHovered] = useState<HoveredKey | null>(null)

  const activeThread = getActiveThread(hovered)
  const activeRegions = getActiveRegions(hovered)
  const reset = () => setHovered(null)

  const isDev = audience === 'developer'
  const leftThreads = isDev ? DEV_LEFT_THREADS : STUDIO_LEFT_THREADS
  const rightThreads = isDev ? DEV_RIGHT_THREADS : STUDIO_RIGHT_THREADS

  return (
    <section className="cs-section" id="compare">

      <div className="cs-header">
        <span className="cs-eyebrow">
          {isDev ? 'For developers · the difference, annotated' : 'For studios · the difference, annotated'}
        </span>
        <h2 className="cs-headline">
          Discord hides them.{' '}
          <span className="cs-headline-accent">Weld shows them.</span>
        </h2>
        <p className="cs-subhead">
          {isDev
            ? 'Hover any field on the offer to see the days-long search you avoided.'
            : 'Hover any field on the card to see the days-long search you avoided.'}
        </p>
      </div>

      <div className="cs-body">
        {/* Left threads */}
        <div className="cs-col cs-col--left">
          {leftThreads.map((t) => (
            <ChatThread key={t.key}
              title={t.title} channel={t.channel}
              messages={t.messages as Message[]}
              footer={t.footer} footerKind={t.footerKind}
              highlight={activeThread === t.key}
              dim={activeThread !== null && activeThread !== t.key}
              onMouseEnter={() => setHovered(t.key)}
              onMouseLeave={reset}
            />
          ))}
        </div>

        {/* Center card */}
        <div className="cs-card-wrap">
          {isDev
            ? <StudioCardStatic activeRegions={activeRegions} onRegion={(k) => setHovered(k)} onLeave={reset} />
            : <TalentCard activeRegions={activeRegions} onRegion={(k) => setHovered(k)} onLeave={reset} />
          }
        </div>

        {/* Right threads */}
        <div className="cs-col cs-col--right">
          {rightThreads.map((t) => (
            <ChatThread key={t.key}
              title={t.title} channel={t.channel}
              messages={t.messages as Message[]}
              footer={t.footer} footerKind={t.footerKind}
              highlight={activeThread === t.key}
              dim={activeThread !== null && activeThread !== t.key}
              onMouseEnter={() => setHovered(t.key)}
              onMouseLeave={reset}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
