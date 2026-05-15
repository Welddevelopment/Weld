'use client'

import type { PreviewProfile } from '@/components/matching-preview/preview-types'
import { getInitials } from '@/lib/utils'
import type { PanelKind } from './SwipeCard'

interface Props {
  profile: PreviewProfile
  dragOverlay?: 'like' | 'nope' | null
  dragOpacity?: number
  activePanels?: PanelKind[]
  onPass?: () => void
  onLike?: () => void
  onMessage?: () => void
  onOpenPanel?: (panel: PanelKind) => void
}

function stopDrag(e: React.MouseEvent | React.TouchEvent) {
  e.stopPropagation()
}

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

function getSkillStyle(skill: string) {
  return SKILL_COLORS[skill] ?? { bg: '#f3f4f6', color: '#374151' }
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  )
}

function BriefcaseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
      <rect x="2" y="7" width="20" height="14" rx="2"/>
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="8.01"/>
      <line x1="12" y1="12" x2="12" y2="16"/>
    </svg>
  )
}

function BoxIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 2 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="10" height="10">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  )
}

export default function StudioCard({
  profile,
  dragOverlay = null,
  dragOpacity = 0,
  activePanels = [],
  onPass,
  onLike,
  onMessage,
  onOpenPanel,
}: Props) {
  const initials = getInitials(profile.name) || '?'
  const ss = profile.studioStats ?? {}
  const skills = profile.skillsNeeded ?? []
  const roles = profile.openRoles ?? []
  const gamesActive = activePanels.some(p => p === 'games')
  const rateDisplay = profile.rateMin && profile.rateMax
    ? `$${profile.rateMin}–$${profile.rateMax}/hr`
    : profile.rateMin ? `From $${profile.rateMin}/hr` : null

  return (
    <div className="npc-wrap" onMouseDown={stopDrag} onTouchStart={stopDrag}>
      <div className="npc-card sc-card">

        {/* Drag overlays */}
        {dragOverlay === 'like' && (
          <div className="npc-overlay npc-overlay--like" style={{ opacity: dragOpacity }}>
            <span className="npc-stamp npc-stamp--like">LIKE</span>
          </div>
        )}
        {dragOverlay === 'nope' && (
          <div className="npc-overlay npc-overlay--nope" style={{ opacity: dragOpacity }}>
            <span className="npc-stamp npc-stamp--nope">NOPE</span>
          </div>
        )}

        {/* Top: logo + stats */}
        <div className="sc-top">
          <div className="sc-avatar-wrap">
            <div className="sc-avatar" style={{ background: profile.bg || '#4444EE', position: 'relative' }}>
              {initials}
              {profile.robloxUserId !== 1 && (
                <img
                  src={`/api/roblox/avatar?userId=${profile.robloxUserId}`}
                  alt={profile.name}
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: 20 }}
                />
              )}
            </div>
            <div className="sc-online-dot" />
          </div>
          <div className="sc-stats-box">
            <div className="sc-stats-row">
              <div className="sc-stat"><CalendarIcon /><strong>{ss.yearsBuilding ?? '—'}</strong><em>Building</em></div>
              <div className="sc-stat"><BriefcaseIcon /><strong>{ss.projectsShipped ?? '—'}</strong><em>Projects</em></div>
              <div className="sc-stat"><EyeIcon /><strong>{ss.totalVisits ?? '—'}</strong><em>Visits</em></div>
              <div className="sc-stat"><ClockIcon /><strong>{ss.onTimeDelivery ?? '—'}</strong><em>On-time</em></div>
            </div>
          </div>
        </div>

        {/* Identity */}
        <div className="sc-identity">
          <div className="sc-name-row">
            <h2 className="sc-name">{profile.name}</h2>
            {profile.badge && (
              <span className="npc-verified" title={profile.badge}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                  <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                </svg>
              </span>
            )}
            {profile.hiring && (
              <span className="sc-hiring-pill" style={{ background: '#dcfce7', color: '#15803d' }}>
                <span className="sc-hiring-dot" style={{ background: '#16a34a' }} />
                Actively Hiring
              </span>
            )}
          </div>
          <p className="sc-type">{profile.role}</p>
        </div>

        {/* Bio */}
        <div className="sc-bio-card">
          <p className="sc-bio">{profile.bio}</p>
          <button className="sc-more-btn" aria-hidden="true" tabIndex={-1}>
            <svg width="14" height="20" viewBox="0 0 14 20" fill="none">
              <rect x="0" y="0" width="14" height="20" rx="7" fill="#e2e2ee"/>
              <rect x="4" y="4" width="6" height="8" rx="3" fill="#b0b0c8"/>
            </svg>
          </button>
        </div>

        {/* Info card — 3 columns */}
        <div className="sc-info-card">
          <div className="sc-info-col">
            <div className="sc-info-label">Hiring Rate</div>
            {rateDisplay ? (
              <>
                <div className="sc-rate">{rateDisplay}</div>
                <div className="sc-rate-type">{profile.rateType ?? 'Hourly (USD)'}</div>
                {profile.rateNote && <div className="sc-rate-note">{profile.rateNote}</div>}
              </>
            ) : (
              <div className="sc-rate-note">Not specified</div>
            )}
          </div>

          <div className="sc-info-col">
            <div className="sc-info-label">Looking For</div>
            <div className="sc-chips">
              {skills.slice(0, 5).map(s => {
                const style = getSkillStyle(s.name)
                return (
                  <span key={s.name} className="sc-skill-chip" style={{ background: style.bg, color: style.color }}>
                    {s.name}
                  </span>
                )
              })}
              {skills.length === 0 && <span className="sc-no-roles">Not specified</span>}
            </div>
          </div>

          <div className="sc-info-col">
            <div className="sc-info-label">Open Roles</div>
            {roles.slice(0, 3).map((role, idx) => {
              const rc = getSkillStyle(role.skill)
              return (
                <div key={idx} className="sc-role-row">
                  <span className="sc-role-icon" style={{ background: rc.bg, color: rc.color }}>
                    {(role.skill || '???').slice(0, 2).toUpperCase()}
                  </span>
                  <span className="sc-role-title">{role.title}</span>
                  <ChevronIcon />
                </div>
              )
            })}
            {roles.length === 0 && <span className="sc-no-roles">None open</span>}
          </div>
        </div>

        {/* About */}
        {profile.about && (
          <div className="sc-about">
            <div className="sc-about-hd"><InfoIcon /> About</div>
            <p className="sc-about-text">{profile.about}</p>
          </div>
        )}

        {/* Games */}
        <button
          className="sc-games"
          style={{ width: '100%', border: 'none', textAlign: 'left', cursor: 'pointer', outline: gamesActive ? '2px solid #6c5cff' : 'none' }}
          onMouseDown={stopDrag}
          onClick={e => { e.stopPropagation(); onOpenPanel?.('games') }}
        >
          <div className="sc-games-icon"><BoxIcon /></div>
          <div>
            <div className="sc-games-title">
              Games{(profile.topGames?.length ?? 0) > 0 ? ` (${profile.topGames!.length})` : ''}
            </div>
            <div className="sc-games-link">See live games we&apos;ve launched →</div>
          </div>
        </button>

      </div>

      {/* Action bar */}
      <div className="npc-action-bar">
        <button className="npc-action-seg" onMouseDown={stopDrag} onClick={e => { e.stopPropagation(); onPass?.() }} aria-label="Pass">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E84624" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <button className="npc-action-seg" onMouseDown={stopDrag} onClick={e => { e.stopPropagation(); onMessage?.() }} aria-label="Message">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </button>
        <button className="npc-action-seg" onMouseDown={stopDrag} onClick={e => { e.stopPropagation(); onLike?.() }} aria-label="Like">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#3DC77A" stroke="#3DC77A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
