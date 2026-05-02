'use client'

import { useState } from 'react'
import { ProfileDraft } from '../profile-types'

interface Props {
  draft: ProfileDraft
  update: (patch: Partial<ProfileDraft>) => void
  onNext: () => void
  onBack: () => void
}

const SOCIAL_OPTIONS = [
  { icon: '🐦', label: 'Twitter / X', domains: ['twitter.com', 'x.com'] },
  { icon: '📺', label: 'YouTube', domains: ['youtube.com', 'youtu.be'] },
  { icon: '📸', label: 'Instagram', domains: ['instagram.com'] },
  { icon: '💬', label: 'Discord', domains: ['discord.com', 'discordapp.com', 'discord.gg'] },
  { icon: '🌐', label: 'Website', domains: [] },
  { icon: '📧', label: 'Email', domains: [] },
]
const SOCIAL_ICONS = SOCIAL_OPTIONS.map(s => s.icon)
const SOCIAL_LABELS = SOCIAL_OPTIONS.map(s => s.label)

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
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())
}

function isDiscordLink(raw: string): boolean {
  const val = raw.trim()
  if (!val) return false
  if (/^@[^\s]{2,32}$/.test(val)) return true
  const url = /^https?:\/\//i.test(val) ? val : `https://${val}`
  try {
    const hostname = new URL(url).hostname.toLowerCase()
    return ['discord.com', 'discordapp.com', 'discord.gg'].some(domain => hostname === domain || hostname.endsWith(`.${domain}`))
  } catch {
    return false
  }
}

function detectSocialType(raw: string): { icon: string; label: string } | null {
  const val = raw.trim()
  if (!val) return null
  if (isValidEmail(val)) return { icon: '📧', label: 'Email' }
  if (isDiscordLink(val)) return { icon: '💬', label: 'Discord' }

  const url = /^https?:\/\//i.test(val) ? val : `https://${val}`
  try {
    const hostname = new URL(url).hostname.toLowerCase()
    if (hostname.includes('twitter.com') || hostname === 'x.com' || hostname.endsWith('.x.com')) {
      return { icon: '🐦', label: 'Twitter / X' }
    }
    if (hostname.includes('youtube.com') || hostname === 'youtu.be') {
      return { icon: '📺', label: 'YouTube' }
    }
    if (hostname.includes('instagram.com')) {
      return { icon: '📸', label: 'Instagram' }
    }
    if (hostname.includes('discord.com') || hostname.includes('discordapp.com') || hostname.includes('discord.gg')) {
      return { icon: '💬', label: 'Discord' }
    }
    if (hostname.includes('.')) {
      return { icon: '🌐', label: 'Website' }
    }
  } catch {
    // ignore parse failures
  }

  return null
}

function socialMatchesIcon(icon: string, raw: string): boolean {
  const val = raw.trim()
  if (!val) return true
  if (icon === '📧') return isValidEmail(val)
  if (icon === '💬') return isDiscordLink(val)
  if (icon === '🐦') {
    const detected = detectSocialType(val)
    return detected?.icon === '🐦'
  }
  if (icon === '📺') {
    const detected = detectSocialType(val)
    return detected?.icon === '📺'
  }
  if (icon === '📸') {
    const detected = detectSocialType(val)
    return detected?.icon === '📸'
  }
  if (icon === '🌐') return isValidUrl(val)
  return true
}

function validateSocial(icon: string, url: string): boolean {
  if (!url.trim()) return true
  return socialMatchesIcon(icon, url)
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

  const getSocialOptionByIcon = (icon: string) => SOCIAL_OPTIONS.find(option => option.icon === icon)

  const handleLinkUrlBlur = (i: number, url: string) => {
    if (!isValidUrl(url)) {
      setLinkErrors(prev => ({ ...prev, [i]: 'Enter a valid link (e.g. github.com/you)' }))
    }
  }

  const handleSocialUrlBlur = (i: number, icon: string, url: string) => {
    const trimmedUrl = url.trim()
    if (!trimmedUrl) return

    const detected = detectSocialType(trimmedUrl)
    if (detected && icon === '🌐' && detected.icon !== '🌐') {
      updateSocial(i, { icon: detected.icon, label: detected.label })
      return
    }

    if (!validateSocial(icon, trimmedUrl)) {
      const detectedLabel = detected?.label
      const defaultMsg = icon === '📧'
        ? 'Enter a valid email address'
        : icon === '💬'
          ? 'Enter a valid Discord URL or handle'
          : `Enter a valid ${getSocialOptionByIcon(icon)?.label ?? 'link'}`

      const mismatchMsg = detectedLabel && detectedLabel !== getSocialOptionByIcon(icon)?.label
        ? `This looks like a ${detectedLabel} link. Change the channel or enter a ${getSocialOptionByIcon(icon)?.label ?? 'correct'} link.`
        : defaultMsg

      setSocialErrors(prev => ({ ...prev, [i]: mismatchMsg }))
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
