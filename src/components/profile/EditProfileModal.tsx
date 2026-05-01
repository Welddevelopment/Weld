'use client'

import { useEffect, useRef, useState } from 'react'

import type { DevWork, TopGame } from '@/components/matching-preview/preview-types'
import { BG, DEV_SKILL_DESCS } from '@/components/matching-preview/preview-data'
import { createDraft, draftToProfile, profileToDraft, type ProfileDraft } from './profile-types'
import type { PreviewProfile } from '@/components/matching-preview/preview-types'

// ─── Constants ────────────────────────────────────────────────────────────────

const DRAFT_KEY = 'weld_profile_draft'

const EXP_OPTIONS = [
  { label: '<1yr', value: 0 },
  { label: '1-2yr', value: 1 },
  { label: '3-4yr', value: 3 },
  { label: '5+yr', value: 5 },
]

const RATE_TYPES = ['USD / hr', 'Robux / hr', 'Fixed USD', 'Fixed Robux']

const TEAM_SIZES = [
  { label: '1-2', value: 1 },
  { label: '3-4', value: 3 },
  { label: '5-9', value: 5 },
  { label: '10-19', value: 10 },
  { label: '20+', value: 20 },
]

const STATUS_OPTIONS = ['Hiring Now', 'Open to Offers', 'Closed']
const BUDGET_TYPES = ['USD', 'Robux', 'Mixed', 'Fixed']

const SOCIAL_ICONS = ['🐦', '📺', '📸', '💬', '🌐', '📧']
const SOCIAL_LABELS = ['Twitter / X', 'YouTube', 'Instagram', 'Discord', 'Website', 'Email']

const EMOJI_OPTIONS = ['Game', 'Combat', 'Build', 'Art', 'Tools', 'VFX', 'Audio', 'World', 'Launch']

const DEV_SKILLS = Object.keys(DEV_SKILL_DESCS)
const MAX_SKILLS = 5

const STUDIO_SKILLS = [
  'Scripting', 'UI Design', 'VFX', 'Building', '3D Modeling',
  'Lighting', 'Animation', 'DataStore', 'Sound Design', 'Music',
  'Figma', 'Game Design', 'Producer', 'QA Tester',
]

const STUDIO_SKILL_DESCS: Record<string, string> = {
  'Scripting':    'Looking for developers who can build robust game systems in Luau.',
  'UI Design':    'Need a UI dev to design and build polished player-facing interfaces.',
  'VFX':          'Seeking a VFX artist to create immersive visual effects for our games.',
  'Building':     'Looking for a builder to create large-scale, detailed Roblox environments.',
  '3D Modeling':  'Need a 3D artist to produce custom assets and props in Blender.',
  'Lighting':     'Seeking a lighting artist to set mood and atmosphere across our game worlds.',
  'Animation':    'Looking for an animator for characters, cutscenes, and procedural motion.',
  'DataStore':    'Need a backend dev to build and maintain persistent player data systems.',
  'Sound Design': 'Seeking a sound designer to create original SFX for our games.',
  'Music':        'Looking for a composer to create adaptive in-game soundtracks.',
  'Figma':        'Need a designer who can run a full UI pipeline from wireframe to handoff.',
  'Game Design':  'Seeking a game designer to define core loops, economy, and progression.',
  'Producer':     'Looking for a producer to coordinate the team and keep projects on track.',
  'QA Tester':    'Need a tester to find and report bugs across all platforms and devices.',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function loadLocalDraft(): ProfileDraft {
  if (typeof window === 'undefined') return createDraft()
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (raw) return { ...createDraft(), ...JSON.parse(raw) }
  } catch {}
  return createDraft()
}

function emptyWork(): DevWork {
  return { emoji: 'Game', title: '', desc: '', tools: '', time: '', amount: '', plays: '' }
}

function emptyGame(): TopGame {
  return { emoji: 'Game', title: '', desc: '', plays: '', topCcu: '', currentCcu: '' }
}

// ─── Shared style tokens ───────────────────────────────────────────────────────

