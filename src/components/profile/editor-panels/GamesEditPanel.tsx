'use client'

import { useState } from 'react'
import { ProfileDraft } from '../profile-types'
import { TopGame } from '@/components/matching-preview/preview-types'

interface Props {
  draft: ProfileDraft
  update: (patch: Partial<ProfileDraft>) => void
  onClose: () => void
}

function emptyGame(): TopGame {
  return { emoji: 'Game', title: '', desc: '', plays: '', topCcu: '', currentCcu: '', imageUrl: '', gameUrl: '' }
}

const CATEGORY_OPTIONS = ['Game', 'Combat', 'Build', 'Art', 'Tools', 'VFX', 'Audio', 'World', 'Launch']

export default function GamesEditPanel({ draft, update, onClose }: Props) {
  const games = draft.topGames

  const [openPicker, setOpenPicker] = useState<Set<number>>(
    () => new Set(games.length === 0 ? [] : games.map((_, i) => i).filter(i => !games[i].title))
  )

  const add = () => {
    const nextIdx = games.length
    update({ topGames: [...games, emptyGame()] })
    setOpenPicker(prev => new Set([...prev, nextIdx]))
  }

  const remove = (i: number) => {
    update({ topGames: games.filter((_, idx) => idx !== i) })
    setOpenPicker(prev => {
      const next = new Set<number>()
      prev.forEach(idx => { if (idx < i) next.add(idx); else if (idx > i) next.add(idx - 1) })
      return next
    })
  }

  const change = (i: number, g: TopGame) => {
    const next = [...games]; next[i] = g; update({ topGames: next })
  }

  const selectCategory = (i: number, g: TopGame, emoji: string) => {
    change(i, { ...g, emoji })
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
        <h2 className="npc-panel-title">My Games</h2>
        <p className="npc-panel-sub">Games you&apos;ve worked on.</p>
      </div>

      <div className="npc-panel-body">
        {games.map((g, i) => (
          <div key={i} className="pb-entry-card">
            <div className="pb-entry-card-header">
              <span className="pb-entry-card-label">Game {i + 1}</span>
              <button
                type="button"
                className="pb-category-pill"
                onClick={() => togglePicker(i)}
                title="Change category"
              >
                {g.emoji || 'Category'}
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
                    className={`pb-emoji-btn${g.emoji === e ? ' pb-emoji-btn--on' : ''}`}
                    onClick={() => selectCategory(i, g, e)}
                  >
                    {e}
                  </button>
                ))}
              </div>
            )}

            <div className="pb-image-row">
              {g.imageUrl && (
                <div className="pb-image-preview">
                  <img src={g.imageUrl} alt="preview" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                </div>
              )}
              <input
                className="pb-panel-input"
                placeholder="Screenshot URL (paste image link)"
                value={g.imageUrl ?? ''}
                onChange={e => change(i, { ...g, imageUrl: e.target.value })}
              />
            </div>

            <input
              className="pb-panel-input"
              placeholder="Game name (e.g. Tower Defence Simulator)"
              value={g.title}
              onChange={e => change(i, { ...g, title: e.target.value })}
            />
            <input
              className="pb-panel-input"
              placeholder="Roblox game URL (roblox.com/games/...)"
              value={g.gameUrl ?? ''}
              onChange={e => change(i, { ...g, gameUrl: e.target.value })}
            />
            <textarea
              className="pb-panel-textarea"
              placeholder="What did you work on? What was your contribution?"
              rows={2}
              value={g.desc}
              onChange={e => change(i, { ...g, desc: e.target.value })}
            />
            <div className="pb-panel-row3">
              <input className="pb-panel-input" placeholder="Total visits" value={g.plays} onChange={e => change(i, { ...g, plays: e.target.value })} />
              <input className="pb-panel-input" placeholder="Peak CCU" value={g.topCcu} onChange={e => change(i, { ...g, topCcu: e.target.value })} />
              <input className="pb-panel-input" placeholder="Current CCU" value={g.currentCcu} onChange={e => change(i, { ...g, currentCcu: e.target.value })} />
            </div>
          </div>
        ))}

        {games.length < 5 && (
          <button type="button" className="pb-edit-add-btn" onClick={add}>
            + Add game
          </button>
        )}

        {games.length === 0 && (
          <p style={{ color: '#bbb', fontSize: 12, textAlign: 'center', marginTop: 8 }}>
            Add games you&apos;ve contributed to.
          </p>
        )}
      </div>
    </div>
  )
}
