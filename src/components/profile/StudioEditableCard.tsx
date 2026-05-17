'use client'

import { useState } from 'react'
import { ProfileDraft } from './profile-types'
import { getInitials } from '@/lib/utils'

function parseRobloxUserId(value: string): number | null {
  const match = value.match(/\/users\/(\d+)/)
  if (match) return Number(match[1])
  if (/^\d+$/.test(value.trim())) return Number(value.trim())
  return null
}

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
  publishLabel?: string
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
  publishLabel = 'Publish profile',
}: Props) {
  const [showRobloxInput, setShowRobloxInput] = useState(false)
  const [robloxInputVal, setRobloxInputVal] = useState(
    draft.robloxUserId ? `https://www.roblox.com/users/${draft.robloxUserId}/profile` : ''
  )
  const [robloxInputError, setRobloxInputError] = useState(false)
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
          <button
            type="button"
            className="npc-avatar-wrap"
            onClick={() => setShowRobloxInput(true)}
            title="Tap to set Roblox avatar"
          >
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
            <div className="npc-avatar-edit-badge" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="10" height="10">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </div>
          </button>

          <div className="npc-top-right">
            <div className="npc-stats">
              <div className="npc-stat">
                <div className="npc-stat-icon" aria-hidden>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
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
                <div className="npc-stat-icon" aria-hidden>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <path d="M8 21h8M12 17v4" />
                  </svg>
                </div>
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
                <div className="npc-stat-icon" aria-hidden>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
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
                <div className="npc-stat-icon" aria-hidden>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
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
              {!draft.hiring && <span className="sc-studio-hiring-hint">Show hiring</span>}
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
        <div className="sc-info-card">
          <div className="sc-info-col">
            <div className="sc-info-label">Hiring Rate</div>
            {rate
              ? <>
                  <div className="sc-rate">{rate}</div>
                  <div className="sc-rate-type">{draft.rateType ?? 'Hourly or milestone'}</div>
                  {draft.rateNote && <div className="sc-rate-note">{draft.rateNote}</div>}
                </>
              : <div className="sc-rate-note" style={{ cursor: 'pointer' }} onClick={() => onToggleRight('info')}>+ Add rate</div>
            }
          </div>

          <div className="sc-info-col">
            <div className="sc-info-label">Looking For</div>
            <div className="sc-chips">
              {skills.slice(0, 6).map(s => (
                <span key={s} className="sc-skill-chip" style={{ background: '#f3f4f6', color: '#374151' }}>{s}</span>
              ))}
              {skills.length === 0 && (
                <span className="sc-rate-note" style={{ cursor: 'pointer' }} onClick={() => onToggleRight('roles')}>
                  + Add roles
                </span>
              )}
            </div>
          </div>

          <div className="sc-info-col">
            <div className="sc-info-label">Open Roles</div>
            {roles.slice(0, 4).map((role, idx) => {
              const c = skillColor(role.skill)
              return (
                <button
                  key={idx}
                  type="button"
                  className={`sc-role-row${rightPanel === 'roles' ? ' sc-role-row--active' : ''}`}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, width: '100%', textAlign: 'left' }}
                  onClick={() => onToggleRight('roles')}
                >
                  <span className="sc-role-icon" style={{ background: `${c}22`, color: c }}>
                    {(role.skill || '???').slice(0, 2).toUpperCase()}
                  </span>
                  <span className="sc-role-title">{role.title || 'Untitled role'}</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="8" height="8"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              )
            })}
            {roles.length === 0 && (
              <span className="sc-no-roles" style={{ cursor: 'pointer' }} onClick={() => onToggleRight('roles')}>
                + Add roles
              </span>
            )}
          </div>
        </div>

        {/* Entry buttons */}
        <div className="npc-entries npc-entries--editor-tail" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
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

        {/* Roblox ID input popup */}
        {showRobloxInput && (
          <div
            className="pb-glass-modal"
            role="presentation"
            onClick={() => setShowRobloxInput(false)}
          >
            <div className="pb-glass-modal__panel" role="dialog" aria-labelledby="pb-studio-roblox-modal-title" onClick={e => e.stopPropagation()}>
              <div id="pb-studio-roblox-modal-title" className="pb-glass-modal__title">Set Roblox Avatar</div>
              <p className="pb-glass-modal__desc">Paste your Roblox profile URL or numeric user ID.</p>
              <input
                className={`pb-glass-modal__input${robloxInputError ? ' pb-glass-modal__input--error' : ''}`}
                value={robloxInputVal}
                onChange={e => { setRobloxInputVal(e.target.value); setRobloxInputError(false) }}
                placeholder="https://www.roblox.com/users/12345/profile"
                autoFocus
              />
              {robloxInputError && (
                <p className="pb-glass-modal__error">Paste a Roblox profile URL or numeric user ID.</p>
              )}
              <div className="pb-glass-modal__actions">
                <button
                  type="button"
                  className="pb-glass-modal__btn pb-glass-modal__btn--primary"
                  onClick={() => {
                    const id = parseRobloxUserId(robloxInputVal)
                    if (id) { update({ robloxUserId: id }); setShowRobloxInput(false); setRobloxInputError(false) }
                    else setRobloxInputError(true)
                  }}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="pb-glass-modal__btn pb-glass-modal__btn--ghost"
                  onClick={() => setShowRobloxInput(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
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
          {publishLabel}
        </button>
      </div>
    </div>
  )
}
