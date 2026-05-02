'use client'

import { useState } from 'react'
import { ProfileDraft } from '../profile-types'

interface Props {
  draft: ProfileDraft
  update: (patch: Partial<ProfileDraft>) => void
  onNext: () => void
  onBack: () => void
}

function parseUserId(value: string): number | null {
  const match = value.match(/\/users\/(\d+)/)
  if (match) return Number(match[1])
  if (/^\d+$/.test(value.trim())) return Number(value.trim())
  return null
}

export default function IdentityStep({ draft, update, onNext, onBack }: Props) {
  const [urlInput, setUrlInput] = useState(
    draft.robloxUserId ? `https://www.roblox.com/users/${draft.robloxUserId}/profile` : ''
  )
  const [urlError, setUrlError] = useState('')

  const handleUrlBlur = () => {
    const id = parseUserId(urlInput)
    if (urlInput.trim() && !id) {
      setUrlError('Paste your full Roblox profile URL or numeric user ID.')
      return
    }
    setUrlError('')
    update({ robloxUserId: id })
  }

  const handleNext = () => {
    const id = parseUserId(urlInput)
    if (urlInput.trim() && !id) {
      setUrlError('Paste your full Roblox profile URL or numeric user ID.')
      return
    }
    update({ robloxUserId: id })
    onNext()
  }

  return (
    <div className="ob-screen">
      <aside className="ob-side ob-side--dark">
        <div className="ob-brand ob-brand--light">
          <span className="ob-mark">*</span>
          <span>weld.</span>
        </div>
        <h1 className="ob-title ob-title--light">link your<br />roblox</h1>
        <p className="ob-copy ob-copy--light">
          Pulls in your avatar and username. Studios trust verified Roblox accounts far more.
        </p>

        <div className="ob-note-card">
          <strong>Why Roblox?</strong>
          <span>Your Roblox profile is proof you&apos;re real. It lets us show your avatar on your card.</span>
        </div>
      </aside>

      <section className="ob-main">
        <div className="ob-progress"><span style={{ width: `${100 / 6}%` }} /></div>
        <div className="ob-step-row">
          <span>Step 1 of 6 - Link Roblox</span>
          <span>1/6</span>
        </div>

        <div className="ob-social-item ob-social-item--linked">
          <div className="ob-social-icon ob-social-icon--roblox">R</div>
          <div className="ob-social-info">
            <div className="ob-social-name">Roblox</div>
            <div className="ob-social-handle">
              {draft.robloxUserId ? `ID: ${draft.robloxUserId}` : 'Paste your profile URL below'}
            </div>
          </div>
          {draft.robloxUserId && <div className="ob-social-badge">Linked</div>}
        </div>

        <div className="ob-divider">or paste your profile URL instead</div>

        <div className="pb-field">
          <label className="pb-label">Roblox profile URL <span className="pb-hint-label">(or numeric user ID)</span></label>
          <input
            className={`pb-input${urlError ? ' pb-input--error' : ''}`}
            value={urlInput}
            onChange={e => { setUrlInput(e.target.value); setUrlError('') }}
            onBlur={handleUrlBlur}
            placeholder="https://www.roblox.com/users/12345/profile"
          />
          {urlError && <span className="pb-field-error">{urlError}</span>}
        </div>

        <div className="ob-linked-preview">
          <div className="ob-linked-avatar">avatar</div>
          <div>
            <div className="ob-linked-name">{draft.name || 'Your Roblox name'}</div>
            <div className="ob-linked-sub">
              Roblox creator{draft.robloxUserId ? ` · ID: ${draft.robloxUserId}` : ''}
            </div>
            <div className="ob-linked-status">
              <span />
              Available for work
            </div>
          </div>
        </div>

        <div className="pb-nav">
          <button className="pb-btn pb-btn--ghost" type="button" onClick={onBack}>Back</button>
          <button className="pb-btn pb-btn--primary" type="button" onClick={handleNext}>
            Next: Availability
          </button>
        </div>
      </section>
    </div>
  )
}
