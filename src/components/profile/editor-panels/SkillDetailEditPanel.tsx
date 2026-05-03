'use client'

import { ProfileDraft, ProfileSkillDraft } from '../profile-types'

const MAX_CAPS = 6

function stripLevel(description: string) {
  return description.replace(/^\[(Beginner|Intermediate|Expert)\]\s*/i, '')
}

function updateInList(
  skills: ProfileSkillDraft[],
  name: string,
  patch: Partial<ProfileSkillDraft>
): ProfileSkillDraft[] {
  return skills.map(s => s.name === name ? { ...s, ...patch } : s)
}

const LABEL_STYLE = {
  fontSize: 10,
  fontFamily: 'var(--font-geist-mono)' as const,
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  color: '#bbb',
  marginBottom: 6,
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

  const description = stripLevel(skill.description)
  const caps = skill.categories ?? []

  const set = (patch: Partial<ProfileSkillDraft>) =>
    update({ selectedSkills: updateInList(draft.selectedSkills, skillName, patch) })

  const addCap = () =>
    set({ categories: [...caps, { name: '', description: '' }] })

  const updateCap = (idx: number, cap: { name: string; description: string; detail?: string }) =>
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

        {/* Description */}
        <div style={LABEL_STYLE}>Description</div>
        <textarea
          className="pb-panel-textarea"
          value={description}
          rows={6}
          placeholder={`Describe your ${skillName} experience...`}
          onChange={e => set({ description: e.target.value })}
          style={{ marginBottom: 16 }}
        />

        {/* Capability cards */}
        <div style={LABEL_STYLE}>What you can build with {skillName}</div>
        <div className="ob-cap-grid" style={{ marginBottom: 16 }}>
          {caps.map((cap, ci) => {
            const summaryLen = cap.description.length
            return (
              <div key={ci} className="ob-cap-card">
                <button type="button" className="ob-cap-remove" onClick={() => removeCap(ci)}>×</button>
                <input
                  className="ob-cap-title"
                  placeholder="e.g. Gameplay Systems"
                  value={cap.name}
                  onChange={e => updateCap(ci, { ...cap, name: e.target.value })}
                />
                <div className="ob-cap-section-label">Summary</div>
                <textarea
                  className="ob-cap-body"
                  placeholder="One-line summary…"
                  rows={2}
                  maxLength={120}
                  value={cap.description}
                  onChange={e => updateCap(ci, { ...cap, description: e.target.value })}
                />
                <div className={`ob-cap-char${summaryLen > 110 ? ' ob-cap-char--over' : ''}`}>{summaryLen}/120</div>
                <div className="ob-cap-section-label">Description</div>
                <textarea
                  className="ob-cap-detail"
                  placeholder="More detail shown in the popup…"
                  rows={3}
                  value={cap.detail ?? ''}
                  onChange={e => updateCap(ci, { ...cap, detail: e.target.value })}
                />
              </div>
            )
          })}
          {caps.length < MAX_CAPS && (
            <button type="button" className="ob-cap-add" onClick={addCap}>+</button>
          )}
        </div>

        {/* Experience + past works */}
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={LABEL_STYLE}>Experience (months)</div>
            <input
              className="pb-panel-input"
              type="number"
              min={0}
              max={600}
              placeholder="e.g. 24"
              value={skill.experienceMonths ?? ''}
              onChange={e => set({ experienceMonths: e.target.value === '' ? undefined : Number(e.target.value) })}
            />
          </div>
          <div style={{ flex: 1 }}>
            <div style={LABEL_STYLE}>Past works</div>
            <input
              className="pb-panel-input"
              type="number"
              min={0}
              max={999}
              placeholder="e.g. 8"
              value={skill.pastWorks ?? ''}
              onChange={e => set({ pastWorks: e.target.value === '' ? undefined : Number(e.target.value) })}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
