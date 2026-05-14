'use client'

import { ProfileDraft } from './profile-types'
import { getInitials } from '@/lib/utils'


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
}

function rateDisplay(draft: ProfileDraft): string | null {
  if (draft.rateMin && draft.rateMax) return `$${draft.rateMin}–$${draft.rateMax}/hr`
  if (draft.rateMin) return `From $${draft.rateMin}/hr`
  return null
}

const SKILL_COLORS = ['#a78bfa', '#34d399', '#fb923c', '#60a5fa', '#f472b6', '#facc15']
function skillColor(name: string | undefined) {
  if (!name) return SKILL_COLORS[0]
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  return SKILL_COLORS[h % SKILL_COLORS.length]
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
}: Props) {
  const initials = getInitials(draft.name) || '?'
  const rate = rateDisplay(draft)
  const roles = draft.openRoles
  const skills = [...new Set(roles.map(r => r.skill).filter(Boolean))]
  const ss = draft.studioStats

  return (
    <div className="npc-wrap">
      <div className="npc-card">

        {/* Top: logo + stats */}
        <div className="npc-top">
          <div className="npc-avatar-wrap" style={{ borderRadius: 16 }}>
            <div className="npc-avatar-bg" style={{ background: draft.bg || '#4444EE', borderRadius: 16 }} />
            <div className="npc-avatar-initials" style={{ fontSize: 26 }}>{initials}</div>
            {draft.robloxUserId && (
              <img
                className="npc-avatar-img"
                src={`/api/roblox/avatar?userId=${draft.robloxUserId}`}
                alt={draft.name}
                onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            )}
            <div className="npc-online-dot" />
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
                <span key={s} className="sc-skill-tag">{s}</span>
              ))}
              {skills.length === 0 && (
                <span className="sc-rate-note" style={{ cursor: 'pointer' }} onClick={() => onToggleRight('roles')}>
                  + Add roles
                </span>
              )}
            </div>
          </div>

          <div className="sc-info-col" style={{ borderRight: 'none' }}>
            <div className="sc-col-heading">Open Roles</div>
            {roles.slice(0, 4).map((role, idx) => {
              const c = skillColor(role.skill)
              const isActive = rightPanel === 'roles'
              return (
                <button
                  key={idx}
                  className={`sc-role-btn${isActive ? ' sc-role-btn--active' : ''}`}
                  onClick={() => onToggleRight('roles')}
                >
                  <span className="sc-role-icon" style={{ width: 14, height: 14, borderRadius: 3, background: `${c}22`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 7, fontWeight: 800, color: c, lineHeight: 1 }}>{(role.skill || '???').slice(0, 3)}</span>
                  </span>
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
        <button
          type="button"
          className="pb-btn pb-btn--primary"
          style={{ fontSize: 11, padding: '8px 18px' }}
          onClick={onPublish}
        >
          Publish profile
        </button>
      </div>
    </div>
  )
}
