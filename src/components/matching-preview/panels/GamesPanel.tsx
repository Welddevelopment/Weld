'use client'

import type { PreviewProfile } from '../preview-types'

interface Props {
  profile: PreviewProfile
  onBack: () => void
}

const CATEGORY_COLOR: Record<string, string> = {
  Game: '#818cf8', Combat: '#f87171', Build: '#34d399',
  Art: '#f472b6', Tools: '#60a5fa', VFX: '#fb923c',
  Audio: '#facc15', World: '#4ade80', Launch: '#a78bfa',
}

export default function GamesPanel({ profile, onBack }: Props) {
  const games = profile.topGames ?? []

  return (
    <div className="npc-panel">
      <div className="npc-panel-hd">
        <button className="npc-panel-back" onClick={onBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back
        </button>
        <h2 className="npc-panel-title">My Games</h2>
        <p className="npc-panel-sub">A collection of games I&apos;ve worked on.</p>
      </div>

      <div className="npc-panel-body">
        {games.length === 0 ? (
          <p style={{ color: '#aaa', fontSize: 13, textAlign: 'center', paddingTop: 40 }}>
            No games added yet.
          </p>
        ) : games.map((game, i) => {
          const label = game.skills?.[0] ?? game.emoji ?? 'Game'
          const color = CATEGORY_COLOR[label] ?? '#818cf8'
          return (
            <div key={i} className="npc-game-item">
              <div className="npc-game-thumb" style={{ background: `${color}18` }}>
                {game.imageUrl
                  ? <img src={game.imageUrl} alt={game.title} />
                  : <span className="npc-game-thumb-cat" style={{ color }}>{label}</span>
                }
              </div>

              <div className="npc-game-copy">
                <div className="npc-game-title">{game.title || 'Untitled'}</div>

                {game.gameUrl && (
                  <a href={game.gameUrl} target="_blank" rel="noreferrer" className="npc-game-url">
                    {game.gameUrl.replace(/^https?:\/\/(www\.)?/, '')}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15 3 21 3 21 9"/>
                      <line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                  </a>
                )}

                {(game.plays || game.currentCcu || game.topCcu) && (
                  <div className="npc-game-stats">
                    {game.plays && (
                      <div className="npc-game-stat">
                        <span className="npc-game-stat-val">{game.plays}</span>
                        <span className="npc-game-stat-lbl">Visits</span>
                      </div>
                    )}
                    {game.currentCcu && (
                      <div className="npc-game-stat">
                        <span className="npc-game-stat-val">{game.currentCcu}</span>
                        <span className="npc-game-stat-lbl">Players</span>
                      </div>
                    )}
                    {game.topCcu && (
                      <div className="npc-game-stat">
                        <span className="npc-game-stat-val">{game.topCcu}</span>
                        <span className="npc-game-stat-lbl">Peak CCU</span>
                      </div>
                    )}
                  </div>
                )}

                {game.desc && (
                  <p className="npc-game-desc">{game.desc}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
