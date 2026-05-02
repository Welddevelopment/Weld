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
const LEVELS = ['Beginner', 'Intermediate', 'Expert']

function skillLevel(description: string) {
  const match = description.match(/^\[(Beginner|Intermediate|Expert)\]\s*/i)
  return match?.[1] ?? 'Intermediate'
}

function stripLevel(description: string) {
  return description.replace(/^\[(Beginner|Intermediate|Expert)\]\s*/i, '')
}

function withLevel(level: string, description: string) {
  return `[${level}] ${stripLevel(description).trim()}`
}

export default function SkillsStep({ draft, update, onNext, onBack }: Props) {
  const selected = draft.selectedSkills
  const selectedNames = new Set(selected.map(skill => skill.name))
  const detailsCount = selected.filter(skill => stripLevel(skill.description).trim()).length

  const toggle = (name: string) => {
    if (selectedNames.has(name)) {
      update({ selectedSkills: selected.filter(skill => skill.name !== name) })
      return
    }
    if (selected.length >= MAX_SKILLS) return
    update({
      selectedSkills: [
        ...selected,
        { name, description: withLevel('Intermediate', DEV_SKILL_DESCS[name] ?? '') },
      ],
    })
  }

  const updateSkill = (name: string, description: string) => {
    update({
      selectedSkills: selected.map(skill => skill.name === name ? { ...skill, description } : skill),
    })
  }

  return (
    <div className="ob-screen">
      <aside className="ob-side">
        <div className="ob-brand">
          <span className="ob-mark">*</span>
          <span>weld.</span>
        </div>
        <h1 className="ob-title">your<br />skills</h1>
        <p className="ob-copy">
          Add details to your skills. Studios want to know exactly what you can do with the tools you use.
        </p>
        <div className="ob-skill-count">{detailsCount} / {MAX_SKILLS} details added</div>
      </aside>

      <section className="ob-main">
        <div className="ob-progress"><span style={{ width: '100%' }} /></div>
        <div className="ob-step-row">
          <span>Step 6 of 6 - Skills</span>
          <span>6/6</span>
        </div>

        <div className="pb-field">
          <label className="pb-label">Selected skills</label>
          <div className="ob-skill-grid">
            {DEV_SKILLS.map(name => {
              const on = selectedNames.has(name)
              const disabled = !on && selected.length >= MAX_SKILLS
              return (
                <button
                  key={name}
                  type="button"
                  className={`ob-skill-btn${on ? ' ob-skill-btn--on' : ''}`}
                  onClick={() => !disabled && toggle(name)}
                  disabled={disabled}
                >
                  {name}{on ? ' ✓' : ''}
                </button>
              )
            })}
          </div>
        </div>

        {selected.map(skill => {
          const level = skillLevel(skill.description)
          const description = stripLevel(skill.description)

          return (
            <div key={skill.name} className="ob-work-entry">
              <div className="ob-work-head">
                <span>{skill.name}</span>
                <button
                  type="button"
                  onClick={() => update({ selectedSkills: selected.filter(item => item.name !== skill.name) })}
                >
                  Remove
                </button>
              </div>

              <div className="pb-field" style={{ marginBottom: 10 }}>
                <label className="pb-label">Experience level</label>
                <div className="ob-pill-row">
                  {LEVELS.map(option => (
                    <button
                      key={option}
                      type="button"
                      className={`ob-pill${level === option ? ' ob-pill--on' : ''}`}
                      onClick={() => updateSkill(skill.name, withLevel(option, description))}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <input
                className="pb-input"
                value=""
                readOnly
                placeholder="Showcase image URL (optional)"
              />

              <textarea
                className="pb-textarea"
                value={description}
                rows={2}
                placeholder={`e.g. I have used ${skill.name} for 3 years to build production-ready systems.`}
                onChange={event => updateSkill(skill.name, withLevel(level, event.target.value))}
              />
            </div>
          )
        })}

        {selected.length === 0 && (
          <p className="ob-empty-note">Pick at least one skill to continue.</p>
        )}

        <div className="pb-nav">
          <button className="pb-btn pb-btn--ghost" type="button" onClick={onBack}>Back</button>
          <button
            className="pb-btn pb-btn--primary pb-btn--publish"
            type="button"
            onClick={onNext}
            disabled={selected.length === 0}
          >
            Preview my card
          </button>
        </div>
      </section>
    </div>
  )
}
