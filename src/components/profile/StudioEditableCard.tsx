'use client'

import { ProfileDraft } from './profile-types'
import { getInitials } from '@/lib/utils'

const GRADIENTS = [
  'linear-gradient(135deg,#E84624,#FF8A5C)',
  'linear-gradient(135deg,#6C3DE8,#B57BFF)',
  'linear-gradient(135deg,#1A6BE8,#5BBCFF)',
  'linear-gradient(135deg,#1AB87A,#5BFFB8)',
  'linear-gradient(135deg,#E8901A,#FFD05B)',
  'linear-gradient(135deg,#1A3CE8,#5B7FFF)',
  'linear-gradient(135deg,#2D2D2D,#666)',
]

interface Props {
  draft: ProfileDraft
  update: (patch: Partial<ProfileDraft>) => void
  leftPanel: null | 'games'
  rightPanel: null | 'roles' | 'info'
  onToggleLeft: () => void
  onToggleRight: (p: 'roles' | 'info') => void
  onBack: () => void
  onBackLabel?: string
  onPublish: () => void
  showScrollActions?: boolean
}

function rateDisplay(draft: ProfileDraft): string | null {
  if (draft.rateMin && draft.rateMax) return `$${draft.rateMin}–$${draft.rateMax}/hr`
  if (draft.rateMin) return `From $${draft.rateMin}/hr`
  return null
}

const ROLE_ICONS: Record<string, React.ReactNode> = {
  code: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  monitor: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
  database: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>,
  settings: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>,
  art: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>,
  gamepad: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12"><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="15" y1="13" x2="15.01" y2="13"/><line x1="18" y1="11" x2="18.01" y2="11"/><rect x="2" y="6" width="20" height="12" rx="2"/></svg>,
}

