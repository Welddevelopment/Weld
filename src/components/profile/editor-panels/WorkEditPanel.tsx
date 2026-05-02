'use client'

import { useState } from 'react'
import { ProfileDraft } from '../profile-types'
import { DevWork } from '@/components/matching-preview/preview-types'

interface Props {
  draft: ProfileDraft
  update: (patch: Partial<ProfileDraft>) => void
  onClose: () => void
}

function emptyWork(): DevWork {
  return { emoji: 'Game', title: '', desc: '', tools: '', time: '', amount: '', plays: '', imageUrl: '' }
}

const CATEGORY_OPTIONS = ['Game', 'Combat', 'Build', 'Art', 'Tools', 'VFX', 'Audio', 'World', 'Launch']

export default function WorkEditPanel({ draft, update, onClose }: Props) {
  const works = draft.bestWork

  const [openPicker, setOpenPicker] = useState<Set<number>>(
    () => new Set(works.length === 0 ? [] : works.map((_, i) => i).filter(i => !works[i].title))
  )

  const add = () => {
    const nextIdx = works.length
    update({ bestWork: [...works, emptyWork()] })
    setOpenPicker(prev => new Set([...prev, nextIdx]))
  }

  const remove = (i: number) => {
    update({ bestWork: works.filter((_, idx) => idx !== i) })
    setOpenPicker(prev => {
      const next = new Set<number>()
      prev.forEach(idx => { if (idx < i) next.add(idx); else if (idx > i) next.add(idx - 1) })
      return next
    })
  }

  const change = (i: number, w: DevWork) => {
    const next = [...works]; next[i] = w; update({ bestWork: next })
  }

  const selectCategory = (i: number, w: DevWork, emoji: string) => {
    change(i, { ...w, emoji })
    setOpenPicker(prev => { const next = new Set(prev); next.delete(i); return next })
  }

  const togglePicker = (i: number) => {
    setOpenPicker(prev => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i); else next.add(i)
      return next
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
        <h2 className="npc-panel-title">My Work</h2>
        <p className="npc-panel-sub">Projects you&apos;ve built.</p>
      </div>

      <div className="npc-panel-body">
        {works.map((w, i) => (
          <div key={i} className="pb-entry-card">
            <div className="pb-entry-card-header">
              <span className="pb-entry-card-label">Project {i + 1}</span>
              <button
                type="button"
                className="pb-category-pill"
                onClick={() => togglePicker(i)}
                title="Change category"
              >
                {w.emoji || 'Category'}
                <span className="pb-category-pill-dots">···</span>
              </button>
              <button type="button" className="pb-entry-card-remove" onClick={() => remove(i)}>Remove</button>
            </div>

            {openPicker.has(i) && (
              <div className="pb-emoji-row">
                {CATEGORY_OPTIONS.map(e => (
                  <button
                    key={e}
                    type="button"
                    className={`pb-emoji-btn${w.emoji === e ? ' pb-emoji-btn--on' : ''}`}
                    onClick={() => selectCategory(i, w, e)}
                  >
                    {e}
                  </button>
                ))}
              </div>
            )}

            <div className="pb-image-row">
              {w.imageUrl && (
                <div className="pb-image-preview">
                  <img src={w.imageUrl} alt="preview" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                </div>
              )}
              <input
                className="pb-panel-input"
                placeholder="Screenshot URL (paste image link)"
                value={w.imageUrl ?? ''}
                onChange={e => change(i, { ...w, imageUrl: e.target.value })}
              />
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
              <input className="pb-panel-input" placeholder="Date" value={w.plays} onChange={e => change(i, { ...w, plays: e.target.value })} />
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
