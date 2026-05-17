'use client'

import { useState } from 'react'
import { ProfileDraft } from './profile-types'
import { getInitials } from '@/lib/utils'

interface Props {
  draft: ProfileDraft
  update: (patch: Partial<ProfileDraft>) => void
  leftPanel: null | 'games'
  rightPanel: null | 'work' | 'skills' | 'portfolio' | { skill: string }
  onToggleLeft: () => void
  onToggleRight: (p: 'work' | 'skills' | 'portfolio' | { skill: string }) => void
  onBack: () => void
  onBackLabel?: string
  onPublish: () => void
  publishLabel?: string
  showPortfolioButton?: boolean
  showExperienceEdit?: boolean
}

function parseRobloxUserId(value: string): number | null {
  const match = value.match(/\/users\/(\d+)/)
  if (match) return Number(match[1])
  if (/^\d+$/.test(value.trim())) return Number(value.trim())
  return null
}

function expLabel(years: number | null): string {
  if (years === null) return '—'
  if (years === 0) return '<1 yr'
  if (years >= 5) return '5+ yrs'
  return `${years}+ yrs`
}

export default function EditableCard({
  draft,
  update,
  leftPanel,
  rightPanel,
  onToggleLeft,
  onToggleRight,
  onBack,
  onBackLabel = '← Back',
  onPublish,
  publishLabel = 'Publish profile',
  showPortfolioButton = false,
  showExperienceEdit = false,
}: Props) {
  const [showSkillsPicker, setShowSkillsPicker] = useState(false)
  const [showRobloxInput, setShowRobloxInput] = useState(false)
  const [robloxInputVal, setRobloxInputVal] = useState(
    draft.robloxUserId ? `https://www.roblox.com/users/${draft.robloxUserId}/profile` : ''
  )
  const [robloxInputError, setRobloxInputError] = useState(false)

  const initials = getInitials(draft.name) || '?'
  const rateDisplay = draft.rateAmount
    ? `${draft.rateAmount} ${draft.rateType ?? ''}`.trim()
    : draft.rateType ?? null
  const socialLinks = draft.socials.filter(s => s.url?.trim())
  const experienceInput = draft.experienceYears === null ? '' : draft.experienceYears.toString()
  const skills = draft.selectedSkills
  const multiSkill = skills.length > 1

  const removeSkill = (name: string) =>
    update({ selectedSkills: skills.filter(s => s.name !== name) })

  return (
    <div className="npc-wrap">
      <div className="npc-card">

        {/* Top: avatar + stats */}
        <div className="npc-top">
          <button
            type="button"
            className="npc-avatar-wrap"
            onClick={() => setShowRobloxInput(true)}
            title="Tap to set Roblox avatar"
          >
            <div className="npc-avatar-bg" style={{ background: draft.bg || '#4444EE' }} />
            <div className="npc-avatar-initials">{initials}</div>
            {draft.robloxUserId && (
              <img
                className="npc-avatar-img"
                src={`/api/roblox/avatar?userId=${draft.robloxUserId}`}
                alt={draft.name}
                onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            )}
            <div className="npc-online-dot" />
            <div className="npc-avatar-edit-badge" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="10" height="10">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </div>
          </button>

          <div className="npc-top-right">
            <div className="npc-stats">
              <div className="npc-stat">
                <div className="npc-stat-icon" aria-hidden>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div className="npc-stat-val">{expLabel(draft.experienceYears)}</div>
                <div className="npc-stat-lbl">Experience</div>
              </div>
              <div className="npc-stat">
                <div className="npc-stat-icon" aria-hidden>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <path d="M8 21h8M12 17v4" />
                  </svg>
                </div>
                <div className="npc-stat-val">{draft.bestWork.length || '—'}</div>
                <div className="npc-stat-lbl">Projects</div>
              </div>
              <div className="npc-stat">
                <div className="npc-stat-icon" aria-hidden>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 2 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                </div>
                <div className="npc-stat-val">{draft.topGames.length || '—'}</div>
                <div className="npc-stat-lbl">Games</div>
              </div>
              <div className="npc-stat">
                <div className="npc-stat-icon" aria-hidden>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                    <line x1="7" y1="7" x2="7.01" y2="7" />
                  </svg>
                </div>
                <div className="npc-stat-val">{skills.length > 0 ? skills.length : '—'}</div>
                <div className="npc-stat-lbl">Skills</div>
              </div>
            </div>

            {socialLinks.length > 0 && (
              <div className="npc-socials" style={{ marginTop: 6 }}>
                {socialLinks.slice(0, 4).map(s => (
                  <a key={s.label} href={s.url} target="_blank" rel="noreferrer" className="npc-social-btn">
                    {s.icon || s.label[0]}
                  </a>
                ))}
              </div>
            )}
            {draft.portfolioLinks.filter(l => l.url?.trim()).slice(0, 2).map(link => (
              <a
                key={link.url}
                href={/^https?:\/\//i.test(link.url) ? link.url : `https://${link.url}`}
                target="_blank"
                rel="noreferrer"
                className="npc-portfolio-top-link"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="10" height="10"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                {link.name || link.url}
              </a>
            ))}
          </div>
        </div>

        {/* Identity */}
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
          <div className="npc-role-row">
            <p className="npc-role">
              {draft.experienceYears !== null ? `Dev · ${expLabel(draft.experienceYears)}` : 'Developer'}
            </p>
            {showExperienceEdit && (
              <div className="npc-experience-edit">
                <label htmlFor="npc-exp-input" className="npc-exp-label">Edit years</label>
                <input
                  id="npc-exp-input"
                  className="npc-exp-input"
                  type="number"
                  min={0}
                  max={30}
                  value={experienceInput}
                  onChange={e => update({ experienceYears: e.target.value === '' ? null : Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
            )}
          </div>
        </div>

        <div className="npc-divider" />

        {/* Bio */}
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
            {multiSkill ? (
              <span className="npc-skill-chip npc-skill-chip--edit">
                <button
                  type="button"
                  className="npc-skill-chip-name"
                  onClick={() => setShowSkillsPicker(true)}
                >
                  Skills…
                </button>
              </span>
            ) : skills.length === 1 ? (
              <span key={skills[0].name} className="npc-skill-chip npc-skill-chip--edit">
                <button
                  type="button"
                  className="npc-skill-chip-name"
                  onClick={() => onToggleRight({ skill: skills[0].name })}
                >
                  {skills[0].name}
                </button>
                <button
                  type="button"
                  className="npc-skill-chip-x"
                  onClick={() => removeSkill(skills[0].name)}
                  aria-label={`Remove ${skills[0].name}`}
                >
                  ✕
                </button>
              </span>
            ) : null}
            {skills.length < 5 && (
              <button
                type="button"
                className={`npc-skill-chip npc-skill-chip--add${rightPanel === 'skills' ? ' npc-skill-chip--add-active' : ''}`}
                onClick={() => onToggleRight('skills')}
              >
                + Add skill
              </button>
            )}
          </div>
        </div>

        {/* Entry buttons — always 3 columns */}
        <div className="npc-entries npc-entries--editor-tail" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <button
            className={`npc-entry-btn${leftPanel === 'games' ? ' npc-entry-btn--active' : ''}`}
            onClick={onToggleLeft}
          >
            <div className="npc-entry-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 2 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
            </div>
            <div className="npc-entry-title">Games{draft.topGames.length > 0 ? ` (${draft.topGames.length})` : ''}</div>
            <div className="npc-entry-sub">Games I&apos;ve worked on →</div>
          </button>

          <button
            className={`npc-entry-btn${rightPanel === 'work' ? ' npc-entry-btn--active' : ''}`}
            onClick={() => onToggleRight('work')}
          >
            <div className="npc-entry-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <div className="npc-entry-title">My Work{draft.bestWork.length > 0 ? ` (${draft.bestWork.length})` : ''}</div>
            <div className="npc-entry-sub">Projects I&apos;ve built →</div>
          </button>

          {showPortfolioButton && (
            <button
              className={`npc-entry-btn${rightPanel === 'portfolio' ? ' npc-entry-btn--active' : ''}`}
              onClick={() => onToggleRight('portfolio')}
            >
              <div className="npc-entry-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14" /><path d="M5 12h14" />
                </svg>
              </div>
              <div className="npc-entry-title">Portfolio</div>
              <div className="npc-entry-sub">Links &amp; portfolio →</div>
            </button>
          )}
        </div>

        {/* Roblox ID input popup */}
        {showRobloxInput && (
          <div
            className="pb-glass-modal"
            role="presentation"
            onClick={() => setShowRobloxInput(false)}
          >
            <div className="pb-glass-modal__panel" role="dialog" aria-labelledby="pb-roblox-modal-title" onClick={e => e.stopPropagation()}>
              <div id="pb-roblox-modal-title" className="pb-glass-modal__title">Set Roblox Avatar</div>
              <p className="pb-glass-modal__desc">Paste your Roblox profile URL or numeric user ID.</p>
              <input
                className={`pb-glass-modal__input${robloxInputError ? ' pb-glass-modal__input--error' : ''}`}
                value={robloxInputVal}
                onChange={e => { setRobloxInputVal(e.target.value); setRobloxInputError(false) }}
                placeholder="https://www.roblox.com/users/12345/profile"
                autoFocus
              />
              {robloxInputError && (
                <p className="pb-glass-modal__error">Paste a Roblox profile URL or numeric user ID.</p>
              )}
              <div className="pb-glass-modal__actions">
                <button
                  type="button"
                  className="pb-glass-modal__btn pb-glass-modal__btn--primary"
                  onClick={() => {
                    const id = parseRobloxUserId(robloxInputVal)
                    if (id) { update({ robloxUserId: id }); setShowRobloxInput(false); setRobloxInputError(false) }
                    else setRobloxInputError(true)
                  }}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="pb-glass-modal__btn pb-glass-modal__btn--ghost"
                  onClick={() => setShowRobloxInput(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Skills picker popup */}
        {showSkillsPicker && (
          <div
            className="pb-glass-modal"
            role="presentation"
            onClick={() => setShowSkillsPicker(false)}
          >
            <div className="pb-glass-modal__panel" role="dialog" aria-labelledby="pb-skills-modal-title" onClick={e => e.stopPropagation()}>
              <div id="pb-skills-modal-title" className="pb-glass-modal__title pb-glass-modal__title--spaced">Your Skills</div>
              {skills.map(s => (
                <div key={s.name} className="pb-glass-modal__list-row">
                  <button
                    type="button"
                    className="pb-glass-modal__skill-name"
                    onClick={() => { setShowSkillsPicker(false); onToggleRight({ skill: s.name }) }}
                  >
                    {s.name}
                  </button>
                  <button
                    type="button"
                    className="pb-glass-modal__remove"
                    onClick={() => removeSkill(s.name)}
                    aria-label={`Remove ${s.name}`}
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="pb-glass-modal__close"
                onClick={() => setShowSkillsPicker(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Editor action bar */}
      <div className="npc-editor-bar">
        <button type="button" className="npc-editor-publish" onClick={onPublish}>
          {publishLabel}
        </button>
        <button type="button" className="npc-editor-back" onClick={onBack}>
          {onBackLabel}
        </button>
      </div>
    </div>
  )
}
