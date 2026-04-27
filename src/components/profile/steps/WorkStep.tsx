'use client'

import { useState } from 'react'
import { ProfileDraft } from '../profile-types'
import { DevWork, TopGame } from '../../matching-preview/preview-types'

interface Props {
  draft: ProfileDraft
  update: (patch: Partial<ProfileDraft>) => void
  onNext: () => void
  onBack: () => void
  studioMode?: boolean
}

function emptyWork(): DevWork {
  return { emoji: '🎮', title: '', desc: '', tools: '', time: '', amount: '', plays: '' }
}

function emptyGame(): TopGame {
  return { emoji: '🎮', title: '', desc: '', plays: '', topCcu: '', currentCcu: '' }
}

const EMOJI_OPTIONS = ['🎮', '⚔️', '🏠', '🎨', '🔧', '✨', '🎵', '🗡️', '🌍', '🚀', '💥', '🧩']

function EmojiPicker({ value, onChange }: { value: string; onChange: (e: string) => void }) {
  return (
    <div className="pb-emoji-row">
      {EMOJI_OPTIONS.map(e => (
        <button
          key={e}
          type="button"
          className={`pb-emoji-btn${value === e ? ' pb-emoji-btn--on' : ''}`}
          onClick={() => onChange(e)}
        >
          {e}
        </button>
      ))}
    </div>
  )
}

function WorkEntry({
  work,
  index,
  onChange,
  onRemove,
}: {
  work: DevWork
  index: number
  onChange: (w: DevWork) => void
  onRemove: () => void
}) {
  return (
    <div className="pb-work-entry">
      <div className="pb-work-entry-header">
        <span className="pb-work-entry-num">Project {index + 1}</span>
        <button type="button" className="pb-work-remove" onClick={onRemove}>Remove</button>
      </div>
      <EmojiPicker value={work.emoji} onChange={e => onChange({ ...work, emoji: e })} />
      <input className="pb-input" placeholder="Project title *" value={work.title} onChange={e => onChange({ ...work, title: e.target.value })} />
      <textarea className="pb-textarea" placeholder="Short description *" rows={2} value={work.desc} onChange={e => onChange({ ...work, desc: e.target.value })} />
      <input className="pb-input" placeholder="Tools used (e.g. Luau, Blender)" value={work.tools} onChange={e => onChange({ ...work, tools: e.target.value })} />
      <div className="pb-work-row2">
        <input className="pb-input" placeholder="Time taken (e.g. 2 weeks)" value={work.time} onChange={e => onChange({ ...work, time: e.target.value })} />
        <input className="pb-input" placeholder="Pay (e.g. 5,000 Robux)" value={work.amount} onChange={e => onChange({ ...work, amount: e.target.value })} />
        <input className="pb-input" placeholder="Plays (e.g. 14M)" value={work.plays} onChange={e => onChange({ ...work, plays: e.target.value })} />
      </div>
    </div>
  )
}

function GameEntry({
  game,
  index,
  onChange,
  onRemove,
}: {
  game: TopGame
  index: number
  onChange: (g: TopGame) => void
  onRemove: () => void
}) {
  return (
    <div className="pb-work-entry">
      <div className="pb-work-entry-header">
        <span className="pb-work-entry-num">Game {index + 1}</span>
        <button type="button" className="pb-work-remove" onClick={onRemove}>Remove</button>
      </div>
      <EmojiPicker value={game.emoji} onChange={e => onChange({ ...game, emoji: e })} />
      <input className="pb-input" placeholder="Game title *" value={game.title} onChange={e => onChange({ ...game, title: e.target.value })} />
      <textarea className="pb-textarea" placeholder="Short description *" rows={2} value={game.desc} onChange={e => onChange({ ...game, desc: e.target.value })} />
      <div className="pb-work-row2">
        <input className="pb-input" placeholder="Total plays (e.g. 500M)" value={game.plays} onChange={e => onChange({ ...game, plays: e.target.value })} />
        <input className="pb-input" placeholder="Peak CCU (e.g. 12,000)" value={game.topCcu} onChange={e => onChange({ ...game, topCcu: e.target.value })} />
        <input className="pb-input" placeholder="Current CCU (e.g. 3,200)" value={game.currentCcu} onChange={e => onChange({ ...game, currentCcu: e.target.value })} />
      </div>
    </div>
  )
}

export default function WorkStep({ draft, update, onNext, onBack, studioMode = false }: Props) {
  if (studioMode) {
    const games = draft.topGames
    const addGame = () => update({ topGames: [...games, emptyGame()] })
    const updateGame = (i: number, g: TopGame) => {
      const next = [...games]; next[i] = g; update({ topGames: next })
    }
    const removeGame = (i: number) => update({ topGames: games.filter((_, idx) => idx !== i) })

    return (
      <div className="pb-step-content">
        <div className="pb-step-eyebrow">Step 6</div>
        <h1 className="pb-step-title">Your top games</h1>
        <p className="pb-step-sub">Add up to 3 games that show off your studio. These are visible on your profile.</p>

        {games.map((g, i) => (
          <GameEntry key={i} game={g} index={i} onChange={g2 => updateGame(i, g2)} onRemove={() => removeGame(i)} />
        ))}

        {games.length < 3 && (
          <button type="button" className="pb-add-btn" onClick={addGame}>+ Add game</button>
        )}

        <div className="pb-nav">
          <button className="pb-btn pb-btn--ghost" type="button" onClick={onBack}>Back</button>
          <button className="pb-btn pb-btn--primary" type="button" onClick={onNext}>
            {games.length === 0 ? 'Skip' : 'Next'}
          </button>
        </div>
      </div>
    )
  }

  const works = draft.bestWork
  const addWork = () => update({ bestWork: [...works, emptyWork()] })
  const updateWork = (i: number, w: DevWork) => {
    const next = [...works]; next[i] = w; update({ bestWork: next })
  }
  const removeWork = (i: number) => update({ bestWork: works.filter((_, idx) => idx !== i) })

  return (
    <div className="pb-step-content">
      <div className="pb-step-eyebrow">Step 6</div>
      <h1 className="pb-step-title">Your best work</h1>
      <p className="pb-step-sub">Add up to 3 projects you&apos;re most proud of. Studios love specifics — include real stats if you have them.</p>

      {works.map((w, i) => (
        <WorkEntry key={i} work={w} index={i} onChange={w2 => updateWork(i, w2)} onRemove={() => removeWork(i)} />
      ))}

      {works.length < 3 && (
        <button type="button" className="pb-add-btn" onClick={addWork}>+ Add project</button>
      )}

      <div className="pb-nav">
        <button className="pb-btn pb-btn--ghost" type="button" onClick={onBack}>Back</button>
        <button className="pb-btn pb-btn--primary" type="button" onClick={onNext}>
          {works.length === 0 ? 'Skip' : 'Next'}
        </button>
      </div>
    </div>
  )
}
