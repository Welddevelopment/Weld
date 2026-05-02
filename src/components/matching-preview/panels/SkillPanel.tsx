'use client'

import type { PreviewProfile } from '../preview-types'

interface Props {
  profile: PreviewProfile
  skillName: string
  onBack: () => void
}

const ICON_COLORS = ['#a78bfa', '#34d399', '#fb923c', '#60a5fa', '#f472b6', '#facc15']

function colorForSkill(name: string) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  return ICON_COLORS[h % ICON_COLORS.length]
}

function formatMonths(months: number): string {
  if (months < 12) return `${months} mo`
  const yrs = months / 12
  if (yrs % 1 === 0) return `${yrs} yr${yrs === 1 ? '' : 's'}`
  return `${Math.floor(yrs)}.5 yrs`
}

export default function SkillPanel({ profile, skillName, onBack }: Props) {
  const skill = (profile.skills ?? []).find(s => s.name === skillName)

  const color = colorForSkill(skillName)
  const categories = skill?.categories ?? []
  const resources = skill?.resources ?? []
  const recentGames = (profile.topGames ?? []).slice(0, 3)
  const hasStats = skill?.experienceMonths || skill?.pastWorks

  return (
    <div className="npc-panel">
      <div className="npc-panel-hd">
        <button className="npc-panel-back" onClick={onBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back
        </button>
      </div>

      <div className="npc-panel-body">
        {/* Header */}
        <div className="npc-skill-hd">
          <div className="npc-skill-icon-box" style={{ background: `${color}33`, color }}>
            {skillName.slice(0, 3)}
          </div>
          <div className="npc-skill-hd-copy">
            <div className="npc-skill-hd-name">{skillName}</div>
            <div className="npc-skill-hd-cat">Development Skill</div>
            {skill?.description && (
              <p className="npc-skill-hd-desc">{skill.description}</p>
            )}
          </div>
        </div>

        {/* Experience / past works stats */}
        {hasStats && (
          <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
            {!!skill?.experienceMonths && (
              <div style={{ flex: 1, background: '#f7f7ff', border: '1.5px solid #e8e8f5', borderRadius: 10, padding: '8px 12px' }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#111' }}>
                  {formatMonths(skill.experienceMonths)}
                </div>
                <div style={{ fontSize: 10, color: '#999', fontFamily: 'var(--font-geist-mono)', marginTop: 2 }}>Experience</div>
              </div>
            )}
            {!!skill?.pastWorks && (
              <div style={{ flex: 1, background: '#f7f7ff', border: '1.5px solid #e8e8f5', borderRadius: 10, padding: '8px 12px' }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#111' }}>
                  {skill.pastWorks}
                </div>
                <div style={{ fontSize: 10, color: '#999', fontFamily: 'var(--font-geist-mono)', marginTop: 2 }}>Past works</div>
              </div>
            )}
          </div>
        )}

        {/* Reference links */}
        {resources.length > 0 && (
          <div className="npc-skill-refs">
            {resources.map((r: { label: string; url: string }) => (
              <a key={r.label} href={r.url} target="_blank" rel="noreferrer" className="npc-skill-ref-link">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
                {r.label}
              </a>
            ))}
          </div>
        )}

        {/* Capability cards */}
        {categories.length > 0 && (
          <>
            <div className="npc-section-title">What I can build with {skillName}</div>
            <div className="npc-cap-grid">
              {categories.map((cat: { name: string; description: string }, i: number) => (
                <div key={i} className="npc-cap-card">
                  <div className="npc-cap-name">{cat.name}</div>
                  <div className="npc-cap-desc">{cat.description}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Recent projects using this skill */}
        {recentGames.length > 0 && (
          <>
            <div className="npc-section-title" style={{ marginTop: categories.length > 0 ? 4 : 0 }}>
              Recent Projects
            </div>
            {recentGames.map((game, i) => (
              <div key={i} className="npc-recent-item">
                <div className="npc-recent-thumb">{game.emoji}</div>
                <div className="npc-recent-copy">
                  <div className="npc-recent-title">{game.title}</div>
                  {game.desc && <div className="npc-recent-sub">{game.desc}</div>}
                </div>
                <div className="npc-recent-stats">
                  <div className="npc-recent-stat">
                    <span className="npc-recent-stat-val">{game.currentCcu}</span>
                    <span className="npc-recent-stat-lbl">CCU</span>
                  </div>
                  <div className="npc-recent-stat">
                    <span className="npc-recent-stat-val">{game.plays}</span>
                    <span className="npc-recent-stat-lbl">Plays</span>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {categories.length === 0 && recentGames.length === 0 && (
          <p style={{ color: '#aaa', fontSize: 13, textAlign: 'center', paddingTop: 32 }}>
            {skill?.description
              ? 'No additional detail added for this skill.'
              : 'No detail added for this skill yet.'}
          </p>
        )}
      </div>
    </div>
  )
}
