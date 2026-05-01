'use client'

import { ProfileDraft } from '../profile-types'
import { DevWork } from '@/components/matching-preview/preview-types'

interface Props {
  draft: ProfileDraft
  update: (patch: Partial<ProfileDraft>) => void
  onClose: () => void
}

function emptyWork(): DevWork {
  return { emoji: 'Game', title: '', desc: '', tools: '', time: '', amount: '', plays: '' }
}

const EMOJI_OPTIONS = ['Game', 'Combat', 'Build', 'Art', 'Tools', 'VFX', 'Audio', 'World', 'Launch']

export default function WorkEditPanel({ draft, update, onClose }: Props) {
  const works = draft.bestWork

  const add = () => update({ bestWork: [...works, emptyWork()] })
  const remove = (i: number) => update({ bestWork: works.filter((_, idx) => idx !== i) })
  const change = (i: number, w: DevWork) => {
    const next = [...works]; next[i] = w; update({ bestWork: next })
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
      </div>

      <div className="npc-panel-body">
        <div style={{ fontSize: 15, fontWeight: 700, color: '#111', fontFamily: 'var(--font-display)', fontStyle: 'italic', marginBottom: 16 }}>
          Projects you&apos;ve built
        </div>

        {works.map((w, i) => (
          <div key={i} className="pb-entry-card">
            <div className="pb-entry-card-header">
              <span className="pb-entry-card-label">Project {i + 1}</span>
              <button type="button" className="pb-entry-card-remove" onClick={() => remove(i)}>Remove</button>
            </div>

            <div style={{ fontSize: 10, fontFamily: 'var(--font-geist-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)', marginBottom: 6 }}>
              Category
            </div>
            <div className="pb-emoji-row">
              {EMOJI_OPTIONS.map(e => (
                <button key={e} type="button"
                  className={`pb-emoji-btn${w.emoji === e ? ' pb-emoji-btn--on' : ''}`}
                  onClick={() => change(i, { ...w, emoji: e })}
                >
                  {e}
                </button>
              ))}
            </div>

            <input
              className="pb-panel-input"
              placeholder="Project name (e.g. Combat System)"
              value={w.title}
              onChange={e => change(i, { ...w, title: e.target.value })}
            />
            <textarea
              className="pb-panel-textarea"
              placeholder="What did you build? What was your role?"
              rows={2}
              value={w.desc}
              onChange={e => change(i, { ...w, desc: e.target.value })}
            />
            <input
              className="pb-panel-input"
              placeholder="Tools used (e.g. Luau, Blender)"
              value={w.tools}
              onChange={e => change(i, { ...w, tools: e.target.value })}
            />
            <div className="pb-panel-row3">
              <input className="pb-panel-input" placeholder="Time taken" value={w.time} onChange={e => change(i, { ...w, time: e.target.value })} />
              <input className="pb-panel-input" placeholder="Value paid" value={w.amount} onChange={e => change(i, { ...w, amount: e.target.value })} />
              <input className="pb-panel-input" placeholder="Game plays" value={w.plays} onChange={e => change(i, { ...w, plays: e.target.value })} />
            </div>
          </div>
        ))}

        {works.length < 3 && (
          <button type="button" className="pb-edit-add-btn" onClick={add}>
            + Add project
          </button>
        )}

        {works.length === 0 && (
          <p style={{ color: '#bbb', fontSize: 12, textAlign: 'center', marginTop: 8 }}>
            Add up to 3 of your best projects.
          </p>
        )}
      </div>
    </div>
  )
}
