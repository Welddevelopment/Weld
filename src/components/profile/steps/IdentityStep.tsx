'use client'

import { useState } from 'react'
import { ProfileDraft } from '../profile-types'
import { BG } from '../../matching-preview/preview-data'

interface Props {
  draft: ProfileDraft
  update: (patch: Partial<ProfileDraft>) => void
  onNext: () => void
  onBack: () => void
}

const CREATOR_LEVELS = ['Verified', 'Pro Developer']

export default function IdentityStep({ draft, update, onNext, onBack }: Props) {
  const [urlInput, setUrlInput] = useState(
    draft.robloxUserId ? `https://www.roblox.com/users/${draft.robloxUserId}/profile` : ''
  )
  const [urlError, setUrlError] = useState('')
  const isDev = draft.type === 'dev'

  const parseUserId = (val: string): number | null => {
    const match = val.match(/\/users\/(\d+)/)
    if (match) return Number(match[1])
    if (/^\d+$/.test(val.trim())) return Number(val.trim())
    return null
  }

  const handleUrlBlur = () => {
    const id = parseUserId(urlInput)
    if (urlInput && !id) {
      setUrlError('Paste your full Roblox profile URL or just your numeric user ID.')
    } else {
      setUrlError('')
      update({ robloxUserId: id })
    }
  }

  const canAdvance = Boolean(draft.name.trim()) && (!isDev || Boolean(draft.badge))

  return (
    <div className="pb-step-content">
      <div className="pb-step-eyebrow">Step 1</div>
      <h1 className="pb-step-title">Your identity</h1>
      <p className="pb-step-sub">How you&apos;ll appear to everyone on Weld.</p>

      <div className="pb-field">
        <label className="pb-label">Display name <span className="pb-required">*</span></label>
        <input
          className="pb-input"
          type="text"
          value={draft.name}
          onChange={e => update({ name: e.target.value })}
          placeholder="e.g. xXBuilder99"
          maxLength={40}
        />
      </div>

      <div className="pb-field">
        <label className="pb-label">Roblox profile URL <span className="pb-hint-label">(optional - shows your avatar)</span></label>
        <input
          className={`pb-input${urlError ? ' pb-input--error' : ''}`}
          type="text"
          value={urlInput}
          onChange={e => { setUrlInput(e.target.value); setUrlError('') }}
          onBlur={handleUrlBlur}
          placeholder="https://www.roblox.com/users/12345/profile"
        />
        {urlError && <span className="pb-field-error">{urlError}</span>}
      </div>

      <div className="pb-field">
        <label className="pb-label">Profile colour</label>
        <div className="pb-bg-swatches">
          {BG.map(g => (
            <button
              key={g}
              type="button"
              className={`pb-swatch${draft.bg === g ? ' pb-swatch--active' : ''}`}
              style={{ background: g }}
              onClick={() => update({ bg: g })}
              aria-label="Select colour"
            />
          ))}
        </div>
      </div>

      {isDev && (
        <div className="pb-field">
          <label className="pb-label">Creator level <span className="pb-required">*</span></label>
          <div className="pb-badge-options">
            {CREATOR_LEVELS.map(level => (
              <button
                key={level}
                type="button"
                className={`pb-badge-opt${draft.badge === level ? ' pb-badge-opt--active' : ''}`}
                onClick={() => update({ badge: level })}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="pb-nav">
        <button className="pb-btn pb-btn--ghost" type="button" onClick={onBack}>Back</button>
        <button className="pb-btn pb-btn--primary" type="button" onClick={onNext} disabled={!canAdvance}>
          Next
        </button>
      </div>
    </div>
  )
}
