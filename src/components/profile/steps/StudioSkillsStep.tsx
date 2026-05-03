'use client'

import { ProfileDraft } from '../profile-types'
import { DEV_SKILL_DESCS } from '@/components/matching-preview/preview-data'

interface Props {
  draft: ProfileDraft
  update: (patch: Partial<ProfileDraft>) => void
  onNext: () => void
  onBack: () => void
}

const ALL_SKILLS = Object.keys(DEV_SKILL_DESCS)
const MAX = 6

export default function StudioSkillsStep({ draft, update, onNext, onBack }: Props) {
  const selected = draft.selectedSkills
  const selectedNames = new Set(selected.map(s => s.name))

  const toggle = (name: string) => {
    if (selectedNames.has(name)) {
      update({ selectedSkills: selected.filter(s => s.name !== name) })
    } else if (selected.length < MAX) {
      update({ selectedSkills: [...selected, { name, description: '' }] })
    }
  }

  return (
    <div className="ob-screen">
      <aside className="ob-side ob-side--dark">
        <div className="ob-brand ob-brand--light">
          <span className="ob-mark">*</span>
          <span>weld.</span>
        </div>
        <h1 className="ob-title ob-title--light">skills<br />needed</h1>
        <p className="ob-copy ob-copy--light">
          What skills are you looking for in developers? Pick up to {MAX}.
        </p>
        <div className="ob-note-card">
          <strong>Tip</strong>
          <span>Developers filter by skill. The more accurate your tags, the better your matches.</span>
        </div>
      </aside>

      <section className="ob-main">
        <div className="ob-progress"><span style={{ width: '100%' }} /></div>
        <div className="ob-step-row">
          <span>Step 6 of 6 — Skills Needed</span>
          <span>6/6</span>
        </div>

        <div className="pb-field">
          <label className="pb-label">
            Skills looking for
            {selected.length > 0 && (
              <span className="pb-hint-label"> — {selected.length}/{MAX} selected</span>
            )}
          </label>
          <div className="pb-emoji-row" style={{ flexWrap: 'wrap', gap: 6 }}>
            {ALL_SKILLS.map(name => {
              const on = selectedNames.has(name)
              const disabled = !on && selected.length >= MAX
              return (
                <button
                  key={name}
                  type="button"
                  className={`pb-emoji-btn${on ? ' pb-emoji-btn--on' : ''}${disabled ? ' pb-emoji-btn--disabled' : ''}`}
                  onClick={() => toggle(name)}
                  disabled={disabled}
                >
                  {name}
                </button>
              )
            })}
          </div>
        </div>

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
