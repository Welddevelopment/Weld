'use client'

import { ProfileDraft } from '../profile-types'
import { DEV_SKILL_DESCS } from '@/components/matching-preview/preview-data'

interface Props {
  draft: ProfileDraft
  update: (patch: Partial<ProfileDraft>) => void
  onClose: () => void
}

type RoleEntry = { skill: string; title: string; description: string }

const ALL_SKILLS = Object.keys(DEV_SKILL_DESCS)

function emptyRole(): RoleEntry {
  return { skill: '', title: '', description: '' }
}

export default function StudioRolesEditPanel({ draft, update, onClose }: Props) {
  const roles = draft.openRoles

  const getSkillDesc = (name: string) => draft.skillDescriptions[name] ?? ''

  const setSkillDesc = (name: string, description: string) => {
    if (!name) return
    update({ skillDescriptions: { ...draft.skillDescriptions, [name]: description } })
  }

  const add = () => {
    if (roles.length >= 6) return
    update({ openRoles: [...roles, emptyRole()] })
  }

  const remove = (i: number) => {
    update({ openRoles: roles.filter((_, idx) => idx !== i) })
  }

  const change = (i: number, patch: Partial<RoleEntry>) => {
    const next = [...roles]
    next[i] = { ...next[i], ...patch }
    update({ openRoles: next })
  }

  return (
    <div className="npc-panel">
      <div className="npc-panel-hd">
        <button className="npc-panel-back" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Close
        </button>
        <h2 className="npc-panel-title">Open Roles</h2>
        <p className="npc-panel-sub">Roles you&apos;re actively hiring for.</p>
      </div>

      <div className="npc-panel-body">
        {roles.map((role, i) => (
          <div key={i} className="pb-entry-card">
            <div className="pb-entry-card-header">
              <span className="pb-entry-card-label">Role {i + 1}</span>
              <button type="button" className="pb-entry-card-remove" onClick={() => remove(i)}>Remove</button>
            </div>

            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 11, color: '#666', marginBottom: 5 }}>Skill type</div>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                {ALL_SKILLS.map(name => (
                  <button
                    key={name}
                    type="button"
                    className={`pb-emoji-btn${role.skill === name ? ' pb-emoji-btn--on' : ''}`}
                    style={{ fontSize: 11 }}
                    onClick={() => change(i, { skill: name })}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            <input
              className="pb-panel-input"
              placeholder="Role title (e.g. Lead Scripter)"
              value={role.title}
              onChange={e => change(i, { title: e.target.value })}
            />
            {role.skill && (
              <textarea
                className="pb-panel-textarea"
                style={{ marginTop: 6 }}
                rows={2}
                placeholder={`What should developers know about your ${role.skill} needs?`}
                value={getSkillDesc(role.skill)}
                onChange={e => setSkillDesc(role.skill, e.target.value)}
              />
            )}
            <textarea
              className="pb-panel-textarea"
              style={{ marginTop: 6 }}
              rows={2}
              placeholder="What will they work on? What experience is required?"
              value={role.description}
              onChange={e => change(i, { description: e.target.value })}
            />
          </div>
        ))}

        {roles.length < 6 && (
          <button type="button" className="pb-edit-add-btn" onClick={add}>
            + Add role
          </button>
        )}

        {roles.length === 0 && (
          <p style={{ color: '#bbb', fontSize: 12, textAlign: 'center', marginTop: 8 }}>
            Add the specific roles you&apos;re hiring for.
          </p>
        )}
      </div>
    </div>
  )
}
