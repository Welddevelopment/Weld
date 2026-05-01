'use client'

import { ProfileDraft } from '../profile-types'
import { DEV_SKILL_DESCS } from '../../matching-preview/preview-data'

interface Props {
  draft: ProfileDraft
  update: (patch: Partial<ProfileDraft>) => void
  onNext: () => void
  onBack: () => void
}

const DEV_SKILLS = Object.keys(DEV_SKILL_DESCS)
const MAX_SKILLS = 5

export default function SkillsStep({ draft, update, onNext, onBack }: Props) {
  const selected = draft.selectedSkills
  const selectedNames = new Set(selected.map(s => s.name))

  const toggle = (name: string) => {
    if (selectedNames.has(name)) {
      update({ selectedSkills: selected.filter(s => s.name !== name) })
    } else if (selected.length < MAX_SKILLS) {
      update({ selectedSkills: [...selected, { name, description: DEV_SKILL_DESCS[name] ?? '' }] })
    }
  }

  return (
    <div className="pb-step-content">
      <div className="pb-step-eyebrow">Step 4</div>
      <h1 className="pb-step-title">Your skills</h1>
      <p className="pb-step-sub">
        Pick up to {MAX_SKILLS} skills that best represent what you do.
        {selected.length >= MAX_SKILLS && <strong> Max reached.</strong>}
      </p>

      <div className="pb-skill-grid">
        {DEV_SKILLS.map(name => {
          const on = selectedNames.has(name)
          const disabled = !on && selected.length >= MAX_SKILLS
          return (
            <button
              key={name}
              type="button"
              className={`pb-skill-btn${on ? ' pb-skill-btn--on' : ''}${disabled ? ' pb-skill-btn--disabled' : ''}`}
              onClick={() => !disabled && toggle(name)}
              disabled={disabled}
            >
              <span className="pb-skill-name">{name}</span>
              {on && <span className="pb-skill-check">✓</span>}
            </button>
          )
        })}
      </div>

      {selected.length > 0 && (
        <div className="pb-skill-selected">
          <div className="pb-skill-selected-label">Selected — click a description to edit it:</div>
          {selected.map((s, i) => (
            <div key={s.name} style={{ marginBottom: 6, background: 'rgba(255,255,255,0.04)', borderRadius: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px 6px' }}>
                <span className="pb-skill-selected-num">{i + 1}</span>
                <span className="pb-skill-selected-name">{s.name}</span>
                <button
                  type="button"
                  className="pb-skill-remove"
                  onClick={() => update({ selectedSkills: selected.filter(x => x.name !== s.name) })}
                >✕</button>
              </div>
              <div style={{ padding: '0 12px 10px' }}>
                <textarea
                  className="pb-textarea"
                  value={s.description}
                  rows={2}
                  style={{ marginBottom: 0, resize: 'vertical', fontSize: 13 }}
                  onChange={e => {
                    const desc = e.target.value
                    update({ selectedSkills: selected.map(x => x.name === s.name ? { ...x, description: desc } : x) })
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="pb-nav">
        <button className="pb-btn pb-btn--ghost" type="button" onClick={onBack}>Back</button>
        <button
          className="pb-btn pb-btn--primary"
          type="button"
          onClick={onNext}
          disabled={selected.length === 0}
        >
          Next
        </button>
      </div>
    </div>
  )
}
