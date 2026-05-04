'use client'

import { ProfileDraft } from '../profile-types'
import { DEV_SKILL_DESCS } from '@/components/matching-preview/preview-data'

interface Props {
  draft: ProfileDraft
  update: (patch: Partial<ProfileDraft>) => void
  onNext: () => void
  onBack: () => void
}

type RoleEntry = { skill: string; title: string; description: string }

const ALL_SKILLS = Object.keys(DEV_SKILL_DESCS)

function emptyRole(): RoleEntry {
  return { skill: '', title: '', description: '' }
}

export default function StudioRolesStep({ draft, update, onNext, onBack }: Props) {
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
    <div className="ob-screen">
      <aside className="ob-side ob-side--dark">
        <div className="ob-brand ob-brand--light">
          <span className="ob-mark">*</span>
          <span>weld.</span>
        </div>
        <h1 className="ob-title ob-title--light">open<br />roles</h1>
        <p className="ob-copy ob-copy--light">
          List the specific roles you&apos;re hiring for. Developers can click each one to see the full details.
        </p>
        <div className="ob-note-card">
          <strong>Be specific</strong>
          <span>Named roles (e.g. &quot;Lead Scripter&quot;) convert better than generic listings.</span>
        </div>
      </aside>

      <section className="ob-main">
        <div className="ob-progress"><span style={{ width: `${(5 / 6) * 100}%` }} /></div>
        <div className="ob-step-row">
          <span>Step 5 of 6 — Open Roles</span>
          <span>5/6</span>
        </div>

        {roles.map((role, i) => (
          <div key={i} className="pb-entry-card">
            <div className="pb-entry-card-header">
              <span className="pb-entry-card-label">Role {i + 1}</span>
              <button type="button" className="pb-entry-card-remove" onClick={() => remove(i)}>Remove</button>
            </div>

            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginBottom: 5 }}>Skill type</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {ALL_SKILLS.map(name => (
                  <button
                    key={name}
                    type="button"
                    className={`pb-option-pill${role.skill === name ? ' pb-option-pill--on' : ''}`}
                    style={{ fontSize: 11 }}
                    onClick={() => change(i, { skill: name })}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            <input
              className="pb-input"
              placeholder="Role title (e.g. Lead Scripter)"
              value={role.title}
              onChange={e => change(i, { title: e.target.value })}
            />
            {role.skill && (
              <textarea
                className="pb-textarea"
                style={{ marginTop: 8 }}
                rows={2}
                placeholder={`What should developers know about your ${role.skill} needs?`}
                value={getSkillDesc(role.skill)}
                onChange={e => setSkillDesc(role.skill, e.target.value)}
              />
            )}
            <textarea
              className="pb-textarea"
              style={{ marginTop: 8 }}
              rows={2}
              placeholder="What will this person work on? What experience do you need?"
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
          <p style={{ color: '#bbb', fontSize: 12, textAlign: 'center', marginTop: 4 }}>
            No open roles yet — or skip this and add them later.
          </p>
        )}

        <div className="pb-nav">
          <button className="pb-btn pb-btn--ghost" type="button" onClick={onBack}>Back</button>
          <button className="pb-btn pb-btn--primary" type="button" onClick={onNext}>
            Next →
          </button>
        </div>
      </section>
    </div>
  )
}
