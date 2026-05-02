'use client'

import { ProfileDraft, ProfileSkillDraft } from '../profile-types'
import { DEV_SKILL_DESCS } from '../../matching-preview/preview-data'

interface Props {
  draft: ProfileDraft
  update: (patch: Partial<ProfileDraft>) => void
  onNext: () => void
  onBack: () => void
}

const DEV_SKILLS = Object.keys(DEV_SKILL_DESCS)
const MAX_SKILLS = 5
const MAX_CAPS = 6
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

function updateSkillField(
  skills: ProfileSkillDraft[],
  name: string,
  patch: Partial<ProfileSkillDraft>
): ProfileSkillDraft[] {
  return skills.map(s => s.name === name ? { ...s, ...patch } : s)
}

export default function SkillsStep({ draft, update, onNext, onBack }: Props) {
  const selected = draft.selectedSkills
  const selectedNames = new Set(selected.map(s => s.name))
  const detailsCount = selected.filter(s => stripLevel(s.description).trim()).length

  const toggle = (name: string) => {
    if (selectedNames.has(name)) {
      update({ selectedSkills: selected.filter(s => s.name !== name) })
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

  const updateDescription = (name: string, desc: string, level: string) => {
    update({ selectedSkills: updateSkillField(selected, name, { description: withLevel(level, desc) }) })
  }

  const updateLevel = (name: string, level: string, description: string) => {
    update({ selectedSkills: updateSkillField(selected, name, { description: withLevel(level, description) }) })
  }

  const updateUrl = (name: string, url: string) => {
    update({
      selectedSkills: updateSkillField(selected, name, {
        resources: url.trim() ? [{ label: 'Showcase', url }] : undefined,
      }),
    })
  }

  const addCap = (skillName: string) => {
    update({
      selectedSkills: updateSkillField(selected, skillName, {
        categories: [
          ...(selected.find(s => s.name === skillName)?.categories ?? []),
          { name: '', description: '' },
        ],
      }),
    })
  }

  const updateCap = (skillName: string, idx: number, cap: { name: string; description: string }) => {
    const skill = selected.find(s => s.name === skillName)
    if (!skill) return
    const categories = (skill.categories ?? []).map((c, i) => i === idx ? cap : c)
    update({ selectedSkills: updateSkillField(selected, skillName, { categories }) })
  }

  const removeCap = (skillName: string, idx: number) => {
    const skill = selected.find(s => s.name === skillName)
    if (!skill) return
    const categories = (skill.categories ?? []).filter((_, i) => i !== idx)
    update({ selectedSkills: updateSkillField(selected, skillName, { categories }) })
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
          const caps = skill.categories ?? []

          return (
            <div key={skill.name} className="ob-work-entry">
              <div className="ob-work-head">
                <span>{skill.name}</span>
                <button
                  type="button"
                  onClick={() => update({ selectedSkills: selected.filter(s => s.name !== skill.name) })}
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
                      onClick={() => updateLevel(skill.name, option, description)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <input
                className="pb-input"
                value={skill.resources?.[0]?.url ?? ''}
                onChange={e => updateUrl(skill.name, e.target.value)}
                placeholder="Showcase image URL (optional)"
              />

              <textarea
                className="pb-textarea"
                value={description}
                rows={2}
                placeholder={`e.g. I have used ${skill.name} for 3 years to build production-ready systems.`}
                onChange={e => updateDescription(skill.name, e.target.value, level)}
              />

              <div className="pb-field" style={{ marginTop: 10, marginBottom: 0 }}>
                <label className="pb-label">What can you build with {skill.name}?</label>
                <div className="ob-cap-grid">
                  {caps.map((cap, ci) => (
                    <div key={ci} className="ob-cap-card">
                      <button
                        type="button"
                        className="ob-cap-remove"
                        onClick={() => removeCap(skill.name, ci)}
                      >×</button>
                      <input
                        className="ob-cap-title"
                        placeholder="e.g. Gameplay Systems"
                        value={cap.name}
                        onChange={e => updateCap(skill.name, ci, { ...cap, name: e.target.value })}
                      />
                      <textarea
                        className="ob-cap-body"
                        placeholder="Short description…"
                        rows={2}
                        value={cap.description}
                        onChange={e => updateCap(skill.name, ci, { ...cap, description: e.target.value })}
                      />
                    </div>
                  ))}
                  {caps.length < MAX_CAPS && (
                    <button
                      type="button"
                      className="ob-cap-add"
                      onClick={() => addCap(skill.name)}
                    >+</button>
                  )}
                </div>
              </div>
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
