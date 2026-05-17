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
function IconRoblox() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
      <path d="M5.24 0 0 18.75 18.76 24 24 5.25ZM15.1 15.17l-6.35-1.7 1.7-6.35 6.35 1.7Z" />
    </svg>
  )
}

// ── Background card (real full npc-card, static) ───────────────────────────────

function BackgroundCard({ profile }: { profile: MarqueeProfile }) {
  const yearsExp = profile.yearsExperience === 1 ? '1 yr' : `${profile.yearsExperience}+ yrs`

  return (
    <div className="npc-card dc-bg-card">
      <div className="npc-top">
        <div className="npc-avatar-wrap">
          <div className="npc-avatar-bg" style={{ background: profile.avatarColor }} />
          <div className="npc-avatar-initials">{profile.initial}</div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="npc-avatar-img" src={profile.avatarUrl} alt=""
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
            {profile.externalLinks.slice(0, 2).map(link => (
              <span key={link.label} className="npc-portfolio-top-link">
                <IconExternal /> {link.label}
              </span>
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
          {profile.skills.map(sk => <span key={sk} className="npc-skill-chip">{sk}</span>)}
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

// ── DevDave featured card (same sample card as hero / comparison section) ───────

function DevDaveCard() {
  return (
    <div className="npc-card dc-featured-card">
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
            {([
              { val: '4+ yrs', lbl: 'Experience', icon: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></> },
              { val: '38',     lbl: 'Projects',   icon: <><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></> },
              { val: '12',     lbl: 'Scripts',    icon: <><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></> },
              { val: '9',      lbl: 'Skills',     icon: <><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></> },
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

      <p className="npc-bio">
        I&apos;ve been building Roblox games professionally for four years, shipping everything from solo indie projects to large-team live titles. My strength is owning full game systems end-to-end.
      </p>

      <div className="npc-rate-skills">
        <div className="npc-rate-pill">
          <div className="npc-rate-amount">$65 / hr</div>
          <div className="npc-rate-type">Hourly or milestone</div>
        </div>
        <div className="npc-skills-wrap">
          {['Scripting', 'UI Design', 'VFX', 'DataStore'].map(sk => (
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

      {/* Background mosaic — real full cards, purely decorative */}
      <div className="dc-mosaic" aria-hidden="true">
        {MARQUEE_PROFILES.map((p) => (
          <BackgroundCard key={p.id} profile={p} />
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

        {/* Right: DevDave featured card */}
        <div className="dc-featured">
          <DevDaveCard />
        </div>
      </div>
    </section>
  )
}
