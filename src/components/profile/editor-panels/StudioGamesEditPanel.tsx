'use client'

import { ProfileDraft } from '../profile-types'
import { TopGame } from '@/components/matching-preview/preview-types'

interface Props {
  draft: ProfileDraft
  update: (patch: Partial<ProfileDraft>) => void
  onClose: () => void
}

function emptyGame(): TopGame {
  return {
    emoji: 'Game',
    title: '',
    desc: '',
    plays: '',
    topCcu: '',
    currentCcu: '',
    imageUrl: '',
    gameUrl: '',
    genre: '',
    likes: '',
    updatedAgo: '',
  }
}

export default function StudioGamesEditPanel({ draft, update, onClose }: Props) {
  const games = draft.topGames

  const add = () => {
    update({ topGames: [...games, emptyGame()] })
  }

  const remove = (i: number) => {
    update({ topGames: games.filter((_, idx) => idx !== i) })
  }

  const change = (i: number, g: TopGame) => {
    const next = [...games]
    next[i] = g
    update({ topGames: next })
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
        <h2 className="npc-panel-title">Studio Games</h2>
        <p className="npc-panel-sub">Games your studio has shipped or is working on.</p>
      </div>

      <div className="npc-panel-body">
        {games.map((g, i) => (
          <div key={i} className="pb-entry-card">
            <div className="pb-entry-card-header">
              <span className="pb-entry-card-label">Game {i + 1}</span>
              <button type="button" className="pb-entry-card-remove" onClick={() => remove(i)}>Remove</button>
            </div>

            <div className="pb-image-row">
              {g.imageUrl && (
                <div className="pb-image-preview">
                  <img src={g.imageUrl} alt="preview" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                </div>
              )}
              <input
                className="pb-panel-input"
                placeholder="Thumbnail URL (paste image link)"
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
            <input
              className="pb-panel-input"
              placeholder="Genre (e.g. Tower Defense, Simulator, RPG)"
              value={g.genre ?? ''}
              onChange={e => change(i, { ...g, genre: e.target.value })}
            />
            <textarea
              className="pb-panel-textarea"
              placeholder="What is this game about? What was your studio's role?"
              rows={2}
              value={g.desc}
              onChange={e => change(i, { ...g, desc: e.target.value })}
            />
            <div className="pb-panel-row3">
              <input className="pb-panel-input" placeholder="Total visits" value={g.plays} onChange={e => change(i, { ...g, plays: e.target.value })} />
              <input className="pb-panel-input" placeholder="Peak CCU" value={g.topCcu} onChange={e => change(i, { ...g, topCcu: e.target.value })} />
              <input className="pb-panel-input" placeholder="Current CCU" value={g.currentCcu} onChange={e => change(i, { ...g, currentCcu: e.target.value })} />
            </div>
            <div className="pb-panel-row3">
              <input className="pb-panel-input" placeholder="Likes (e.g. 45.2K)" value={g.likes ?? ''} onChange={e => change(i, { ...g, likes: e.target.value })} />
              <input className="pb-panel-input" placeholder="Updated (e.g. 2d ago)" value={g.updatedAgo ?? ''} onChange={e => change(i, { ...g, updatedAgo: e.target.value })} />
              <div />
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
            Add games your studio has launched or is building.
          </p>
        )}
      </div>
    </div>
  )
}
