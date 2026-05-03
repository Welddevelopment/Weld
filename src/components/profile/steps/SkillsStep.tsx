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

function stripLevel(description: string) {
  return description.replace(/^\[(Beginner|Intermediate|Expert)\]\s*/i, '')
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
        { name, description: DEV_SKILL_DESCS[name] ?? '' },
      ],
    })
  }

  const updateUrl = (name: string, url: string) =>
    update({
      selectedSkills: updateSkillField(selected, name, {
        resources: url.trim() ? [{ label: 'Showcase', url }] : undefined,
      }),
    })

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

  const updateCap = (skillName: string, idx: number, cap: { name: string; description: string; detail?: string }) => {
    const skill = selected.find(s => s.name === skillName)
    if (!skill) return
    update({ selectedSkills: updateSkillField(selected, skillName, {
      categories: (skill.categories ?? []).map((c, i) => i === idx ? cap : c),
    }) })
  }

  const removeCap = (skillName: string, idx: number) => {
    const skill = selected.find(s => s.name === skillName)
    if (!skill) return
    update({ selectedSkills: updateSkillField(selected, skillName, {
      categories: (skill.categories ?? []).filter((_, i) => i !== idx),
    }) })
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
                onChange={e => update({ selectedSkills: updateSkillField(selected, skill.name, { description: e.target.value }) })}
              />

              <div className="pb-field" style={{ marginTop: 10, marginBottom: 0 }}>
                <label className="pb-label">What can you build with {skill.name}?</label>
                <div className="ob-cap-grid">
                  {caps.map((cap, ci) => {
                    const summaryLen = cap.description.length
                    return (
                      <div key={ci} className="ob-cap-card">
                        <button type="button" className="ob-cap-remove" onClick={() => removeCap(skill.name, ci)}>×</button>
                        <input
                          className="ob-cap-title"
                          placeholder="e.g. Gameplay Systems"
                          value={cap.name}
                          onChange={e => updateCap(skill.name, ci, { ...cap, name: e.target.value })}
                        />
                        <div className="ob-cap-section-label">Summary</div>
                        <textarea
                          className="ob-cap-body"
                          placeholder="One-line summary…"
                          rows={2}
                          maxLength={120}
                          value={cap.description}
                          onChange={e => updateCap(skill.name, ci, { ...cap, description: e.target.value })}
                        />
                        <div className={`ob-cap-char${summaryLen > 110 ? ' ob-cap-char--over' : ''}`}>{summaryLen}/120</div>
                        <div className="ob-cap-section-label">Description</div>
                        <textarea
                          className="ob-cap-detail"
                          placeholder="More detail shown in the popup…"
                          rows={3}
                          value={cap.detail ?? ''}
                          onChange={e => updateCap(skill.name, ci, { ...cap, detail: e.target.value })}
                        />
                      </div>
                    )
                  })}
                  {caps.length < MAX_CAPS && (
                    <button type="button" className="ob-cap-add" onClick={() => addCap(skill.name)}>+</button>
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
