'use client'

import { MARQUEE_STUDIOS, type MarqueeStudio } from '@/data/marqueeStudios'

// ── Icons ──────────────────────────────────────────────────────────────────────

function IconVerified() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" aria-hidden="true">
      <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  )
}

function BriefcaseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" aria-hidden="true">
      <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function BoxIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" aria-hidden="true">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 2 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  )
}

// ── Skill colours (same palette as StudioCard) ─────────────────────────────────

const SKILL_COLORS: Record<string, { bg: string; color: string }> = {
  'Scripting':    { bg: '#ede9fe', color: '#6d28d9' },
  'Building':     { bg: '#fef3c7', color: '#b45309' },
  'Terrain':      { bg: '#fef3c7', color: '#b45309' },
  'UI Design':    { bg: '#fce7f3', color: '#be185d' },
  'VFX':          { bg: '#ecfdf5', color: '#059669' },
  'Animation':    { bg: '#fff7ed', color: '#c2410c' },
  'Sound Design': { bg: '#eff6ff', color: '#1d4ed8' },
  'Anti-cheat':   { bg: '#ede9fe', color: '#6d28d9' },
  'Game Design':  { bg: '#f0fdf4', color: '#15803d' },
  'scripter':     { bg: '#ede9fe', color: '#6d28d9' },
  'builder':      { bg: '#fef3c7', color: '#b45309' },
  'designer':     { bg: '#fce7f3', color: '#be185d' },
  'vfx':          { bg: '#ecfdf5', color: '#059669' },
  'animator':     { bg: '#fff7ed', color: '#c2410c' },
  'sound':        { bg: '#eff6ff', color: '#1d4ed8' },
  'gamedesigner': { bg: '#f0fdf4', color: '#15803d' },
}

function sk(s: string) {
  return SKILL_COLORS[s] ?? { bg: '#f3f4f6', color: '#374151' }
}

// ── Background card (static, decorative) ──────────────────────────────────────

function BackgroundStudioCard({ studio }: { studio: MarqueeStudio }) {
  return (
    <div className="npc-card sc-card dc-bg-card">
      <div className="sc-top">
        <div className="sc-avatar-wrap">
          <div className="sc-avatar" style={{ background: studio.avatarColor, position: 'relative' }}>
            {studio.initial}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={studio.avatarUrl} alt=""
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: 20 }}
            />
          </div>
          {studio.online && <div className="sc-online-dot" />}
        </div>
        <div className="sc-stats-box">
          <div className="sc-stats-row">
            <div className="sc-stat"><BriefcaseIcon /><strong>{studio.gamesShipped}</strong><em>Games</em></div>
            <div className="sc-stat"><UsersIcon /><strong>{studio.memberCount}</strong><em>Members</em></div>
            <div className="sc-stat"><EyeIcon /><strong>{studio.visits}</strong><em>Visits</em></div>
          </div>
        </div>
      </div>

      <div className="sc-identity">
        <div className="sc-name-row">
          <h2 className="sc-name">{studio.displayName}</h2>
          {studio.verified && <span className="npc-verified"><IconVerified /></span>}
          {studio.hiringStatus === 'Actively Hiring' && (
            <span className="sc-hiring-pill" style={{ background: '#dcfce7', color: '#15803d' }}>
              <span className="sc-hiring-dot" style={{ background: '#16a34a' }} />
              Actively Hiring
            </span>
          )}
        </div>
        <p className="sc-type">{studio.studioType}</p>
      </div>

      <div className="sc-bio-card">
        <p className="sc-bio">{studio.bio}</p>
      </div>

      <div className="sc-info-card">
        <div className="sc-info-col">
          <div className="sc-info-label">Hiring Rate</div>
          <div className="sc-rate">${studio.hiringRateMin}–${studio.hiringRateMax}/hr</div>
          <div className="sc-rate-note">{studio.rateNote}</div>
        </div>
        <div className="sc-info-col">
          <div className="sc-info-label">Looking For</div>
          <div className="sc-chips">
            {studio.lookingFor.slice(0, 3).map(s => {
              const c = sk(s)
              return <span key={s} className="sc-skill-chip" style={{ background: c.bg, color: c.color }}>{s}</span>
            })}
          </div>
        </div>
        <div className="sc-info-col">
          <div className="sc-info-label">Open Roles</div>
          {studio.openRoles.slice(0, 2).map((role, i) => {
            const c = sk(role.type)
            return (
              <div key={i} className="sc-role-row">
                <span className="sc-role-icon" style={{ background: c.bg, color: c.color }}>
                  {role.type.slice(0, 2).toUpperCase()}
                </span>
                <span className="sc-role-title">{role.title}</span>
              </div>
            )
          })}
          {studio.openRoles.length === 0 && <span className="sc-no-roles">None open</span>}
        </div>
      </div>

      <div className="sc-games" style={{ cursor: 'default' }}>
        <div className="sc-games-icon"><BoxIcon /></div>
        <div>
          <div className="sc-games-title">Games ({studio.gamesShipped})</div>
          <div className="sc-games-link">See live games we&apos;ve launched →</div>
        </div>
      </div>
    </div>
  )
}