const S = {
  label: {
    fontSize: 10,
    fontFamily: 'var(--font-mono)',
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    color: 'rgba(255,245,240,0.45)',
    marginBottom: 8,
    display: 'block',
  },
  input: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8,
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    outline: 'none',
    padding: '7px 10px',
    width: '100%',
    boxSizing: 'border-box' as const,
    fontFamily: 'inherit',
  },
  textarea: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8,
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    outline: 'none',
    padding: '7px 10px',
    width: '100%',
    boxSizing: 'border-box' as const,
    fontFamily: 'inherit',
    resize: 'vertical' as const,
    lineHeight: 1.5,
  },
  field: { marginBottom: 20 },
  pillRow: { display: 'flex', flexWrap: 'wrap' as const, gap: 6 },
  pillActive: {
    border: '1.5px solid #E84624',
    background: 'rgba(232,70,36,0.15)',
    color: '#E84624',
    padding: '5px 12px',
    borderRadius: 999,
    fontSize: 12,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  pillInactive: {
    border: '1.5px solid rgba(255,255,255,0.15)',
    background: 'rgba(255,255,255,0.04)',
    color: 'rgba(255,255,255,0.55)',
    padding: '5px 12px',
    borderRadius: 999,
    fontSize: 12,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function InlineEdit({
  value,
  onChange,
  placeholder = 'Click to edit…',
  darkBg = false,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  darkBg?: boolean
}) {
  function autoResize(el: HTMLTextAreaElement) {
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }
  return (
    <textarea
      value={value}
      onChange={e => { onChange(e.target.value); autoResize(e.target) }}
      onFocus={e => {
        e.target.style.borderColor = 'rgba(232,70,36,0.55)'
        e.target.style.background = darkBg ? 'rgba(232,70,36,0.08)' : 'rgba(232,70,36,0.06)'
        autoResize(e.target)
      }}
      onBlur={e => {
        e.target.style.borderColor = 'transparent'
        e.target.style.background = 'transparent'
      }}
      placeholder={placeholder}
      rows={1}
      style={{
        display: 'block', width: '100%', background: 'transparent',
        border: '1.5px dashed transparent', borderRadius: 6, outline: 'none',
        resize: 'none', overflow: 'hidden', cursor: 'text',
        fontFamily: 'inherit', fontSize: 'inherit', lineHeight: 'inherit',
        color: 'inherit', letterSpacing: 'inherit',
        padding: '3px 6px', margin: '-3px -6px', boxSizing: 'border-box',
        transition: 'border-color 0.15s, background 0.15s',
      }}
    />
  )
}

function AvatarImg({ userId, name, bg }: { userId: number; name: string; bg: string }) {
  const initials = name ? name.slice(0, 2).toUpperCase() : '?'
  return (
    <div className="mp-modal-hero" style={{ background: bg }}>
      <div style={{ position: 'relative', width: 'clamp(60px,8vh,96px)', height: 'clamp(60px,8vh,96px)' }}>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: 'rgba(255,255,255,0.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: 24, color: 'rgba(255,255,255,.9)',
          border: '3px solid rgba(255,255,255,0.55)',
        }}>
          {initials}
        </div>
        {userId > 1 && (
          <img
            src={`https://www.roblox.com/headshot-thumbnail/image?userId=${userId}&width=150&height=150&format=png`}
            alt={name}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
            onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        )}
      </div>
    </div>
  )
}

// ─── Left panel ───────────────────────────────────────────────────────────────

