'use client'

import { ProfileDraft } from './profile-types'
import { getInitials } from '@/lib/utils'

export type EditorPanel = null | 'skills' | 'work' | 'games'

interface Props {
  draft: ProfileDraft
  update: (patch: Partial<ProfileDraft>) => void
  activePanel: EditorPanel
  onOpenPanel: (p: EditorPanel) => void
  onBack: () => void
  onPublish: () => void
}

function expLabel(years: number | null): string {
  if (years === null) return '—'
  if (years === 0) return '<1 yr'
  if (years >= 5) return '5+ yrs'
  return `${years}+ yrs`
}

export default function EditableCard({ draft, update, activePanel, onOpenPanel, onBack, onPublish }: Props) {
  const initials = getInitials(draft.name) || '?'
  const rateDisplay = draft.rateAmount
    ? `${draft.rateAmount} ${draft.rateType ?? ''}`.trim()
    : draft.rateType ?? null

  const removeSkill = (name: string) =>
    update({ selectedSkills: draft.selectedSkills.filter(s => s.name !== name) })

  const toggle = (panel: EditorPanel) =>
    onOpenPanel(activePanel === panel ? null : panel)

  return (
    <div className="npc-wrap">
      <div className="npc-card">

        {/* Top: avatar + stats */}
        <div className="npc-top">
          <div className="npc-avatar-wrap">
            <div className="npc-avatar-bg" style={{ background: draft.bg || '#4444EE' }} />
            <div className="npc-avatar-initials">{initials}</div>
            {draft.robloxUserId && (
              <img
                className="npc-avatar-img"
                src={`https://www.roblox.com/headshot-thumbnail/image?userId=${draft.robloxUserId}&width=150&height=150&format=png`}
                alt={draft.name}
                onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            )}
            <div className="npc-online-dot" />
          </div>

          <div className="npc-top-right">
            <div style={{ height: 34 }} />
            <div className="npc-stats">
              <div className="npc-stat">
                <div className="npc-stat-val">{expLabel(draft.experienceYears)}</div>
                <div className="npc-stat-lbl">Experience</div>
              </div>
              <div className="npc-stat">
                <div className="npc-stat-val">{draft.bestWork.length || '—'}</div>
                <div className="npc-stat-lbl">Projects</div>
              </div>
              <div className="npc-stat">
                <div className="npc-stat-val">{draft.topGames.length || '—'}</div>
                <div className="npc-stat-lbl">Games</div>
              </div>
              <div className="npc-stat">
                <div className="npc-stat-val">—</div>
                <div className="npc-stat-lbl">On-time</div>
              </div>
            </div>
          </div>
        </div>

        {/* Identity: editable name */}
        <div className="npc-identity">
          <div className="npc-name-row">
            <input
              className="npc-editable-name"
              value={draft.name}
              onChange={e => update({ name: e.target.value })}
              placeholder="Your name"
              maxLength={40}
            />
            {draft.badge && (
              <span className="npc-verified" title={draft.badge}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                </svg>
              </span>
            )}
          </div>
          <p className="npc-role">
            {draft.experienceYears !== null ? `Dev · ${expLabel(draft.experienceYears)}` : 'Developer'}
          </p>
        </div>

        <div className="npc-divider" />

        {/* Bio: editable textarea */}
        <textarea
          className="npc-editable-bio"
          value={draft.bio}
          onChange={e => update({ bio: e.target.value.slice(0, 280) })}
          placeholder="Write a short bio — what you build, your strengths, your ideal collab..."
          rows={3}
        />

        {/* Rate pill + skill chips */}
        <div className="npc-rate-skills">
          {rateDisplay && (
            <div className="npc-rate-pill">
              <div className="npc-rate-amount">{rateDisplay}</div>
              <div className="npc-rate-type">Hourly or milestone</div>
            </div>
          )}
          <div className="npc-skills-wrap">
            {draft.selectedSkills.map(s => (
              <span key={s.name} className="npc-skill-chip npc-skill-chip--edit">
                <button
                  type="button"
                  className="npc-skill-chip-name"
                  onClick={() => toggle('skills')}
                >
                  {s.name}
                </button>
                <button
                  type="button"
                  className="npc-skill-chip-x"
                  onClick={() => removeSkill(s.name)}
                  aria-label={`Remove ${s.name}`}
                >
                  ✕
                </button>
              </span>
            ))}
            {draft.selectedSkills.length < 5 && (
              <button
                type="button"
                className={`npc-skill-chip npc-skill-chip--add${activePanel === 'skills' ? ' npc-skill-chip--add-active' : ''}`}
                onClick={() => toggle('skills')}
              >
                + Add skill
              </button>
            )}
          </div>
        </div>

        {/* Entry buttons */}
        <div className="npc-entries">
          <button
            className={`npc-entry-btn${activePanel === 'games' ? ' npc-entry-btn--active' : ''}`}
            onClick={() => toggle('games')}
          >
            <div className="npc-entry-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 2 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
            </div>
            <div className="npc-entry-title">
              Games{draft.topGames.length > 0 ? ` (${draft.topGames.length})` : ''}
            </div>
            <div className="npc-entry-sub">
              {activePanel === 'games' ? '← Close' : "Add games I've worked on →"}
            </div>
          </button>

          <button
            className={`npc-entry-btn${activePanel === 'work' ? ' npc-entry-btn--active' : ''}`}
            onClick={() => toggle('work')}
          >
            <div className="npc-entry-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <div className="npc-entry-title">
              My Work{draft.bestWork.length > 0 ? ` (${draft.bestWork.length})` : ''}
            </div>
            <div className="npc-entry-sub">
              {activePanel === 'work' ? '← Close' : "Add projects I've built →"}
            </div>
          </button>
        </div>
      </div>

      {/* Editor action bar */}
      <div className="npc-editor-bar">
        <button type="button" className="npc-editor-back" onClick={onBack}>
          ← Back
        </button>
        <button type="button" className="npc-editor-publish" onClick={onPublish}>
          Publish Profile
        </button>
      </div>
    </div>
  )
}
