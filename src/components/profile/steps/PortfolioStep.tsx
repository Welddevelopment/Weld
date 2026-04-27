'use client'

import { ProfileDraft } from '../profile-types'

interface Props {
  draft: ProfileDraft
  update: (patch: Partial<ProfileDraft>) => void
  onNext: () => void
  onBack: () => void
}

const SOCIAL_ICONS = ['🐦', '📺', '📸', '💬', '🌐', '📧']
const SOCIAL_LABELS = ['Twitter / X', 'YouTube', 'Instagram', 'Discord', 'Website', 'Email']

export default function PortfolioStep({ draft, update, onNext, onBack }: Props) {
  const links = draft.portfolioLinks
  const socials = draft.socials

  const addLink = () => update({ portfolioLinks: [...links, { name: '', url: '' }] })
  const updateLink = (i: number, patch: { name?: string; url?: string }) => {
    const next = links.map((l, idx) => idx === i ? { ...l, ...patch } : l)
    update({ portfolioLinks: next })
  }
  const removeLink = (i: number) => update({ portfolioLinks: links.filter((_, idx) => idx !== i) })

  const addSocial = () => update({ socials: [...socials, { icon: '🌐', label: '', url: '' }] })
  const updateSocial = (i: number, patch: Partial<typeof socials[number]>) => {
    const next = socials.map((s, idx) => idx === i ? { ...s, ...patch } : s)
    update({ socials: next })
  }
  const removeSocial = (i: number) => update({ socials: socials.filter((_, idx) => idx !== i) })

  return (
    <div className="pb-step-content">
      <div className="pb-step-eyebrow">Step 7</div>
      <h1 className="pb-step-title">Portfolio & socials</h1>
      <p className="pb-step-sub">Add links to work you want studios to see, and any social channels. All optional.</p>

      <div className="pb-field">
        <label className="pb-label">Portfolio links</label>
        {links.map((link, i) => (
          <div key={i} className="pb-link-row">
            <input
              className="pb-input pb-input--sm"
              placeholder="Label (e.g. GitHub)"
              value={link.name}
              onChange={e => updateLink(i, { name: e.target.value })}
            />
            <input
              className="pb-input"
              placeholder="URL (e.g. github.com/you)"
              value={link.url}
              onChange={e => updateLink(i, { url: e.target.value })}
            />
            <button type="button" className="pb-work-remove" onClick={() => removeLink(i)}>✕</button>
          </div>
        ))}
        {links.length < 5 && (
          <button type="button" className="pb-add-btn" onClick={addLink}>+ Add link</button>
        )}
      </div>

      <div className="pb-field">
        <label className="pb-label">Social channels</label>
        {socials.map((s, i) => (
          <div key={i} className="pb-social-row">
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
              className="pb-input"
              placeholder="URL or handle"
              value={s.url}
              onChange={e => updateSocial(i, { url: e.target.value })}
            />
            <button type="button" className="pb-work-remove" onClick={() => removeSocial(i)}>✕</button>
          </div>
        ))}
        {socials.length < 4 && (
          <button type="button" className="pb-add-btn" onClick={addSocial}>+ Add social</button>
        )}
      </div>

      <div className="pb-nav">
        <button className="pb-btn pb-btn--ghost" type="button" onClick={onBack}>Back</button>
        <button className="pb-btn pb-btn--primary" type="button" onClick={onNext}>Next</button>
      </div>
    </div>
  )
}