function LeftPanel({ draft, update }: { draft: ProfileDraft; update: (p: Partial<ProfileDraft>) => void }) {
  const isDev = draft.type === 'dev'

  const robloxUrl = draft.robloxUserId
    ? `https://www.roblox.com/users/${draft.robloxUserId}/profile`
    : ''

  function handleRobloxUrl(raw: string) {
    const match = raw.match(/\/users\/(\d+)/)
    if (match) {
      update({ robloxUserId: parseInt(match[1], 10) })
    } else {
      const num = parseInt(raw.trim(), 10)
      if (!isNaN(num)) update({ robloxUserId: num })
    }
  }

  const links = draft.portfolioLinks
  const socials = draft.socials
  const games = draft.topGames

  return (
    <div className="aux-panel-inner" style={{ padding: '20px 18px' }}>
      <div style={S.field}>
        <span style={S.label}>Roblox Profile URL</span>
        <input
          style={S.input}
          placeholder="roblox.com/users/123456/profile"
          defaultValue={robloxUrl}
          onBlur={e => handleRobloxUrl(e.target.value)}
        />
      </div>

      {isDev ? (
        <>
          <div style={S.field}>
            <span style={S.label}>Experience</span>
            <div style={S.pillRow}>
              {EXP_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  style={draft.experienceYears === opt.value ? S.pillActive : S.pillInactive}
                  onClick={() => update({ experienceYears: opt.value })}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div style={S.field}>
            <span style={S.label}>Rate type</span>
            <div style={S.pillRow}>
              {RATE_TYPES.map(r => (
                <button
                  key={r}
                  type="button"
                  style={draft.rateType === r ? S.pillActive : S.pillInactive}
                  onClick={() => update({ rateType: r })}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div style={S.field}>
            <span style={S.label}>Rate amount (optional)</span>
            <input
              style={S.input}
              placeholder={draft.rateType?.includes('Robux') ? 'e.g. 5,000' : 'e.g. $25'}
              value={draft.rateAmount}
              onChange={e => update({ rateAmount: e.target.value })}
            />
          </div>

          <div style={S.field}>
            <span style={S.label}>Portfolio links</span>
            {links.map((link, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <input
                    style={{ ...S.input, width: '38%', flexShrink: 0 }}
                    placeholder="Label"
                    value={link.name}
                    onChange={e => update({
                      portfolioLinks: links.map((l, idx) => idx === i ? { ...l, name: e.target.value } : l),
                    })}
                  />
                  <input
                    style={{ ...S.input, flex: 1 }}
                    placeholder="URL"
                    value={link.url}
                    onChange={e => update({
                      portfolioLinks: links.map((l, idx) => idx === i ? { ...l, url: e.target.value } : l),
                    })}
                  />
                  <button
                    type="button"
                    className="pb-work-remove"
                    onClick={() => update({ portfolioLinks: links.filter((_, idx) => idx !== i) })}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
            {links.length < 5 && (
              <button
                type="button"
                className="pb-add-btn"
                onClick={() => update({ portfolioLinks: [...links, { name: '', url: '' }] })}
              >
                + Add link
              </button>
            )}
          </div>

          <div style={S.field}>
            <span style={S.label}>Socials</span>
            {socials.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 8 }}>
                <select
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8, color: 'rgba(255,255,255,0.85)',
                    fontSize: 13, padding: '7px 8px', outline: 'none',
                    fontFamily: 'inherit', flexShrink: 0,
                  }}
                  value={s.icon}
                  onChange={e => {
                    const idx = SOCIAL_ICONS.indexOf(e.target.value)
                    update({
                      socials: socials.map((x, j) =>
                        j === i ? { ...x, icon: e.target.value, label: SOCIAL_LABELS[idx] ?? x.label } : x,
                      ),
                    })
                  }}
                >
                  {SOCIAL_ICONS.map((icon, j) => (
                    <option key={icon} value={icon}>{icon} {SOCIAL_LABELS[j]}</option>
                  ))}
                </select>
                <input
                  style={{ ...S.input, flex: 1 }}
                  placeholder="URL"
                  value={s.url}
                  onChange={e => update({
                    socials: socials.map((x, j) => j === i ? { ...x, url: e.target.value } : x),
                  })}
                />
                <button
                  type="button"
                  className="pb-work-remove"
                  onClick={() => update({ socials: socials.filter((_, j) => j !== i) })}
                >
                  ✕
                </button>
              </div>
            ))}
            {socials.length < 4 && (
              <button
                type="button"
                className="pb-add-btn"
                onClick={() => update({ socials: [...socials, { icon: '🌐', label: 'Website', url: '' }] })}
              >
                + Add social
              </button>
            )}
          </div>
        </>
      ) : (
        <>
          <div style={S.field}>
            <span style={S.label}>Team size</span>
            <div style={S.pillRow}>
              {TEAM_SIZES.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  style={draft.teamSize === opt.value ? S.pillActive : S.pillInactive}
                  onClick={() => update({ teamSize: opt.value })}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div style={S.field}>
            <span style={S.label}>Hiring status</span>
            <div style={S.pillRow}>
              {STATUS_OPTIONS.map(s => (
                <button
                  key={s}
                  type="button"
                  style={draft.status === s ? S.pillActive : S.pillInactive}
                  onClick={() => update({ status: s })}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div style={S.field}>
            <span style={S.label}>Budget type</span>
            <div style={S.pillRow}>
              {BUDGET_TYPES.map(b => (
                <button
                  key={b}
                  type="button"
                  style={draft.budgetType === b ? S.pillActive : S.pillInactive}
                  onClick={() => update({ budgetType: b })}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          <div style={S.field}>
            <span style={S.label}>Project value (optional)</span>
            <input
              style={S.input}
              placeholder="e.g. $500 – $2,000"
              value={draft.projectValue}
              onChange={e => update({ projectValue: e.target.value })}
            />
          </div>

          <div style={S.field}>
            <span style={S.label}>Studio details</span>
            <textarea
              style={{ ...S.textarea, minHeight: 90 }}
              placeholder="Describe your studio and what you're working on…"
              value={draft.details}
              rows={4}
              onChange={e => update({ details: e.target.value })}
            />
          </div>
        </>
      )}
    </div>
  )
}

// ─── Center card ──────────────────────────────────────────────────────────────

function CenterCard({ draft, update }: { draft: ProfileDraft; update: (p: Partial<ProfileDraft>) => void }) {
  const isDev = draft.type === 'dev'
  const [showSkillGrid, setShowSkillGrid] = useState(false)

  const preview = draftToProfile(draft, 'preview')

  const skillOptions = isDev ? DEV_SKILLS : STUDIO_SKILLS
  const skillDescs = isDev ? DEV_SKILL_DESCS : STUDIO_SKILL_DESCS
  const selected = draft.selectedSkills
  const selectedNames = new Set(selected.map(s => s.name))

  function toggleSkill(name: string) {
    if (selectedNames.has(name)) {
      update({ selectedSkills: selected.filter(s => s.name !== name) })
    } else if (selected.length < MAX_SKILLS) {
      update({ selectedSkills: [...selected, { name, description: skillDescs[name] ?? '' }] })
    }
  }

  const BADGE_OPTIONS_DEV = ['Verified', 'Pro Developer']

  return (
    <div className="mp-carousel-card pos-center" style={{ overflow: 'hidden auto' }}>
      <AvatarImg userId={draft.robloxUserId ?? 1} name={draft.name} bg={draft.bg} />

      {/* BG color swatches */}
      <div style={{
        display: 'flex', gap: 8, justifyContent: 'center',
        padding: '10px 20px 4px', flexWrap: 'wrap',
      }}>
        {BG.map((bg, i) => (
          <button
            key={i}
            type="button"
            onClick={() => update({ bg })}
            title={`Background ${i + 1}`}
            style={{
              width: 22, height: 22, borderRadius: '50%',
              background: bg,
              border: draft.bg === bg ? '2.5px solid #fff' : '2px solid rgba(255,255,255,0.2)',
              cursor: 'pointer', padding: 0, flexShrink: 0,
              transition: 'border-color 0.12s',
            }}
          />
        ))}
      </div>

      <div className="mp-modal-body">
        {/* Badge */}
        {isDev ? (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
            {BADGE_OPTIONS_DEV.map(b => (
              <button
                key={b}
                type="button"
                style={draft.badge === b ? S.pillActive : S.pillInactive}
                onClick={() => update({ badge: draft.badge === b ? '' : b })}
              >
                {b}
              </button>
            ))}
          </div>
        ) : (
          preview.badge && <div className="mp-modal-badge">{preview.badge}</div>
        )}

        {/* Name */}
        <div className="mp-modal-name">
          <InlineEdit
            value={draft.name}
            onChange={v => update({ name: v })}
            placeholder="Your Name"
          />
        </div>

        {/* Role (computed, read-only) */}
        <div className="mp-modal-role">{preview.role}</div>

        {/* Bio */}
        <div className="mp-modal-bio" style={{ padding: 0 }}>
          <InlineEdit
            value={draft.bio}
            onChange={v => update({ bio: v })}
            placeholder="Write your bio…"
            darkBg
          />
        </div>

        {/* Studio: extended description */}
        {!isDev && (
          <div className="mp-modal-description" style={{ padding: 16 }}>
            <InlineEdit
              value={draft.details}
              onChange={v => update({ details: v })}
              placeholder="Describe your project…"
            />
          </div>
        )}

        {/* Skills */}
        {selected.length > 0 && (
          <>
            <div className="mp-modal-section-title">
              {isDev ? 'Skills' : 'Skills needed'}
            </div>
            <div className="mp-profile-skills">
              {selected.map(s => (
                <div key={s.name} className="mp-profile-skill" style={{ position: 'relative' }}>
                  <div className="mp-skill-label">{s.name}</div>
                  <InlineEdit
                    value={s.description}
                    onChange={desc => update({
                      selectedSkills: selected.map(x => x.name === s.name ? { ...x, description: desc } : x),
                    })}
                    placeholder="Describe this skill…"
                  />
                  <button
                    type="button"
                    onClick={() => update({ selectedSkills: selected.filter(x => x.name !== s.name) })}
                    style={{
                      position: 'absolute', top: 6, right: 6,
                      background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)',
                      cursor: 'pointer', fontSize: 11, padding: 2, lineHeight: 1,
                    }}
                    title="Remove skill"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {selected.length < MAX_SKILLS && (
          <button
            type="button"
            className="pb-add-btn"
            style={{ marginTop: 8 }}
            onClick={() => setShowSkillGrid(g => !g)}
          >
            {showSkillGrid ? '− Hide skills' : '+ Add skill'}
          </button>
        )}

        {showSkillGrid && (
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10,
          }}>
            {skillOptions.map(name => {
              const on = selectedNames.has(name)
              const disabled = !on && selected.length >= MAX_SKILLS
              return (
                <button
                  key={name}
                  type="button"
                  style={on ? S.pillActive : disabled ? { ...S.pillInactive, opacity: 0.4, cursor: 'not-allowed' } : S.pillInactive}
                  onClick={() => !disabled && toggleSkill(name)}
                  disabled={disabled}
                >
                  {name}
                </button>
              )
            })}
          </div>
        )}

        {/* Tags */}
        {preview.tags.length > 0 && (
          <div className="mp-modal-tags">
            {preview.tags.map(tag => (
              <span key={tag} className="mp-modal-tag">{tag}</span>
            ))}
          </div>
        )}

        {/* Meta */}
        {preview.meta && (
          <div className="mp-modal-meta">
            <div className="mp-modal-dot" />
            {preview.meta}
          </div>
        )}

        {/* Dev: portfolio links (display only in center) */}
        {isDev && draft.portfolioLinks.length > 0 && (
          <>
            <div className="mp-modal-divider" />
            <div className="mp-modal-section-title">Portfolio</div>
            <div className="mp-modal-portfolio-links">
              {draft.portfolioLinks.map(link => (
                <div key={link.name} className="mp-modal-portfolio-link">
                  <span className="mp-modal-portfolio-link-name">{link.name || '—'}</span>
                  <span className="mp-modal-portfolio-link-url">{link.url}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Dev: socials (display only in center) */}
        {isDev && draft.socials.length > 0 && (
          <>
            <div className="mp-modal-section-title" style={{ marginTop: 14 }}>Socials</div>
            <div className="mp-modal-socials">
              {draft.socials.map(s => (
                <div key={s.label} className="mp-modal-social-btn">
                  <span className="mp-modal-social-icon">{s.icon}</span>
                  {s.label}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Right panel ──────────────────────────────────────────────────────────────

function EmojiPicker({ value, onChange }: { value: string; onChange: (e: string) => void }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
      {EMOJI_OPTIONS.map(e => (
        <button
          key={e}
          type="button"
          style={value === e ? S.pillActive : S.pillInactive}
          onClick={() => onChange(e)}
        >
          {e}
        </button>
      ))}
    </div>
  )
}

function WorkEntryEdit({
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
    <div style={{
      background: 'rgba(255,255,255,0.03)', borderRadius: 10,
      border: '1px solid rgba(255,255,255,0.07)', padding: '14px 14px 10px', marginBottom: 14,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ ...S.label, marginBottom: 0 }}>Project {index + 1}</span>
        <button type="button" className="pb-work-remove" onClick={onRemove}>Remove</button>
      </div>
      <EmojiPicker value={work.emoji} onChange={e => onChange({ ...work, emoji: e })} />
      <input
        style={{ ...S.input, marginBottom: 8 }}
        placeholder="Project title"
        value={work.title}
        onChange={e => onChange({ ...work, title: e.target.value })}
      />
      <textarea
        style={{ ...S.textarea, marginBottom: 8 }}
        placeholder="Short description"
        rows={2}
        value={work.desc}
        onChange={e => onChange({ ...work, desc: e.target.value })}
      />
      <input
        style={{ ...S.input, marginBottom: 8 }}
        placeholder="Tools used (e.g. Luau, Blender)"
        value={work.tools}
        onChange={e => onChange({ ...work, tools: e.target.value })}
      />
      <div style={{ display: 'flex', gap: 6 }}>
        <input
          style={{ ...S.input, flex: 1 }}
          placeholder="Time (e.g. 2 weeks)"
          value={work.time}
          onChange={e => onChange({ ...work, time: e.target.value })}
        />
        <input
          style={{ ...S.input, flex: 1 }}
          placeholder="Value (e.g. 5000)"
          value={work.amount}
          onChange={e => onChange({ ...work, amount: e.target.value })}
        />
        <input
          style={{ ...S.input, flex: 1 }}
          placeholder="Plays (e.g. 14M)"
          value={work.plays}
          onChange={e => onChange({ ...work, plays: e.target.value })}
        />
      </div>
    </div>
  )
}

function GameEntryEdit({
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
    <div style={{
      background: 'rgba(255,255,255,0.03)', borderRadius: 10,
      border: '1px solid rgba(255,255,255,0.07)', padding: '14px 14px 10px', marginBottom: 14,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ ...S.label, marginBottom: 0 }}>Game {index + 1}</span>
        <button type="button" className="pb-work-remove" onClick={onRemove}>Remove</button>
      </div>
      <EmojiPicker value={game.emoji} onChange={e => onChange({ ...game, emoji: e })} />
      <input
        style={{ ...S.input, marginBottom: 8 }}
        placeholder="Game title"
        value={game.title}
        onChange={e => onChange({ ...game, title: e.target.value })}
      />
      <textarea
        style={{ ...S.textarea, marginBottom: 8 }}
        placeholder="Short description"
        rows={2}
        value={game.desc}
        onChange={e => onChange({ ...game, desc: e.target.value })}
      />
      <div style={{ display: 'flex', gap: 6 }}>
        <input
          style={{ ...S.input, flex: 1 }}
          placeholder="Total plays (e.g. 500M)"
          value={game.plays}
          onChange={e => onChange({ ...game, plays: e.target.value })}
        />
        <input
          style={{ ...S.input, flex: 1 }}
          placeholder="Peak CCU (e.g. 12000)"
          value={game.topCcu}
          onChange={e => onChange({ ...game, topCcu: e.target.value })}
        />
        <input
          style={{ ...S.input, flex: 1 }}
          placeholder="Current CCU (e.g. 3200)"
          value={game.currentCcu}
          onChange={e => onChange({ ...game, currentCcu: e.target.value })}
        />
      </div>
    </div>
  )
}

function RightPanel({ draft, update }: { draft: ProfileDraft; update: (p: Partial<ProfileDraft>) => void }) {
  const isDev = draft.type === 'dev'

  if (isDev) {
    const works = draft.bestWork
    return (
      <div className="aux-panel-inner" style={{ padding: '20px 18px' }}>
        <div className="aux-panel-top">
          <span className="aux-panel-eyebrow">Best Work</span>
          <div className="aux-panel-title">Your past projects</div>
          <div className="aux-panel-sub">Add up to 3 projects to show studios what you can do.</div>
        </div>
        <div className="aux-panel-body">
          {works.map((w, i) => (
            <WorkEntryEdit
              key={i}
              work={w}
              index={i}
              onChange={w2 => {
                const next = [...works]; next[i] = w2; update({ bestWork: next })
              }}
              onRemove={() => update({ bestWork: works.filter((_, idx) => idx !== i) })}
            />
          ))}
          {works.length < 3 && (
            <button
              type="button"
              className="pb-add-btn"
              onClick={() => update({ bestWork: [...works, emptyWork()] })}
            >
              + Add project
            </button>
          )}
        </div>
      </div>
    )
  }

  const games = draft.topGames
  return (
    <div className="aux-panel-inner" style={{ padding: '20px 18px' }}>
      <div className="aux-panel-top">
        <span className="aux-panel-eyebrow">Top Games</span>
        <div className="aux-panel-title">Your published titles</div>
        <div className="aux-panel-sub">Add up to 3 games with play and CCU stats.</div>
      </div>
      <div className="aux-panel-body">
        {games.map((g, i) => (
          <GameEntryEdit
            key={i}
            game={g}
            index={i}
            onChange={g2 => {
              const next = [...games]; next[i] = g2; update({ topGames: next })
            }}
            onRemove={() => update({ topGames: games.filter((_, idx) => idx !== i) })}
          />
        ))}
        {games.length < 3 && (
          <button
            type="button"
            className="pb-add-btn"
            onClick={() => update({ topGames: [...games, emptyGame()] })}
          >
            + Add game
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

interface Props {
  token: string
  initialDraft?: ProfileDraft | null
  initialProfile?: PreviewProfile | null
  onSaved: (profile: PreviewProfile, draft: ProfileDraft) => void
  onClose: () => void
}

export default function EditProfileModal({ token, initialDraft, initialProfile, onSaved, onClose }: Props) {
  const [draft, setDraft] = useState<ProfileDraft>(() => (
    initialDraft ?? (initialProfile ? profileToDraft(initialProfile) : loadLocalDraft())
  ))
  const [saving, setSaving] = useState(false)
  const hasFetched = useRef(false)

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  // Prefer the account draft, then fall back to the published profile.
  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true
    ;(async () => {
      try {
        const res = await fetch('/api/account/profile', {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store',
        })
        if (res.ok) {
          const json = await res.json()
          if (json.profile?.draft) {
            setDraft(prev => ({ ...prev, ...json.profile.draft }))
          } else if (json.profile?.publishedProfile) {
            setDraft(profileToDraft(json.profile.publishedProfile as PreviewProfile))
          }
        }
      } catch {}
    })()
  }, [token])

  function update(patch: Partial<ProfileDraft>) {
    setDraft(prev => ({ ...prev, ...patch }))
  }

  async function handleSave() {
    setSaving(true)
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
      const newProfile = draftToProfile(draft, 'published')
      const res = await fetch('/api/account/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ draft, publishedProfile: newProfile }),
      })
      if (res.ok) onSaved(newProfile, draft)
    } catch {} finally {
      setSaving(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: 'radial-gradient(circle at 50% 16%,rgba(224,58,30,.22),transparent 30%),rgba(6,5,4,.92)',
        backdropFilter: 'blur(20px) saturate(1.05)',
        overflow: 'hidden',
      }}
    >
      {/* Header bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 350,
        padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(6,5,4,0.9)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 11,
          letterSpacing: '0.13em', textTransform: 'uppercase',
          color: 'rgba(255,245,240,0.5)',
        }}>
          Editing your profile
        </span>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none', border: '1.5px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.5)', borderRadius: 8,
              padding: '6px 14px', cursor: 'pointer',
              fontFamily: 'var(--font-mono)', fontSize: 11,
              letterSpacing: '0.1em', textTransform: 'uppercase',
            }}
          >
            ✕ Close
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            style={{
              background: saving ? 'rgba(232,70,36,0.4)' : '#E84624',
              border: 'none', color: '#fff', borderRadius: 8,
              padding: '6px 18px', cursor: saving ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-mono)', fontSize: 11,
              letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600,
            }}
          >
            {saving ? 'Saving…' : 'Save & publish'}
          </button>
        </div>
      </div>

      {/* 3-card layout */}
      <div
        className="mp-modal-row"
        style={{ paddingTop: 64, height: '100vh', boxSizing: 'border-box', alignItems: 'stretch' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Left panel */}
        <div className="mp-carousel-card pos-left" style={{ overflow: 'hidden auto' }}>
          <LeftPanel draft={draft} update={update} />
        </div>

        {/* Center card */}
        <CenterCard draft={draft} update={update} />

        {/* Right panel */}
        <div className="mp-carousel-card pos-right" style={{ overflow: 'hidden auto' }}>
          <RightPanel draft={draft} update={update} />
        </div>
      </div>
    </div>
  )
}
