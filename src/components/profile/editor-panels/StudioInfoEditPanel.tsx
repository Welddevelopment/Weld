'use client'

import { ProfileDraft } from '../profile-types'
import { DEV_SKILL_DESCS } from '@/components/matching-preview/preview-data'

interface Props {
  draft: ProfileDraft
  update: (patch: Partial<ProfileDraft>) => void
  onClose: () => void
}

const ALL_SKILLS = Object.keys(DEV_SKILL_DESCS)
const MAX_SKILLS = 6

const GRADIENTS = [
  'linear-gradient(135deg,#E84624,#FF8A5C)',
  'linear-gradient(135deg,#6C3DE8,#B57BFF)',
  'linear-gradient(135deg,#1A6BE8,#5BBCFF)',
  'linear-gradient(135deg,#1AB87A,#5BFFB8)',
  'linear-gradient(135deg,#E8901A,#FFD05B)',
  'linear-gradient(135deg,#1A3CE8,#5B7FFF)',
  'linear-gradient(135deg,#2D2D2D,#666)',
]

const TEAM_SIZES = [
  { label: '1–2', value: 1 },
  { label: '3–5', value: 3 },
  { label: '6–10', value: 6 },
  { label: '11–20', value: 11 },
  { label: '20+', value: 20 },
]

const STATUS_OPTIONS = ['Hiring Now', 'Open to Offers', 'Closed']
const RATE_TYPES = ['Hourly (USD)', 'Hourly (Robux)', 'Per Project', 'Revenue Share', 'Negotiable']

export default function StudioInfoEditPanel({ draft, update, onClose }: Props) {
  const ss = draft.studioStats
  const selected = draft.selectedSkills
  const selectedNames = new Set(selected.map(s => s.name))

  const toggleSkill = (name: string) => {
    if (selectedNames.has(name)) {
      update({ selectedSkills: selected.filter(s => s.name !== name) })
    } else if (selected.length < MAX_SKILLS) {
      update({ selectedSkills: [...selected, { name, description: '' }] })
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
        <h2 className="npc-panel-title">Studio Details</h2>
        <p className="npc-panel-sub">Edit your studio info, stats, and hiring details.</p>
      </div>

      <div className="npc-panel-body">

        <div style={{ marginBottom: 20 }}>
          <div className="pb-label" style={{ marginBottom: 8 }}>Logo colour</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {GRADIENTS.map(g => (
              <button
                key={g}
                type="button"
                onClick={() => update({ bg: g })}
                style={{
                  width: 28, height: 28, borderRadius: 8, background: g, border: 'none',
                  cursor: 'pointer', flexShrink: 0,
                  outline: draft.bg === g ? '2.5px solid #111' : '2.5px solid transparent',
                  outlineOffset: 2,
                }}
              />
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div className="pb-label" style={{ marginBottom: 8 }}>About</div>
          <textarea
            className="pb-panel-textarea"
            rows={3}
            placeholder="Your studio's story, mission, or what makes you different…"
            value={draft.about}
            onChange={e => update({ about: e.target.value })}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <div className="pb-label" style={{ marginBottom: 8 }}>Team</div>

          <div className="pb-field" style={{ marginBottom: 10 }}>
            <label className="pb-label" style={{ fontSize: 11, opacity: 0.6 }}>Team size</label>
            <div className="pb-option-pills">
              {TEAM_SIZES.map(opt => (
                <button
                  key={opt.label}
                  type="button"
                  className={`pb-option-pill${draft.teamSize === opt.value ? ' pb-option-pill--on' : ''}`}
                  onClick={() => update({ teamSize: opt.value })}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pb-field" style={{ marginBottom: 10 }}>
            <label className="pb-label" style={{ fontSize: 11, opacity: 0.6 }}>Hiring status</label>
            <div className="pb-option-pills">
              {STATUS_OPTIONS.map(s => (
                <button
                  key={s}
                  type="button"
                  className={`pb-option-pill${draft.status === s ? ' pb-option-pill--on' : ''}`}
                  onClick={() => update({ status: s })}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginTop: 8 }}>
            <input
              type="checkbox"
              checked={draft.hiring}
              onChange={e => update({ hiring: e.target.checked })}
              style={{ width: 16, height: 16, accentColor: '#3DC77A' }}
            />
            <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13 }}>Show &ldquo;Actively Hiring&rdquo; badge</span>
          </label>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div className="pb-label" style={{ marginBottom: 8 }}>Rate</div>

          <div className="pb-field" style={{ marginBottom: 8 }}>
            <label className="pb-label" style={{ fontSize: 11, opacity: 0.6 }}>Rate type</label>
            <div className="pb-option-pills" style={{ flexWrap: 'wrap' }}>
              {RATE_TYPES.map(r => (
                <button
                  key={r}
                  type="button"
                  className={`pb-option-pill${draft.rateType === r ? ' pb-option-pill--on' : ''}`}
                  onClick={() => update({ rateType: draft.rateType === r ? null : r })}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
            <input
              className="pb-panel-input"
              type="number"
              placeholder="Min $/hr"
              value={draft.rateMin ?? ''}
              onChange={e => update({ rateMin: e.target.value ? Number(e.target.value) : null })}
            />
            <input
              className="pb-panel-input"
              type="number"
              placeholder="Max $/hr"
              value={draft.rateMax ?? ''}
              onChange={e => update({ rateMax: e.target.value ? Number(e.target.value) : null })}
            />
          </div>
          <input
            className="pb-panel-input"
            placeholder="Rate note (e.g. Rates vary by scope)"
            value={draft.rateNote}
            onChange={e => update({ rateNote: e.target.value })}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <div className="pb-label" style={{ marginBottom: 8 }}>Studio Stats</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            <input
              className="pb-panel-input"
              placeholder="Years building"
              value={ss.yearsBuilding}
              onChange={e => update({ studioStats: { ...ss, yearsBuilding: e.target.value } })}
            />
            <input
              className="pb-panel-input"
              placeholder="Projects shipped"
              value={ss.projectsShipped}
              onChange={e => update({ studioStats: { ...ss, projectsShipped: e.target.value } })}
            />
            <input
              className="pb-panel-input"
              placeholder="Total visits"
              value={ss.totalVisits}
              onChange={e => update({ studioStats: { ...ss, totalVisits: e.target.value } })}
            />
            <input
              className="pb-panel-input"
              placeholder="On-time delivery"
              value={ss.onTimeDelivery}
              onChange={e => update({ studioStats: { ...ss, onTimeDelivery: e.target.value } })}
            />
          </div>
        </div>

        <div>
          <div className="pb-label" style={{ marginBottom: 8 }}>
            Skills needed
            {selected.length > 0 && <span style={{ opacity: 0.5, fontWeight: 400 }}> ({selected.length}/{MAX_SKILLS})</span>}
          </div>
          <div className="pb-emoji-row" style={{ flexWrap: 'wrap', gap: 5 }}>
            {ALL_SKILLS.map(name => {
              const on = selectedNames.has(name)
              const disabled = !on && selected.length >= MAX_SKILLS
              return (
                <button
                  key={name}
                  type="button"
                  className={`pb-emoji-btn${on ? ' pb-emoji-btn--on' : ''}${disabled ? ' pb-emoji-btn--disabled' : ''}`}
                  onClick={() => toggleSkill(name)}
                  disabled={disabled}
                >
                  {name}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
