'use client'

import type { PreviewProfile } from '../preview-types'

interface Props {
  profile: PreviewProfile
  onBack: () => void
}

const ICON_COLORS = ['#a78bfa', '#34d399', '#fb923c', '#60a5fa', '#f472b6', '#facc15']

export default function WorkPanel({ profile, onBack }: Props) {
  const work = profile.bestWork ?? []
  const summary = profile.workSummary

  return (
    <div className="npc-panel" style={{ display: 'flex', flexDirection: 'column' }}>
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
        ) : (
          work.map((item, i) => {
            const color = ICON_COLORS[i % ICON_COLORS.length]
            return (
              <div key={i} className="npc-work-item">
                <div className="npc-work-icon" style={{ background: `${color}22`, color }}>
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10 }} />
                  ) : (
                    <span style={{ fontSize: 11, fontWeight: 700, textAlign: 'center', lineHeight: 1.2 }}>{item.emoji || 'Code'}</span>
                  )}
                </div>

                <div className="npc-work-copy">
                  <div className="npc-work-title">{item.title}</div>
                  {item.desc && <div className="npc-work-desc">{item.desc}</div>}

                  {item.tools && (
                    <div className="npc-work-tags">
                      {item.tools.split(',').map(t => (
                        <span key={t} className="npc-work-tag">{t.trim()}</span>
                      ))}
                    </div>
                  )}

                  <div className="npc-work-stats">
                    {item.time && (
                      <div className="npc-work-stat">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                        </svg>
                        <span className="npc-work-stat-val">{item.time}</span>
                        <span className="npc-work-stat-lbl">Time</span>
                      </div>
                    )}
                    {item.amount && (
                      <div className="npc-work-stat">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                        </svg>
                        <span className="npc-work-stat-val">{item.amount}</span>
                        <span className="npc-work-stat-lbl">Paid</span>
                      </div>
                    )}
                    {item.plays && (
                      <div className="npc-work-stat">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                        <span className="npc-work-stat-val">{item.plays}</span>
                        <span className="npc-work-stat-lbl">Plays</span>
                      </div>
                    )}
                  </div>
                </div>

                <button className="npc-work-arrow" aria-label="View details">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>
              </div>
            )
          })
        )}

        {summary && (
          <div className="npc-work-footer">
            <div className="npc-work-footer-stat">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
              </svg>
              <span className="npc-work-footer-val">{summary.totalProjects}</span>
              <span className="npc-work-footer-lbl">Total Projects</span>
            </div>
            <div className="npc-work-footer-stat">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
              </svg>
              <span className="npc-work-footer-val">{summary.linesOfCode}</span>
              <span className="npc-work-footer-lbl">Lines of Code</span>
            </div>
            <div className="npc-work-footer-stat">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              <span className="npc-work-footer-val">{summary.totalHours}</span>
              <span className="npc-work-footer-lbl">Total Hours</span>
            </div>
            <div className="npc-work-footer-stat">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              <span className="npc-work-footer-val">{summary.commitment}</span>
              <span className="npc-work-footer-lbl">Commitment</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
