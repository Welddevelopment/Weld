'use client'

import type { PreviewProfile } from '../preview-types'

interface Props {
  profile: PreviewProfile
  onBack: () => void
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
        ) : (
          games.map((game, i) => (
            <div key={i} className="npc-game-item">
              <div className="npc-game-thumb">
                {game.emoji}
              </div>
              <div className="npc-game-copy">
                <div className="npc-game-title">{game.title}</div>
                <div className="npc-game-stats">
                  <div className="npc-game-stat">
                    <span className="npc-game-stat-val">{game.plays}</span>
                    <span className="npc-game-stat-lbl">Visits</span>
                  </div>
                  <div className="npc-game-stat">
                    <span className="npc-game-stat-val">{game.currentCcu}</span>
                    <span className="npc-game-stat-lbl">Players</span>
                  </div>
                  <div className="npc-game-stat">
                    <span className="npc-game-stat-val">{game.topCcu}</span>
                    <span className="npc-game-stat-lbl">Peak CCU</span>
                  </div>
                </div>
                {game.desc && (
                  <p style={{ fontSize: 11, color: '#666', margin: '4px 0 0', lineHeight: 1.4 }}>{game.desc}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
