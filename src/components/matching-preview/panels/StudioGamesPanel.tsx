'use client'

import type { PreviewProfile, TopGame } from '../preview-types'

interface Props {
  profile: PreviewProfile
  onBack: () => void
}

const TAG_COLORS = ['#818cf8', '#34d399', '#fb923c', '#60a5fa', '#f472b6', '#facc15', '#a78bfa']

function tagColor(idx: number) {
  return TAG_COLORS[idx % TAG_COLORS.length]
}

function parseNum(val: string | undefined): number {
  if (!val) return 0
  const n = parseFloat(val.replace(/[^0-9.]/g, ''))
  if (val.includes('M')) return n * 1_000_000
  if (val.includes('K')) return n * 1_000
  return n
}

function fmtTotal(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}K`
  return String(n)
}

export default function StudioGamesPanel({ profile, onBack }: Props) {
  const games: TopGame[] = profile.topGames ?? []

  const totalPlayers = fmtTotal(games.reduce((s, g) => s + parseNum(g.currentCcu), 0))
  const totalVisits = fmtTotal(games.reduce((s, g) => s + parseNum(g.plays), 0))
  const likesNums = games.map(g => parseFloat(g.likes ?? '')).filter(n => !isNaN(n))
  const avgLikes = likesNums.length ? Math.round(likesNums.reduce((a, b) => a + b, 0) / likesNums.length) + '%' : '—'

  return (
    <div className="npc-panel" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div className="npc-panel-hd">
        <div className="sgp-hd-row">
          <button className="npc-panel-back" onClick={onBack}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Back
          </button>
          <div className="sgp-sort">
            <span>Most Recent</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </div>
        <h2 className="npc-panel-title" style={{ marginTop: 6 }}>My Games</h2>
        <p className="sgp-subtitle">Games built and published by {profile.name}.</p>
      </div>

      {/* Scrollable game list */}
      <div className="npc-panel-body sgp-list" style={{ flex: 1 }}>
        {games.length === 0 ? (
          <p style={{ color: '#aaa', fontSize: 13, textAlign: 'center', paddingTop: 40 }}>No games added yet.</p>
        ) : games.map((game, i) => (
          <div key={i} className="sgp-item">
            {/* Square thumbnail */}
            <div className="sgp-thumb" style={{ background: `${tagColor(i)}18` }}>
              {game.imageUrl
                ? <img src={game.imageUrl} alt={game.title} />
                : <span style={{ fontSize: 22, color: tagColor(i) }}>{game.emoji}</span>
              }
            </div>

            {/* Info column */}
            <div className="sgp-info">
              <div className="sgp-name">
                <span>{game.title || 'Untitled'}</span>
                {game.gameUrl && (
                  <a href={game.gameUrl} target="_blank" rel="noreferrer" className="sgp-ext-link" onClick={e => e.stopPropagation()}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="10" height="10">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                  </a>
                )}
              </div>
              {game.genre && <div className="sgp-genre">{game.genre}</div>}
              {game.desc && <p className="sgp-desc">{game.desc}</p>}
            </div>

            {/* Stats column */}
            <div className="sgp-stats">
              {game.currentCcu && <div className="sgp-stat"><div className="sgp-stat-val">{game.currentCcu}</div><div className="sgp-stat-lbl">Players</div></div>}
              {game.likes && <div className="sgp-stat"><div className="sgp-stat-val">{game.likes}</div><div className="sgp-stat-lbl">Likes</div></div>}
              {game.plays && <div className="sgp-stat"><div className="sgp-stat-val">{game.plays}</div><div className="sgp-stat-lbl">Visits</div></div>}
              {game.updatedAgo && <div className="sgp-stat"><div className="sgp-stat-val">{game.updatedAgo}</div><div className="sgp-stat-lbl">Updated</div></div>}
              {game.gameUrl && (
                <a href={game.gameUrl} target="_blank" rel="noreferrer" className="sgp-arrow" onClick={e => e.stopPropagation()}>→</a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer summary bar */}
      {games.length > 0 && (
        <div className="sgp-footer">
          <div className="sgp-footer-stat">
            <div className="sgp-footer-val">{games.length}</div>
            <div className="sgp-footer-lbl">Games</div>
          </div>
          <div className="sgp-footer-stat">
            <div className="sgp-footer-val">{totalPlayers}</div>
            <div className="sgp-footer-lbl">Total Players</div>
          </div>
          <div className="sgp-footer-stat">
            <div className="sgp-footer-val">{totalVisits}</div>
            <div className="sgp-footer-lbl">Total Visits</div>
          </div>
          <div className="sgp-footer-stat">
            <div className="sgp-footer-val">{avgLikes}</div>
            <div className="sgp-footer-lbl">Avg Likes</div>
          </div>
        </div>
      )}
    </div>
  )
}
