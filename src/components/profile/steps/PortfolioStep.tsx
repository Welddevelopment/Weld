'use client'

import { useState } from 'react'
import { ProfileDraft } from '../profile-types'

interface Props {
  draft: ProfileDraft
  update: (patch: Partial<ProfileDraft>) => void
  onNext: () => void
  onBack: () => void
}

const SOCIAL_ICONS = ['🐦', '📺', '📸', '💬', '🌐', '📧']
const SOCIAL_LABELS = ['Twitter / X', 'YouTube', 'Instagram', 'Discord', 'Website', 'Email']

function isValidUrl(raw: string): boolean {
  const val = raw.trim()
  if (!val) return true
  const withScheme = /^https?:\/\//i.test(val) ? val : `https://${val}`
  try {
    return new URL(withScheme).hostname.includes('.')
  } catch {
    return false
  }
}

function isValidEmail(val: string): boolean {
  return !val.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())
}

function validateSocial(icon: string, url: string): boolean {
  if (!url.trim()) return true
  if (icon === '📧') return isValidEmail(url)
  if (icon === '💬') return true // Discord handles are acceptable
  return isValidUrl(url)
}

function socialPlaceholder(icon: string): string {
  if (icon === '📧') return 'your@email.com'
  if (icon === '💬') return 'discord.gg/... or @handle'
  return 'URL (e.g. twitter.com/you)'
}

function reindex(errors: Record<number, string>, removed: number): Record<number, string> {
  const next: Record<number, string> = {}
  for (const [k, v] of Object.entries(errors)) {
    const i = Number(k)
    if (i < removed) next[i] = v
    else if (i > removed) next[i - 1] = v
  }
  return next
}

export default function PortfolioStep({ draft, update, onNext, onBack }: Props) {
  const links = draft.portfolioLinks
  const socials = draft.socials
  const [linkErrors, setLinkErrors] = useState<Record<number, string>>({})
  const [socialErrors, setSocialErrors] = useState<Record<number, string>>({})

  const clearLinkError = (i: number) =>
    setLinkErrors(prev => { const n = { ...prev }; delete n[i]; return n })
  const clearSocialError = (i: number) =>
    setSocialErrors(prev => { const n = { ...prev }; delete n[i]; return n })

  const addLink = () => update({ portfolioLinks: [...links, { name: '', url: '' }] })
  const updateLink = (i: number, patch: { name?: string; url?: string }) => {
    update({ portfolioLinks: links.map((l, idx) => idx === i ? { ...l, ...patch } : l) })
    if (patch.url !== undefined) clearLinkError(i)
  }
  const removeLink = (i: number) => {
    update({ portfolioLinks: links.filter((_, idx) => idx !== i) })
    setLinkErrors(prev => reindex(prev, i))
  }

  const addSocial = () => update({ socials: [...socials, { icon: '🌐', label: '', url: '' }] })
  const updateSocial = (i: number, patch: Partial<typeof socials[number]>) => {
    update({ socials: socials.map((s, idx) => idx === i ? { ...s, ...patch } : s) })
    if (patch.url !== undefined || patch.icon !== undefined) clearSocialError(i)
  }
  const removeSocial = (i: number) => {
    update({ socials: socials.filter((_, idx) => idx !== i) })
    setSocialErrors(prev => reindex(prev, i))
  }

  const handleLinkUrlBlur = (i: number, url: string) => {
    if (!isValidUrl(url)) {
      setLinkErrors(prev => ({ ...prev, [i]: 'Enter a valid link (e.g. github.com/you)' }))
    }
  }

  const handleSocialUrlBlur = (i: number, icon: string, url: string) => {
    if (!validateSocial(icon, url)) {
      const msg = icon === '📧' ? 'Enter a valid email address' : 'Enter a valid link'
      setSocialErrors(prev => ({ ...prev, [i]: msg }))
    }
  }

  const hasErrors = Object.keys(linkErrors).length > 0 || Object.keys(socialErrors).length > 0

  return (
    <div className="pb-step-content">
      <div className="pb-step-eyebrow">Step 6</div>
      <h1 className="pb-step-title">Portfolio &amp; socials</h1>
      <p className="pb-step-sub">Add links to work you want studios to see, and any social channels. All optional.</p>

      <div className="pb-field">
        <label className="pb-label">Portfolio links</label>
        {links.map((link, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <div className="pb-link-row">
              <input
                className="pb-input pb-input--sm"
                placeholder="Label (e.g. GitHub)"
                value={link.name}
                onChange={e => updateLink(i, { name: e.target.value })}
              />
              <input
                className={`pb-input${linkErrors[i] ? ' pb-input--error' : ''}`}
                placeholder="URL (e.g. github.com/you)"
                value={link.url}
                onChange={e => updateLink(i, { url: e.target.value })}
                onBlur={() => handleLinkUrlBlur(i, link.url)}
              />
              <button type="button" className="pb-work-remove" onClick={() => removeLink(i)}>✕</button>
            </div>
            {linkErrors[i] && <p className="pb-field-error" style={{ marginTop: 4 }}>{linkErrors[i]}</p>}
          </div>
        ))}
        {links.length < 5 && (
          <button type="button" className="pb-add-btn" onClick={addLink}>+ Add link</button>
        )}
      </div>

      <div className="pb-field">
        <label className="pb-label">Social channels</label>
        {socials.map((s, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <div className="pb-social-row">
              <select
                className="pb-select"
                value={s.icon}
                onChange={e => {
                  const idx = SOCIAL_ICONS.indexOf(e.target.value)
                  updateSocial(i, { icon: e.target.value, label: SOCIAL_LABELS[idx] ?? s.label })
                }}
              >
                {SOCIAL_ICONS.map((icon, j) => (
                  <option key={icon} value={icon}>{icon} {SOCIAL_LABELS[j]}</option>
                ))}
              </select>
              <input
                className={`pb-input${socialErrors[i] ? ' pb-input--error' : ''}`}
                placeholder={socialPlaceholder(s.icon)}
                value={s.url}
                onChange={e => updateSocial(i, { url: e.target.value })}
                onBlur={() => handleSocialUrlBlur(i, s.icon, s.url)}
              />
              <button type="button" className="pb-work-remove" onClick={() => removeSocial(i)}>✕</button>
            </div>
            {socialErrors[i] && <p className="pb-field-error" style={{ marginTop: 4 }}>{socialErrors[i]}</p>}
          </div>
        ))}
        {socials.length < 4 && (
          <button type="button" className="pb-add-btn" onClick={addSocial}>+ Add social</button>
        )}
      </div>

      <div className="pb-nav">
        <button className="pb-btn pb-btn--ghost" type="button" onClick={onBack}>Back</button>
        <button className="pb-btn pb-btn--primary" type="button" onClick={onNext} disabled={hasErrors}>Next</button>
      </div>
    </div>
  )
}
