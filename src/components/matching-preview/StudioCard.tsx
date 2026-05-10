"use client"

import type { MarqueeStudio, RoleType } from "@/data/marqueeStudios"

const ROLE_COLORS: Record<RoleType, { bg: string; color: string; label: string }> = {
  scripter:    { bg: "#ede9fe", color: "#6d28d9", label: "Sc" },
  builder:     { bg: "#fef3c7", color: "#b45309", label: "Bu" },
  designer:    { bg: "#fce7f3", color: "#be185d", label: "UI" },
  vfx:         { bg: "#ecfdf5", color: "#059669", label: "FX" },
  animator:    { bg: "#fff7ed", color: "#c2410c", label: "An" },
  sound:       { bg: "#eff6ff", color: "#1d4ed8", label: "So" },
  gamedesigner:{ bg: "#f0fdf4", color: "#15803d", label: "GD" },
}

const SKILL_COLORS: Record<string, { bg: string; color: string }> = {
  "Scripting":    { bg: "#ede9fe", color: "#6d28d9" },
  "Building":     { bg: "#fef3c7", color: "#b45309" },
  "Terrain":      { bg: "#fef3c7", color: "#b45309" },
  "UI Design":    { bg: "#fce7f3", color: "#be185d" },
  "VFX":          { bg: "#ecfdf5", color: "#059669" },
  "Animation":    { bg: "#fff7ed", color: "#c2410c" },
  "Sound Design": { bg: "#eff6ff", color: "#1d4ed8" },
  "Anti-cheat":   { bg: "#ede9fe", color: "#6d28d9" },
  "Game Design":  { bg: "#f0fdf4", color: "#15803d" },
}

function getSkillStyle(skill: string) {
  return SKILL_COLORS[skill] ?? { bg: "#f3f4f6", color: "#374151" }
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
      <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="8.01" />
      <line x1="12" y1="12" x2="12" y2="16" />
    </svg>
  )
}

function BoxIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 2 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function BriefcaseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="10" height="10">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

export default function StudioCard({ studio }: { studio: MarqueeStudio }) {
  const hiringColor = studio.hiringStatus === "Actively Hiring"
    ? { bg: "#dcfce7", color: "#15803d", dot: "#16a34a" }
    : studio.hiringStatus === "Hiring Soon"
    ? { bg: "#fef9c3", color: "#a16207", dot: "#ca8a04" }
    : { bg: "#f3f4f6", color: "#6b7280", dot: "#9ca3af" }

  return (
    <div className="npc-root">
      <div className="npc-stack-row">
        <div className="mock-card-shell">
          <article className="npc-wrap">
            <div className="npc-card sc-card">

              {/* Top: avatar + stats */}
              <div className="sc-top">
                <div className="sc-avatar-wrap">
                  <div className="sc-avatar" style={{ background: studio.avatarColor }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={studio.avatarUrl} alt={studio.displayName} className="sc-avatar-img" />
                  </div>
                  {studio.online && <div className="sc-online-dot" />}
                </div>
                <div className="sc-stats-box">
                  <div className="sc-stats-row">
                    <div className="sc-stat"><CalendarIcon /><strong>{studio.gamesShipped}</strong><em>Building</em></div>
                    <div className="sc-stat"><BriefcaseIcon /><strong>{studio.projectsCount}</strong><em>Projects</em></div>
                    <div className="sc-stat"><EyeIcon /><strong>{studio.visits}</strong><em>Visits</em></div>
                    <div className="sc-stat"><ClockIcon /><strong>{studio.onTimeRate}</strong><em>On-time</em></div>
                  </div>
                </div>
              </div>

              {/* Identity */}
              <div className="sc-identity">
                <div className="sc-name-row">
                  <h2 className="sc-name">{studio.displayName}</h2>
                  {studio.verified && (
                    <span className="npc-verified"><CheckIcon /></span>
                  )}
                  <span className="sc-hiring-pill" style={{ background: hiringColor.bg, color: hiringColor.color }}>
                    <span className="sc-hiring-dot" style={{ background: hiringColor.dot }} />
                    {studio.hiringStatus}
                  </span>
                </div>
                <p className="sc-type">{studio.studioType} · {studio.memberCount} members</p>
              </div>

              {/* Bio card — separate */}
              <div className="sc-bio-card">
                <p className="sc-bio">{studio.bio}</p>
                <button className="sc-more-btn" aria-hidden="true">
                  <svg width="14" height="20" viewBox="0 0 14 20" fill="none">
                    <rect x="0" y="0" width="14" height="20" rx="7" fill="#e2e2ee"/>
                    <rect x="4" y="4" width="6" height="8" rx="3" fill="#b0b0c8"/>
                  </svg>
                </button>
              </div>

              {/* Info grid card — separate */}
              <div className="sc-info-card">
                <div className="sc-info-col">
                  <div className="sc-info-label">HIRING RATE</div>
                  <div className="sc-rate">${studio.hiringRateMin}–${studio.hiringRateMax}/hr</div>
                  <div className="sc-rate-type">Hourly (USD)</div>
                  <div className="sc-rate-note">{studio.rateNote}</div>
                </div>
                <div className="sc-info-col">
                  <div className="sc-info-label">LOOKING FOR</div>
                  <div className="sc-chips">
                    {studio.lookingFor.map(skill => {
                      const s = getSkillStyle(skill)
                      return (
                        <span key={skill} className="sc-skill-chip" style={{ background: s.bg, color: s.color }}>
                          {skill}
                        </span>
                      )
                    })}
                  </div>
                </div>
                <div className="sc-info-col">
                  <div className="sc-info-label">OPEN ROLES</div>
                  {studio.openRoles.slice(0, 3).map(role => {
                    const rc = ROLE_COLORS[role.type]
                    return (
                      <div key={role.title} className="sc-role-row">
                        <span className="sc-role-icon" style={{ background: rc.bg, color: rc.color }}>{rc.label}</span>
                        <span className="sc-role-title">
                          {role.title}{role.count ? ` (x${role.count})` : ""}
                        </span>
                        <ChevronIcon />
                      </div>
                    )
                  })}
                  {studio.openRoles.length === 0 && (
                    <span className="sc-no-roles">None open</span>
                  )}
                </div>
              </div>

              {/* About */}
              <div className="sc-about">
                <div className="sc-about-hd"><InfoIcon /> About</div>
                <p className="sc-about-text">{studio.about}</p>
              </div>

              {/* Games */}
              <div className="sc-games">
                <div className="sc-games-icon"><BoxIcon /></div>
                <div>
                  <div className="sc-games-title">Games ({studio.gamesShipped})</div>
                  <div className="sc-games-link">See live games we&apos;ve launched →</div>
                </div>
              </div>

            </div>

            <div className="npc-action-bar">
              <button className="npc-action-seg" aria-label="Pass">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E84624" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
              <button className="npc-action-seg" aria-label="Message">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </button>
              <button className="npc-action-seg" aria-label="Like">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#3DC77A" stroke="#3DC77A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>
          </article>
        </div>
      </div>
    </div>
  )
}
