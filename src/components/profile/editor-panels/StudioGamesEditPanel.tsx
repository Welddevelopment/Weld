'use client'

import { useState } from 'react'
import { ProfileDraft } from '../profile-types'
import { TopGame } from '@/components/matching-preview/preview-types'
import { DEV_SKILL_DESCS } from '@/components/matching-preview/preview-data'

const SKILL_OPTIONS = Object.keys(DEV_SKILL_DESCS)
const MAX_GAME_SKILLS = 3

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
    skills: [],
    genre: '',
    likes: '',
    updatedAgo: '',
  }
}

export default function StudioGamesEditPanel({ draft, update, onClose }: Props) {
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

  const toggleSkill = (i: number, g: TopGame, skill: string) => {
    const current = g.skills ?? []
    const hasSkill = current.includes(skill)
    const nextSkills = hasSkill
      ? current.filter(name => name !== skill)
      : current.length < MAX_GAME_SKILLS
        ? [...current, skill]
        : current
    change(i, { ...g, skills: nextSkills, emoji: nextSkills[0] ?? g.emoji })
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
        <h2 className="npc-panel-title">Studio Games</h2>
        <p className="npc-panel-sub">Games your studio has shipped or is working on.</p>
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
                title="Edit game skills"
              >
                {(g.skills && g.skills.length > 0) ? g.skills.join(', ') : 'Add skills'}
                <span className="pb-category-pill-dots">···</span>
              </button>
              <button type="button" className="pb-entry-card-remove" onClick={() => remove(i)}>Remove</button>
            </div>

            {openPicker.has(i) && (
              <div className="pb-emoji-row">
                {SKILL_OPTIONS.map(skill => {
                  const selected = g.skills?.includes(skill)
                  const disabled = !selected && (g.skills?.length ?? 0) >= MAX_GAME_SKILLS
                  return (
                    <button
                      key={skill}
                      type="button"
                      className={`pb-emoji-btn${selected ? ' pb-emoji-btn--on' : ''}${disabled ? ' pb-emoji-btn--disabled' : ''}`}
                      onClick={() => toggleSkill(i, g, skill)}
                      disabled={disabled}
                    >
                      {skill}
                    </button>
                  )
                })}
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
