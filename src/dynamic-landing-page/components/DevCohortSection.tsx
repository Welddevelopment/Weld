'use client'

import { MARQUEE_PROFILES, type MarqueeProfile } from '@/data/marqueeProfiles'

// ── Icons ──────────────────────────────────────────────────────────────────────

function IconVerified() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
      <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
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

// ── Mini card (background mosaic) ──────────────────────────────────────────────

function MiniCard({ profile }: { profile: MarqueeProfile }) {
  return (
    <div className="dc-mini">
      <div className="dc-mini-top">
        <div className="dc-mini-avatar" style={{ background: profile.avatarColor }}>
          <span>{profile.initial}</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={profile.avatarUrl} alt="" aria-hidden="true"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
        </div>
        <div className="dc-mini-info">
          <div className="dc-mini-name">
            {profile.displayName}
            {profile.verified && (
              <svg viewBox="0 0 24 24" fill="#0E5BC8" width="11" height="11" style={{ flexShrink: 0, marginLeft: 3 }}>
                <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            )}
          </div>
          <div className="dc-mini-role">{profile.primaryRole}</div>
        </div>
      </div>
      <div className="dc-mini-chips">
        {profile.skills.slice(0, 2).map(s => (
          <span key={s} className="dc-mini-chip">{s}</span>
        ))}
      </div>
      <div className="dc-mini-rate">${profile.hourlyRate} / hr</div>
    </div>
  )
}

// ── Featured dev card ──────────────────────────────────────────────────────────

function FeaturedCard({ profile }: { profile: MarqueeProfile }) {
  const yearsExp = profile.yearsExperience === 1 ? '1 yr' : `${profile.yearsExperience}+ yrs`

  return (
    <div className="npc-card dc-featured-card">
      <div className="npc-top">
        <div className="npc-avatar-wrap">
          <div className="npc-avatar-bg" style={{ background: profile.avatarColor }} />
          <div className="npc-avatar-initials">{profile.initial}</div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="npc-avatar-img" src={profile.avatarUrl} alt={profile.displayName}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
          {profile.online && <div className="npc-online-dot" />}
        </div>
        <div className="npc-top-right">
          <div className="npc-stats">
            {([
              { val: yearsExp, lbl: 'Experience', icon: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></> },
              { val: String(profile.projectsShipped), lbl: 'Projects', icon: <><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></> },
              { val: profile.scriptsCount, lbl: 'Scripts', icon: <><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></> },
              { val: String(profile.skillCount), lbl: 'Skills', icon: <><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></> },
            ] as { val: string; lbl: string; icon: React.ReactNode }[]).map(({ val, lbl, icon }) => (
              <div key={lbl} className="npc-stat">
                <div className="npc-stat-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
                </div>
                <div className="npc-stat-val">{val}</div>
                <div className="npc-stat-lbl">{lbl}</div>
              </div>
            ))}
          </div>
          <div className="npc-socials">
            {profile.externalLinks.map(link => (
              <a key={link.label} href="#" className="npc-portfolio-top-link" onClick={(e) => e.preventDefault()}>
                <IconExternal /> {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="npc-identity">
        <div className="npc-name-row">
          <h2 className="npc-name">{profile.displayName}</h2>
          {profile.verified && <span className="npc-verified"><IconVerified /></span>}
        </div>
        <p className="npc-role">{profile.primaryRole}</p>
      </div>

      <div className="npc-divider" />

      <p className="npc-bio">{profile.bio}</p>

      <div className="npc-rate-skills">
        <div className="npc-rate-pill">
          <div className="npc-rate-amount">${profile.hourlyRate} / hr</div>
          <div className="npc-rate-type">{profile.rateMode}</div>
        </div>
        <div className="npc-skills-wrap">
          {profile.skills.map(sk => (
            <span key={sk} className="npc-skill-chip">{sk}</span>
          ))}
        </div>
      </div>

      <div className="npc-entries">
        <div className="npc-entry-btn">
          <div className="npc-entry-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 2 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
          </div>
          <div className="npc-entry-title">Games</div>
          <div className="npc-entry-sub">See games I&apos;ve worked on →</div>
        </div>
        <div className="npc-entry-btn">
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

// ── Section ────────────────────────────────────────────────────────────────────

const FEATURED = MARQUEE_PROFILES.find(p => p.id === 'cael-fps')!
const MOSAIC = [...MARQUEE_PROFILES, ...MARQUEE_PROFILES, ...MARQUEE_PROFILES]

export default function DevCohortSection({
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

      {/* Background mosaic — aria-hidden, purely decorative */}
      <div className="dc-mosaic" aria-hidden="true">
        {MOSAIC.map((p, i) => (
          <MiniCard key={`${p.id}-${i}`} profile={p} />
        ))}
      </div>

      {/* Foreground */}
      <div className="dc-inner">
        {/* Left: copy + form */}
        <div className="dc-copy" ref={captureRef}>
          <span className="cs-eyebrow">The cohort, so far</span>
          <h2 className="dc-headline">Add yours<br />to the wall.</h2>
          <p className="dc-subhead">
            Every card in this section is a real waitlist dev.<br />
            We&apos;re keeping the first 100 hand-curated.
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
              {phase === 'success' ? "You're in ✓" : 'Add my card →'}
            </button>
          </div>
          {status && <p className="dc-status" aria-live="polite">{status}</p>}
        </div>

        {/* Right: featured real card */}
        <div className="dc-featured">
          <FeaturedCard profile={FEATURED} />
        </div>
      </div>
    </section>
  )
}
