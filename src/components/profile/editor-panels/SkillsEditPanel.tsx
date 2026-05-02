'use client'

import { ProfileDraft, ProfileSkillDraft } from '../profile-types'
import { DEV_SKILL_DESCS } from '@/components/matching-preview/preview-data'

const DEV_SKILLS = Object.keys(DEV_SKILL_DESCS)
const MAX = 5
const MAX_CAPS = 6

interface Props {
  draft: ProfileDraft
  update: (patch: Partial<ProfileDraft>) => void
  onClose: () => void
}

function updateSkillField(
  skills: ProfileSkillDraft[],
  name: string,
  patch: Partial<ProfileSkillDraft>
): ProfileSkillDraft[] {
  return skills.map(s => s.name === name ? { ...s, ...patch } : s)
}

export default function SkillsEditPanel({ draft, update, onClose }: Props) {
  const selected = draft.selectedSkills
  const selectedNames = new Set(selected.map(s => s.name))

  const toggle = (name: string) => {
    if (selectedNames.has(name)) {
      update({ selectedSkills: selected.filter(s => s.name !== name) })
    } else if (selected.length < MAX) {
      update({ selectedSkills: [...selected, { name, description: DEV_SKILL_DESCS[name] ?? '' }] })
    }
  }

  const addCap = (skillName: string) => {
    const skill = selected.find(s => s.name === skillName)
    if (!skill) return
    update({
      selectedSkills: updateSkillField(selected, skillName, {
        categories: [...(skill.categories ?? []), { name: '', description: '' }],
      }),
    })
  }

  const updateCap = (skillName: string, idx: number, cap: { name: string; description: string }) => {
    const skill = selected.find(s => s.name === skillName)
    if (!skill) return
    update({
      selectedSkills: updateSkillField(selected, skillName, {
        categories: (skill.categories ?? []).map((c, i) => i === idx ? cap : c),
      }),
    })
  }

  const removeCap = (skillName: string, idx: number) => {
    const skill = selected.find(s => s.name === skillName)
    if (!skill) return
    update({
      selectedSkills: updateSkillField(selected, skillName, {
        categories: (skill.categories ?? []).filter((_, i) => i !== idx),
      }),
    })
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
        <span style={{ fontSize: 11, color: '#aaa', marginLeft: 'auto', fontFamily: 'var(--font-geist-mono)' }}>
          {selected.length}/{MAX}
        </span>
      </div>

      <div className="npc-panel-body">
        <div style={{ fontSize: 15, fontWeight: 700, color: '#111', fontFamily: 'var(--font-display)', fontStyle: 'italic', marginBottom: 14 }}>
          Your skills
        </div>

        <div className="pb-edit-skill-grid">
          {DEV_SKILLS.map(name => {
            const on = selectedNames.has(name)
            const disabled = !on && selected.length >= MAX
            return (
              <button
                key={name}
                type="button"
                className={`pb-edit-skill-btn${on ? ' pb-edit-skill-btn--on' : ''}${disabled ? ' pb-edit-skill-btn--disabled' : ''}`}
                onClick={() => !disabled && toggle(name)}
                disabled={disabled}
              >
                {on && <span style={{ marginRight: 4 }}>✓</span>}
                {name}
              </button>
            )
          })}
        </div>

        {selected.length > 0 && (
          <>
            <div style={{ fontSize: 10, fontFamily: 'var(--font-geist-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa', margin: '16px 0 10px' }}>
              Edit your skills
            </div>
            {selected.map((s, i) => {
              const caps = s.categories ?? []
              return (
                <div key={s.name} style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#555', fontFamily: 'var(--font-geist-mono)', marginBottom: 5 }}>
                    {i + 1}. {s.name}
                  </div>

                  <textarea
                    className="pb-panel-textarea"
                    value={s.description}
                    rows={2}
                    placeholder={`Describe your ${s.name} experience...`}
                    onChange={e => {
                      const desc = e.target.value
                      update({ selectedSkills: selected.map(x => x.name === s.name ? { ...x, description: desc } : x) })
                    }}
                  />

                  <div style={{ fontSize: 10, fontFamily: 'var(--font-geist-mono)', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#bbb', margin: '10px 0 6px' }}>
                    What you can build
                  </div>
                  <div className="ob-cap-grid">
                    {caps.map((cap, ci) => (
                      <div key={ci} className="ob-cap-card">
                        <button type="button" className="ob-cap-remove" onClick={() => removeCap(s.name, ci)}>×</button>
                        <input
                          className="ob-cap-title"
                          placeholder="e.g. Gameplay Systems"
                          value={cap.name}
                          onChange={e => updateCap(s.name, ci, { ...cap, name: e.target.value })}
                        />
                        <textarea
                          className="ob-cap-body"
                          placeholder="Short description…"
                          rows={2}
                          value={cap.description}
                          onChange={e => updateCap(s.name, ci, { ...cap, description: e.target.value })}
                        />
                      </div>
                    ))}
                    {caps.length < MAX_CAPS && (
                      <button type="button" className="ob-cap-add" onClick={() => addCap(s.name)}>+</button>
                    )}
                  </div>
                </div>
              )
            })}
          </>
        )}

        {selected.length === 0 && (
          <p style={{ color: '#bbb', fontSize: 13, textAlign: 'center', paddingTop: 12 }}>
            Pick up to {MAX} skills above.
          </p>
        )}
      </div>
    </div>
  )
}
