'use client'

import type { PreviewProfile } from '../preview-types'

interface Props {
  profile: PreviewProfile
  onBack: () => void
}

const ITEM_COLORS = ['#a78bfa', '#34d399', '#fb923c', '#60a5fa', '#f472b6', '#facc15']

export default function WorkPanel({ profile, onBack }: Props) {
  const work = profile.bestWork ?? []

  return (
    <div className="npc-panel">
      <div className="npc-panel-hd">
        <button className="npc-panel-back" onClick={onBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back
        </button>
        <h2 className="npc-panel-title">My Work</h2>
        <p className="npc-panel-sub">A collection of projects, systems, and tools I&apos;ve built.</p>
      </div>

      <div className="npc-panel-body">
        {work.length === 0 ? (
          <p style={{ color: '#aaa', fontSize: 13, textAlign: 'center', paddingTop: 40 }}>
            No work items added yet.
          </p>
        ) : work.map((item, i) => {
          const color = ITEM_COLORS[i % ITEM_COLORS.length]
          const tools = item.tools ? item.tools.split(',').map(t => t.trim()).filter(Boolean) : []

          return (
            <div key={i} className="npc-game-item">
              {/* Thumbnail — same 16:9 box as GamesPanel */}
              <div className="npc-game-thumb" style={{ background: `${color}18` }}>
                {item.imageUrl
                  ? <img src={item.imageUrl} alt={item.title} />
                  : <span className="npc-game-thumb-cat" style={{ color }}>{item.emoji || 'Work'}</span>
                }
              </div>

              <div className="npc-game-copy">
                <div className="npc-game-title">{item.title || 'Untitled'}</div>

                {(item.time || item.amount || item.plays) && (
                  <div className="npc-game-stats">
                    {item.time && (
                      <div className="npc-game-stat">
                        <span className="npc-game-stat-val">{item.time}</span>
                        <span className="npc-game-stat-lbl">Time</span>
                      </div>
                    )}
                    {item.amount && (
                      <div className="npc-game-stat">
                        <span className="npc-game-stat-val">{item.amount}</span>
                        <span className="npc-game-stat-lbl">Paid</span>
                      </div>
                    )}
                    {item.plays && (
                      <div className="npc-game-stat">
                        <span className="npc-game-stat-val">{item.plays}</span>
                        <span className="npc-game-stat-lbl">Date</span>
                      </div>
                    )}
                  </div>
                )}

                {tools.length > 0 && (
                  <div className="npc-game-tags">
                    {tools.map(tool => (
                      <span key={tool} className="npc-game-tag" style={{ background: `${color}18`, color }}>
                        {tool}
                      </span>
                    ))}
                  </div>
                )}

                {item.desc && (
                  <p className="npc-game-desc">{item.desc}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