export default function StudioEditableCard({
  draft,
  update,
  leftPanel,
  rightPanel,
  onToggleLeft,
  onToggleRight,
  onBack,
  onBackLabel = '← Back',
  onPublish,
  showScrollActions = false,
}: Props) {
  const initials = getInitials(draft.name) || '?'
  const rate = rateDisplay(draft)
  const skills = draft.selectedSkills
  const roles = draft.openRoles
  const ss = draft.studioStats

  return (
    <div className="npc-wrap">
      <div className="npc-card">

        {/* Top: logo + stats */}
        <div className="npc-top">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
            {/* Square logo */}
            <div className="npc-avatar-wrap" style={{ borderRadius: 16, position: 'relative' }}>
              <div className="npc-avatar-bg" style={{ background: draft.bg || '#4444EE', borderRadius: 16 }} />
              <div className="npc-avatar-initials" style={{ fontSize: 26 }}>{initials}</div>
              {draft.robloxUserId && (
                <img
                  className="npc-avatar-img"
                  src={`https://www.roblox.com/headshot-thumbnail/image?userId=${draft.robloxUserId}&width=150&height=150&format=png`}
                  alt={draft.name}
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              )}
              <div className="npc-online-dot" />
            </div>
            {/* Color swatches */}
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 80 }}>
              {GRADIENTS.map(g => (
                <button
                  key={g}
                  type="button"
                  onClick={() => update({ bg: g })}
                  style={{
                    width: 16, height: 16, borderRadius: 4, background: g, border: 'none',
                    cursor: 'pointer', flexShrink: 0,
                    outline: draft.bg === g ? '2px solid #fff' : '2px solid transparent',
                    outlineOffset: 1,
                  }}
                />
              ))}
            </div>
          </div>

          <div className="npc-top-right">
            <div className="npc-stats">
              <div className="npc-stat">
                <div className="npc-stat-val">
                  <input
                    className="npc-stat-editable"
                    value={ss.yearsBuilding}
                    onChange={e => update({ studioStats: { ...ss, yearsBuilding: e.target.value } })}
                    placeholder="—"
                  />
                </div>
                <div className="npc-stat-lbl">Building</div>
              </div>
              <div className="npc-stat">
                <div className="npc-stat-val">
                  <input
                    className="npc-stat-editable"
                    value={ss.projectsShipped}
                    onChange={e => update({ studioStats: { ...ss, projectsShipped: e.target.value } })}
                    placeholder="—"
                  />
                </div>
                <div className="npc-stat-lbl">Projects</div>
              </div>
              <div className="npc-stat">
                <div className="npc-stat-val">
                  <input
                    className="npc-stat-editable"
                    value={ss.totalVisits}
                    onChange={e => update({ studioStats: { ...ss, totalVisits: e.target.value } })}
                    placeholder="—"
                  />
                </div>
                <div className="npc-stat-lbl">Visits</div>
              </div>
              <div className="npc-stat">
                <div className="npc-stat-val">
                  <input
                    className="npc-stat-editable"
                    value={ss.onTimeDelivery}
                    onChange={e => update({ studioStats: { ...ss, onTimeDelivery: e.target.value } })}
                    placeholder="—"
                  />
                </div>
                <div className="npc-stat-lbl">On-time</div>
              </div>
            </div>
          </div>
        </div>

        {/* Identity */}
        <div className="npc-identity">
          <div className="npc-name-row" style={{ alignItems: 'center', gap: 6 }}>
            <input
              className="npc-editable-name"
              value={draft.name}
              onChange={e => update({ name: e.target.value })}
              placeholder="Studio name"
            />
            <label style={{ display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer', flexShrink: 0 }}>
              <input
                type="checkbox"
                checked={draft.hiring}
                onChange={e => update({ hiring: e.target.checked })}
                style={{ width: 12, height: 12, accentColor: '#3DC77A' }}
              />
              {draft.hiring && <span className="sc-hiring-pill"><span className="sc-hiring-dot" />Actively Hiring</span>}
              {!draft.hiring && <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>Show hiring</span>}
            </label>
          </div>
          <p className="npc-role">
            {draft.type === 'studio' ? 'Roblox Game Studio' : 'Studio'}
            {draft.teamSize ? ` · ${draft.teamSize} members` : ''}
          </p>
        </div>

        <div className="npc-divider" />

        {/* Bio */}
        <textarea
          className="npc-editable-bio"
          value={draft.bio}
          onChange={e => update({ bio: e.target.value })}
          placeholder="Short bio about your studio…"
          rows={2}
        />

        {/* 3-col info grid — read-only display, panels handle editing */}
        <div className="sc-info-grid">
          <div className="sc-info-col">
            <div className="sc-col-heading">Hiring Rate</div>
            {rate
              ? <>
                  <div className="sc-rate-range">{rate}</div>
                  <div className="sc-rate-type">{draft.rateType ?? 'Hourly or milestone'}</div>
                  {draft.rateNote && <div className="sc-rate-note">{draft.rateNote}</div>}
                </>
              : <div className="sc-rate-note" style={{ cursor: 'pointer' }} onClick={() => onToggleRight('info')}>+ Add rate</div>
            }
          </div>

          <div className="sc-info-col">
            <div className="sc-col-heading">Looking For</div>
            <div className="sc-skill-tags">
              {skills.slice(0, 6).map(s => (
                <span key={s.name} className="sc-skill-tag">{s.name}</span>
              ))}
              {skills.length === 0 && (
                <span className="sc-rate-note" style={{ cursor: 'pointer' }} onClick={() => onToggleRight('info')}>
                  + Add skills
                </span>
              )}
            </div>
          </div>

          <div className="sc-info-col" style={{ borderRight: 'none' }}>
            <div className="sc-col-heading">Open Roles</div>
            {roles.slice(0, 4).map(role => {
              const isActive = rightPanel === 'roles'
              return (
                <button
                  key={role.title}
                  className={`sc-role-btn${isActive ? ' sc-role-btn--active' : ''}`}
                  onClick={() => onToggleRight('roles')}
                >
                  <span className="sc-role-icon">{ROLE_ICONS[role.icon] ?? ROLE_ICONS.code}</span>
                  <span className="sc-role-name">{role.title || 'Untitled role'}</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="8" height="8" className="sc-role-chevron"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              )
            })}
            {roles.length === 0 && (
              <span className="sc-rate-note" style={{ cursor: 'pointer' }} onClick={() => onToggleRight('roles')}>
                + Add roles
              </span>
            )}
          </div>
        </div>

        {/* About */}
        <div className="sc-about">
          <div className="sc-about-heading">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            About
          </div>
          <textarea
            className="npc-editable-bio"
            value={draft.about}
            onChange={e => update({ about: e.target.value })}
            placeholder="Your studio's story, mission, or what makes you different…"
            rows={2}
          />
        </div>

        {/* Entry buttons */}
        <div className="npc-entries" style={{ gridTemplateColumns: '1fr 1fr 1fr', marginTop: 'auto' }}>
          <button
            className={`npc-entry-btn${leftPanel === 'games' ? ' npc-entry-btn--active' : ''}`}
            onClick={onToggleLeft}
          >
            <div className="npc-entry-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 2 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
            </div>
            <div className="npc-entry-title">Games</div>
            <div className="npc-entry-sub">{draft.topGames.length > 0 ? `${draft.topGames.length} listed` : 'Add games'}</div>
          </button>

          <button
            className={`npc-entry-btn${rightPanel === 'roles' ? ' npc-entry-btn--active' : ''}`}
            onClick={() => onToggleRight('roles')}
          >
            <div className="npc-entry-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div className="npc-entry-title">Roles</div>
            <div className="npc-entry-sub">{roles.length > 0 ? `${roles.length} open` : 'Add roles'}</div>
          </button>

          <button
            className={`npc-entry-btn${rightPanel === 'info' ? ' npc-entry-btn--active' : ''}`}
            onClick={() => onToggleRight('info')}
          >
            <div className="npc-entry-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <div className="npc-entry-title">Details</div>
            <div className="npc-entry-sub">Rate, skills & stats</div>
          </button>
        </div>

      </div>

      {/* Action bar */}
      <div className="npc-action-bar" style={{ justifyContent: 'space-between', padding: '0 16px' }}>
        <button
          type="button"
          className="pb-btn pb-btn--ghost"
          style={{ fontSize: 11, padding: '8px 14px' }}
          onClick={onBack}
        >
          {onBackLabel}
        </button>
        {showScrollActions && (
          <button
            type="button"
            className="pb-btn pb-btn--primary"
            style={{ fontSize: 11, padding: '8px 18px' }}
            onClick={onPublish}
          >
            Publish profile
          </button>
        )}
        {!showScrollActions && (
          <button
            type="button"
            className="pb-btn pb-btn--primary"
            style={{ fontSize: 11, padding: '8px 18px' }}
            onClick={onPublish}
          >
            Publish profile
          </button>
        )}
      </div>
    </div>
  )
}
