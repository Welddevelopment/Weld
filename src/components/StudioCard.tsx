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

const ROLE_ICONS: Record<string, React.ReactNode> = {
  code: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  monitor: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
  database: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>,
  settings: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>,
  art: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>,
  gamepad: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12"><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="15" y1="13" x2="15.01" y2="13"/><line x1="18" y1="11" x2="18.01" y2="11"/><rect x="2" y="6" width="20" height="12" rx="2"/></svg>,
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
  const socialLinks = (profile.socials ?? []).filter(s => s.url?.trim())
  const ss = profile.studioStats ?? {}
  const rateDisplay = profile.rateMin && profile.rateMax
    ? `$${profile.rateMin}–$${profile.rateMax}/hr`
    : profile.rateMin ? `From $${profile.rateMin}/hr` : null
  const skills = profile.skillsNeeded ?? []
  const roles = profile.openRoles ?? []
  const gamesActive = activePanels.some(p => p === 'games')

  return (
    <div className="npc-wrap" onMouseDown={stopDrag} onTouchStart={stopDrag}>
      <div className="npc-card">

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

        {/* Top: logo + socials + stats */}
        <div className="npc-top">
          {/* Studio logo — square with rounded corners, same size as avatar */}
          <div className="npc-avatar-wrap" style={{ borderRadius: 16 }}>
            <div className="npc-avatar-bg" style={{ background: profile.bg || '#4444EE' }} />
            <div className="npc-avatar-initials" style={{ fontSize: 26 }}>{initials}</div>
            {profile.robloxUserId !== 1 && (
              <img
                className="npc-avatar-img"
                src={`https://www.roblox.com/headshot-thumbnail/image?userId=${profile.robloxUserId}&width=150&height=150&format=png`}
                alt={profile.name}
                onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            )}
            <div className="npc-online-dot" />
          </div>

          <div className="npc-top-right">
            {socialLinks.length > 0 && (
              <div className="npc-socials">
                {socialLinks.slice(0, 4).map(s => (
                  <a key={s.label} href={s.url} target="_blank" rel="noreferrer" className="npc-social-btn" onMouseDown={stopDrag} title={s.label}>
                    {s.icon || s.label[0]}
                  </a>
                ))}
              </div>
            )}
            <div className="npc-stats">
              <div className="npc-stat">
                <div className="npc-stat-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>
                <div className="npc-stat-val">{ss.yearsBuilding ?? '—'}</div>
                <div className="npc-stat-lbl">Building</div>
              </div>
              <div className="npc-stat">
                <div className="npc-stat-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 2 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg></div>
                <div className="npc-stat-val">{ss.projectsShipped ?? '—'}</div>
                <div className="npc-stat-lbl">Projects</div>
              </div>
              <div className="npc-stat">
                <div className="npc-stat-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></div>
                <div className="npc-stat-val">{ss.totalVisits ?? '—'}</div>
                <div className="npc-stat-lbl">Visits</div>
              </div>
              <div className="npc-stat">
                <div className="npc-stat-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
                <div className="npc-stat-val">{ss.onTimeDelivery ?? '—'}</div>
                <div className="npc-stat-lbl">On-time</div>
              </div>
            </div>
          </div>
        </div>

        {/* Identity */}
        <div className="npc-identity">
          <div className="npc-name-row" style={{ alignItems: 'center', gap: 6 }}>
            <h2 className="npc-name" style={{ flex: 1, minWidth: 0 }}>{profile.name}</h2>
            {profile.badge && (
              <span className="npc-verified" title={profile.badge}>
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>
              </span>
            )}
            {profile.hiring && (
              <span className="sc-hiring-pill">
                <span className="sc-hiring-dot" />
                Actively Hiring
              </span>
            )}
          </div>
          <p className="npc-role">{profile.role}</p>
        </div>

        <div className="npc-divider" />

        {/* Bio */}
        <p className="npc-bio" style={{ minHeight: 0 }}>{profile.bio}</p>

        {/* 3-column info grid */}
        <div className="sc-info-grid">
          {/* Hiring rate */}
          <div className="sc-info-col">
            <div className="sc-col-heading">Hiring Rate</div>
            {rateDisplay
              ? <>
                  <div className="sc-rate-range">{rateDisplay}</div>
                  <div className="sc-rate-type">{profile.rateType ?? 'Hourly or milestone'}</div>
                  {profile.rateNote && <div className="sc-rate-note">{profile.rateNote}</div>}
                </>
              : <div className="sc-rate-note">Not specified</div>
            }
          </div>

          {/* Skills needed */}
          <div className="sc-info-col">
            <div className="sc-col-heading">Looking For</div>
            <div className="sc-skill-tags">
              {skills.slice(0, 6).map(s => (
                <button
                  key={s.name}
                  className="sc-skill-tag sc-skill-tag--btn"
                  onMouseDown={stopDrag}
                  onClick={e => { e.stopPropagation(); onOpenPanel?.({ skill: s.name }) }}
                >
                  {s.name}
                </button>
              ))}
              {skills.length === 0 && <span className="sc-rate-note">Not specified</span>}
            </div>
          </div>

          {/* Open roles */}
          <div className="sc-info-col" style={{ borderRight: 'none' }}>
            <div className="sc-col-heading">Open Roles</div>
            {roles.slice(0, 4).map(role => {
              const isActive = activePanels.some(p => typeof p === 'object' && 'role' in p && p.role === role.title)
              return (
                <button
                  key={role.title}
                  className={`sc-role-btn${isActive ? ' sc-role-btn--active' : ''}`}
                  onMouseDown={stopDrag}
                  onClick={e => { e.stopPropagation(); onOpenPanel?.({ role: role.title }) }}
                >
                  <span className="sc-role-icon">{ROLE_ICONS[role.icon] ?? ROLE_ICONS.code}</span>
                  <span className="sc-role-name">{role.title}</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="8" height="8" className="sc-role-chevron"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              )
            })}
            {roles.length === 0 && <span className="sc-rate-note">None listed</span>}
          </div>
        </div>

        {/* About */}
        {profile.about && (
          <div className="sc-about">
            <div className="sc-about-heading">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              About
            </div>
            <p className="sc-about-text">{profile.about}</p>
          </div>
        )}

        {/* Entry — Games only */}
        <div className="npc-entries" style={{ gridTemplateColumns: '1fr', marginTop: 'auto' }}>
          <button
            className={`npc-entry-btn${gamesActive ? ' npc-entry-btn--active' : ''}`}
            onMouseDown={stopDrag}
            onClick={e => { e.stopPropagation(); onOpenPanel?.('games') }}
          >
            <div className="npc-entry-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 2 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
            </div>
            <div className="npc-entry-title">Games{(profile.topGames?.length ?? 0) > 0 ? ` (${profile.topGames!.length})` : ''}</div>
            <div className="npc-entry-sub">See live games we&apos;ve launched →</div>
          </button>
        </div>

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
