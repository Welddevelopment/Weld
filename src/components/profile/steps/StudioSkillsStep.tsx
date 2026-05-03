'use client'

import { ProfileDraft } from '../profile-types'
import { DEV_SKILL_DESCS } from '@/components/matching-preview/preview-data'

interface Props {
  draft: ProfileDraft
  update: (patch: Partial<ProfileDraft>) => void
  onNext: () => void
  onBack: () => void
}

export default function StudioSkillsStep({ draft, update, onNext, onBack }: Props) {
  const derivedSkills = [...new Set(draft.openRoles.map(r => r.skill).filter(Boolean))]

  const getDesc = (name: string) =>
    draft.selectedSkills.find(s => s.name === name)?.description ?? ''

  const setDesc = (name: string, description: string) => {
    const existing = draft.selectedSkills.find(s => s.name === name)
    if (existing) {
      update({ selectedSkills: draft.selectedSkills.map(s => s.name === name ? { ...s, description } : s) })
    } else {
      update({ selectedSkills: [...draft.selectedSkills, { name, description }] })
    }
  }

  return (
    <div className="ob-screen">
      <aside className="ob-side ob-side--dark">
        <div className="ob-brand ob-brand--light">
          <span className="ob-mark">*</span>
          <span>weld.</span>
        </div>
        <h1 className="ob-title ob-title--light">skill<br />descriptions</h1>
        <p className="ob-copy ob-copy--light">
          Optionally write a short description for each skill you need. Developers see this when they tap a skill chip on your profile.
        </p>
        <div className="ob-note-card">
          <strong>Tip</strong>
          <span>Leave it blank to use the default description, or write your own to stand out.</span>
        </div>
      </aside>

      <section className="ob-main">
        <div className="ob-progress"><span style={{ width: '100%' }} /></div>
        <div className="ob-step-row">
          <span>Step 6 of 6 — Skill Descriptions</span>
          <span>6/6</span>
        </div>

        {derivedSkills.length === 0 && (
          <p style={{ color: '#bbb', fontSize: 13, marginTop: 8 }}>
            No roles added yet — go back and add roles first. Skills are derived from your open roles.
          </p>
        )}

        {derivedSkills.map(name => (
          <div key={name} style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ fontWeight: 600, fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>{name}</span>
              {!getDesc(name) && (
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>using default</span>
              )}
            </div>
            <textarea
              className="pb-textarea"
              rows={2}
              placeholder={DEV_SKILL_DESCS[name] ?? `Describe what ${name} means for your studio…`}
              value={getDesc(name)}
              onChange={e => setDesc(name, e.target.value)}
            />
          </div>
        ))}

        <div className="pb-nav">
          <button className="pb-btn pb-btn--ghost" type="button" onClick={onBack}>Back</button>
          <button className="pb-btn pb-btn--primary" type="button" onClick={onNext}>
            Build your profile →
          </button>
        </div>
      </section>
    </div>
  )
}