// ── Featured studio card (Axiom Studios) ──────────────────────────────────────

function FeaturedStudioCard() {
  const roles = [
    { title: 'Senior scripter',  type: 'scripter'  },
    { title: 'Lead UI designer', type: 'designer'  },
    { title: 'VFX lead',         type: 'vfx'       },
  ]

  return (
    <div className="npc-card sc-card dc-featured-card">
      <div className="sc-top">
        <div className="sc-avatar-wrap">
          <div className="sc-avatar" style={{ background: 'linear-gradient(135deg, #1d4ed8, #2563eb)', position: 'relative' }}>
            AX
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://tr.rbxcdn.com/30DAY-AvatarHeadshot-64C2F41A2938927CF14BD9ECC2AB219D-Png/150/150/AvatarHeadshot/Png/noFilter"
              alt="Axiom Studios"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: 20 }}
            />
          </div>
          <div className="sc-online-dot" />
        </div>
        <div className="sc-stats-box">
          <div className="sc-stats-row">
            <div className="sc-stat"><BriefcaseIcon /><strong>14</strong><em>Games</em></div>
            <div className="sc-stat"><UsersIcon /><strong>48</strong><em>Members</em></div>
            <div className="sc-stat"><EyeIcon /><strong>22B</strong><em>Visits</em></div>
          </div>
        </div>
      </div>

      <div className="sc-identity">
        <div className="sc-name-row">
          <h2 className="sc-name">Axiom Studios</h2>
          <span className="npc-verified"><IconVerified /></span>
          <span className="sc-hiring-pill" style={{ background: '#dcfce7', color: '#15803d' }}>
            <span className="sc-hiring-dot" style={{ background: '#16a34a' }} />
            Actively Hiring
          </span>
        </div>
        <p className="sc-type">Multi-Genre Studio</p>
      </div>

      <div className="sc-bio-card">
        <p className="sc-bio">
          One of the larger Roblox studios. 22B combined visits across 14 titles. Structured pipelines, senior-only contracts, top-of-market pay.
        </p>
      </div>

      <div className="sc-info-card">
        <div className="sc-info-col">
          <div className="sc-info-label">Hiring Rate</div>
          <div className="sc-rate">$75–$150/hr</div>
          <div className="sc-rate-note">Senior-only contracts at present</div>
        </div>
        <div className="sc-info-col">
          <div className="sc-info-label">Looking For</div>
          <div className="sc-chips">
            {['Scripting', 'UI Design', 'VFX'].map(s => {
              const c = sk(s)
              return <span key={s} className="sc-skill-chip" style={{ background: c.bg, color: c.color }}>{s}</span>
            })}
          </div>
        </div>
        <div className="sc-info-col">
          <div className="sc-info-label">Open Roles</div>
          {roles.map((role, i) => {
            const c = sk(role.type)
            return (
              <div key={i} className="sc-role-row">
                <span className="sc-role-icon" style={{ background: c.bg, color: c.color }}>
                  {role.type.slice(0, 2).toUpperCase()}
                </span>
                <span className="sc-role-title">{role.title}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="sc-games" style={{ cursor: 'default' }}>
        <div className="sc-games-icon"><BoxIcon /></div>
        <div>
          <div className="sc-games-title">Games (14)</div>
          <div className="sc-games-link">See live games we&apos;ve launched →</div>
        </div>
      </div>
    </div>
  )
}

// ── Section ────────────────────────────────────────────────────────────────────

export default function StudioCohortSection({
  email,
  phase,
  status,
  captureRef,
  onEmailChange,
  onSubmit,
}: {
  email: string
  phase: string
  status: string
  captureRef: React.MutableRefObject<HTMLDivElement | null>
  onEmailChange: (v: string) => void
  onSubmit: () => void
}) {
  return (
    <section className="dc-section" id="join">
      <div className="dc-mosaic" aria-hidden="true">
        {MARQUEE_STUDIOS.map((s) => (
          <BackgroundStudioCard key={s.id} studio={s} />
        ))}
      </div>

      <div className="dc-inner">
        <div className="dc-copy" ref={captureRef}>
          <span className="cs-eyebrow">The waitlist, so far</span>
          <h2 className="dc-headline">Add yours<br />to the wall.</h2>
          <p className="dc-subhead">
            Every studio on this wall is on the Weld waitlist.<br />
            We&apos;re keeping the first 50 hand-curated.
          </p>
          <div className="dc-capture">
            <input
              type="email"
              className="dc-input"
              value={email}
              placeholder="you@example.com"
              onChange={(e) => onEmailChange(e.target.value)}
            />
            <button
              type="button"
              className="dc-submit"
              onClick={onSubmit}
              disabled={phase === 'submitting'}
            >
              {phase === 'success' ? "You're in ✓" : 'Add my studio →'}
            </button>
          </div>
          {status && <p className="dc-status" aria-live="polite">{status}</p>}
        </div>

        <div className="dc-featured">
          <FeaturedStudioCard />
        </div>
      </div>
    </section>
  )
}
