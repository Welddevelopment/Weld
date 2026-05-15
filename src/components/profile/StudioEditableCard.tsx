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
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', borderRadius: 16 }}
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
            <div style={{
              position: 'absolute', bottom: 0, right: 0,
              width: 20, height: 20, borderRadius: '50%',
              background: '#fff', border: '1.5px solid #e0e0e0',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
            }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="10" height="10">
                <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
            </div>
          </button>

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

        {/* Roblox ID input popup */}
        {showRobloxInput && (
          <div
            style={{ position: 'absolute', inset: 0, zIndex: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
            onClick={() => setShowRobloxInput(false)}
          >
            <div
              style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 8px 40px rgba(0,0,0,0.18)', width: '100%' }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ fontWeight: 800, fontSize: 16, color: '#111', marginBottom: 8 }}>Set Roblox Avatar</div>
              <p style={{ fontSize: 12, color: '#666', marginBottom: 12 }}>Paste your Roblox profile URL or numeric user ID.</p>
              <input
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: `1.5px solid ${robloxInputError ? '#e84624' : '#e0e0e0'}`, fontSize: 13, color: '#111', marginBottom: robloxInputError ? 6 : 12, boxSizing: 'border-box' }}
                value={robloxInputVal}
                onChange={e => { setRobloxInputVal(e.target.value); setRobloxInputError(false) }}
                placeholder="https://www.roblox.com/users/12345/profile"
                autoFocus
              />
              {robloxInputError && (
                <p style={{ fontSize: 11, color: '#e84624', margin: '0 0 10px' }}>Paste a Roblox profile URL or numeric user ID.</p>
              )}
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  style={{ flex: 1, padding: '8px 0', borderRadius: 8, border: 'none', background: '#6c5cff', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
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
                  style={{ flex: 1, padding: '8px 0', borderRadius: 8, border: '1.5px solid #e0e0e0', background: 'none', fontSize: 13, color: '#666', cursor: 'pointer' }}
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
