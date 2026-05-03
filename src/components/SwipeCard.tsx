'use client'

import type { PreviewProfile } from '@/components/matching-preview/preview-types'
import { getInitials } from '@/lib/utils'

export type PanelKind = 'games' | 'work' | { skill: string; role?: string }

interface Props {
  profile: PreviewProfile
  dragOverlay?: 'like' | 'nope' | null
  dragOpacity?: number
  leftPanel?: 'games' | null
  rightPanel?: 'work' | { skill: string } | null
  onPass?: () => void
  onLike?: () => void
  onMessage?: () => void
  onOpenPanel?: (panel: PanelKind) => void
}

function stopDrag(e: React.MouseEvent | React.TouchEvent) {
  e.stopPropagation()
}

function Avatar({ profile }: { profile: PreviewProfile }) {
  const initials = getInitials(profile.name) || '?'
  return (
    <div className="npc-avatar-wrap">
      <div className="npc-avatar-bg" style={{ background: profile.bg }} />
      <div className="npc-avatar-initials">{initials}</div>
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
  )
}

function StatItem({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="npc-stat">
      <div className="npc-stat-icon">{icon}</div>
      <div className="npc-stat-val">{value}</div>
      <div className="npc-stat-lbl">{label}</div>
    </div>
  )
}

type CardStats = { experience: string; projects: string; scriptsBuilt: string; onTime: string; rate: string }

function parseDevStats(profile: PreviewProfile): CardStats {
  const rate = profile.meta.match(/Rate:\s*([^-]+)/)?.[1]?.trim() ?? '—'
  if (profile.stats) {
    return { ...profile.stats, rate }
  }
  const expMatch = profile.role.match(/(\d+)yr/)
  const experience = expMatch ? `${expMatch[1]}+ yrs` : profile.role.includes('<1yr') ? '<1 yr' : '—'
  return { experience, rate, projects: '—', scriptsBuilt: '—', onTime: '—' }
}

export default function SwipeCard({
  profile,
  dragOverlay = null,
  dragOpacity = 0,
  leftPanel = null,
  rightPanel = null,
  onPass,
  onLike,
  onMessage,
  onOpenPanel,
}: Props) {
  const skills = profile.skills ?? profile.skillsNeeded ?? []
  const devStats = parseDevStats(profile)
  const socialLinks = (profile.socials ?? []).filter(s => s.url?.trim())

  const activeSkill = rightPanel && typeof rightPanel === 'object' && 'skill' in rightPanel
    ? rightPanel.skill
    : null

  return (
    <div className="npc-wrap" onMouseDown={stopDrag} onTouchStart={stopDrag}>
      {/* Card face */}
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

        {/* Top: avatar + stats + socials */}
        <div className="npc-top">
          <Avatar profile={profile} />

          <div className="npc-top-right">
            <div className="npc-stats">
              <StatItem
                icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
                value={devStats.experience}
                label="Experience"
              />
              <StatItem
                icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>}
                value={devStats.projects}
                label="Projects"
              />
              <StatItem
                icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>}
                value={devStats.scriptsBuilt}
                label="Scripts"
              />
              <StatItem
                icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>}
                value={skills.length > 0 ? String(skills.length) : '—'}
                label="Skills"
              />
            </div>

            {socialLinks.length > 0 && (
              <div className="npc-socials" style={{ marginTop: 6 }}>
                {socialLinks.slice(0, 4).map(s => (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="npc-social-btn"
                    onMouseDown={stopDrag}
                    title={s.label}
                  >
                    {s.icon || s.label[0]}
                  </a>
                ))}
              </div>
            )}
            {(profile.portfolio?.links ?? []).filter(l => l.url?.trim()).slice(0, 2).map(link => (
              <a
                key={link.url}
                href={/^https?:\/\//i.test(link.url) ? link.url : `https://${link.url}`}
                target="_blank"
                rel="noreferrer"
                className="npc-portfolio-top-link"
                onMouseDown={stopDrag}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="10" height="10"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                {link.name || link.url}
              </a>
            ))}
          </div>
        </div>

        {/* Identity */}
        <div className="npc-identity">
          <div className="npc-name-row">
            <h2 className="npc-name">{profile.name || 'Your Name'}</h2>
            {profile.badge && (
              <span className="npc-verified" title={profile.badge}>
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>
              </span>
            )}
          </div>
          <p className="npc-role">{profile.role.replace(/^Developer - /, '')}</p>
        </div>

        <div className="npc-divider" />

        <p className="npc-bio">{profile.bio}</p>

        {/* Rate pill + skill chips */}
        <div className="npc-rate-skills">
          {devStats.rate && devStats.rate !== '—' && (
            <div className="npc-rate-pill">
              <div className="npc-rate-amount">{devStats.rate}</div>
              <div className="npc-rate-type">Hourly or milestone</div>
            </div>
          )}
          <div className="npc-skills-wrap">
            {skills.map(s => (
              <button
                key={s.name}
                className={`npc-skill-chip${activeSkill === s.name ? ' npc-skill-chip--active' : ''}`}
                onMouseDown={stopDrag}
                onClick={e => { e.stopPropagation(); onOpenPanel?.({ skill: s.name }) }}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        {/* Entry buttons */}
        <div className="npc-entries">
          <button
            className={`npc-entry-btn${leftPanel === 'games' ? ' npc-entry-btn--active' : ''}`}
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
            <div className="npc-entry-title">Games</div>
            <div className="npc-entry-sub">See games I&apos;ve worked on →</div>
          </button>

          <button
            className={`npc-entry-btn${rightPanel === 'work' ? ' npc-entry-btn--active' : ''}`}
            onMouseDown={stopDrag}
            onClick={e => { e.stopPropagation(); onOpenPanel?.('work') }}
          >
            <div className="npc-entry-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <div className="npc-entry-title">My Work</div>
            <div className="npc-entry-sub">View projects I&apos;ve built →</div>
          </button>
        </div>
      </div>

      {/* Action bar */}
      <div className="npc-action-bar">
        <button
          className="npc-action-seg"
          onMouseDown={stopDrag}
          onClick={e => { e.stopPropagation(); onPass?.() }}
          aria-label="Pass"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E84624" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <button
          className="npc-action-seg"
          onMouseDown={stopDrag}
          onClick={e => { e.stopPropagation(); onMessage?.() }}
          aria-label="Message"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </button>

        <button
          className="npc-action-seg"
          onMouseDown={stopDrag}
          onClick={e => { e.stopPropagation(); onLike?.() }}
          aria-label="Like"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#3DC77A" stroke="#3DC77A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
