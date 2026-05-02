'use client'

import { ProfileDraft, ProfileSkillDraft } from '../profile-types'

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

function updateInList(
  skills: ProfileSkillDraft[],
  name: string,
  patch: Partial<ProfileSkillDraft>
): ProfileSkillDraft[] {
  return skills.map(s => s.name === name ? { ...s, ...patch } : s)
}

interface Props {
  skillName: string
  draft: ProfileDraft
  update: (patch: Partial<ProfileDraft>) => void
  onBack: () => void
}

export default function SkillDetailEditPanel({ skillName, draft, update, onBack }: Props) {
  const skill = draft.selectedSkills.find(s => s.name === skillName)
  if (!skill) return null

  const level = skillLevel(skill.description)
  const description = stripLevel(skill.description)
  const caps = skill.categories ?? []

  const set = (patch: Partial<ProfileSkillDraft>) =>
    update({ selectedSkills: updateInList(draft.selectedSkills, skillName, patch) })

  const addCap = () =>
    set({ categories: [...caps, { name: '', description: '' }] })

  const updateCap = (idx: number, cap: { name: string; description: string }) =>
    set({ categories: caps.map((c, i) => i === idx ? cap : c) })

  const removeCap = (idx: number) =>
    set({ categories: caps.filter((_, i) => i !== idx) })

  const ICON_COLORS = ['#a78bfa', '#34d399', '#fb923c', '#60a5fa', '#f472b6', '#facc15']
  const color = ICON_COLORS[
    [...skillName].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 0) % ICON_COLORS.length
  ]

  return (
    <div className="npc-panel">
      <div className="npc-panel-hd">
        <button className="npc-panel-back" onClick={onBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back
        </button>
      </div>

      <div className="npc-panel-body">
        {/* Skill header */}
        <div className="npc-skill-hd" style={{ marginBottom: 16 }}>
          <div className="npc-skill-icon-box" style={{ background: `${color}22`, color }}>
            {skillName.slice(0, 3)}
          </div>
          <div className="npc-skill-hd-copy">
            <div className="npc-skill-hd-name">{skillName}</div>
            <div className="npc-skill-hd-cat">Development Skill</div>
          </div>
        </div>

        {/* Experience level */}
        <div style={{ fontSize: 10, fontFamily: 'var(--font-geist-mono)', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#bbb', marginBottom: 6 }}>
          Experience level
        </div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
          {LEVELS.map(opt => (
            <button
              key={opt}
              type="button"
              onClick={() => set({ description: withLevel(opt, description) })}
              style={{
                flex: 1, padding: '6px 0', borderRadius: 8, fontSize: 11,
                fontFamily: 'var(--font-geist-mono)', fontWeight: 700, cursor: 'pointer',
                border: `1.5px solid ${level === opt ? '#4444EE' : 'rgba(0,0,0,0.12)'}`,
                background: level === opt ? 'rgba(68,68,238,0.08)' : 'transparent',
                color: level === opt ? '#4444EE' : '#999',
              }}
            >
              {opt}
            </button>
          ))}
        </div>

        {/* Description */}
        <div style={{ fontSize: 10, fontFamily: 'var(--font-geist-mono)', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#bbb', marginBottom: 6 }}>
          Description
        </div>
        <textarea
          className="pb-panel-textarea"
          value={description}
          rows={6}
          placeholder={`Describe your ${skillName} experience...`}
          onChange={e => set({ description: withLevel(level, e.target.value) })}
          style={{ marginBottom: 16 }}
        />

        {/* Capability cards */}
        <div style={{ fontSize: 10, fontFamily: 'var(--font-geist-mono)', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#bbb', marginBottom: 6 }}>
          What you can build with {skillName}
        </div>
        <div className="ob-cap-grid">
          {caps.map((cap, ci) => (
            <div key={ci} className="ob-cap-card">
              <button type="button" className="ob-cap-remove" onClick={() => removeCap(ci)}>×</button>
              <input
                className="ob-cap-title"
                placeholder="e.g. Gameplay Systems"
                value={cap.name}
                onChange={e => updateCap(ci, { ...cap, name: e.target.value })}
              />
              <textarea
                className="ob-cap-body"
                placeholder="Short description…"
                rows={2}
                value={cap.description}
                onChange={e => updateCap(ci, { ...cap, description: e.target.value })}
              />
            </div>
          ))}
          {caps.length < MAX_CAPS && (
            <button type="button" className="ob-cap-add" onClick={addCap}>+</button>
          )}
        </div>
      </div>
    </div>
  )
}
