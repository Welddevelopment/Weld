'use client'

import { ProfileDraft } from '../profile-types'
import { DEV_SKILL_DESCS } from '@/components/matching-preview/preview-data'

const DEV_SKILLS = Object.keys(DEV_SKILL_DESCS)
const MAX = 5

interface Props {
  draft: ProfileDraft
  update: (patch: Partial<ProfileDraft>) => void
  onClose: () => void
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
              Edit your descriptions
            </div>
            {selected.map((s, i) => (
              <div key={s.name} style={{ marginBottom: 12 }}>
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
              </div>
            ))}
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
