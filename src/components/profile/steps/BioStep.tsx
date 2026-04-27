'use client'

import { ProfileDraft } from '../profile-types'

interface Props {
  draft: ProfileDraft
  update: (patch: Partial<ProfileDraft>) => void
  onNext: () => void
  onBack: () => void
}

const DEV_BIO_HINTS = [
  'What kind of games do you love making?',
  'What\'s your biggest strength as a creator?',
  'What does your ideal collab look like?',
]

const STUDIO_BIO_HINTS = [
  'What kind of games do you make?',
  'What makes your studio different?',
  'What does your ideal hire look like?',
]

const DEV_DETAILS_PLACEHOLDER = 'Write a short bio. Tip: mention your specialty, your favourite genre, and what you\'re looking for. Studios skim these — make the first line count.'
const STUDIO_DETAILS_PLACEHOLDER = 'Describe your studio. What games do you make, what stage are you at, and what kind of developer are you looking to bring on?'

const BIO_MAX = 280
const DETAILS_MAX = 500

export default function BioStep({ draft, update, onNext, onBack }: Props) {
  const isDev = draft.type === 'dev'
  const hints = isDev ? DEV_BIO_HINTS : STUDIO_BIO_HINTS

  return (
    <div className="pb-step-content">
      <div className="pb-step-eyebrow">Step 4</div>
      <h1 className="pb-step-title">Tell your story</h1>
      <p className="pb-step-sub">
        {isDev
          ? 'Your bio is the first thing studios read. Keep it sharp.'
          : 'Your description is what developers use to decide if you\'re worth their time.'}
      </p>

      <div className="pb-field">
        <label className="pb-label">Bio <span className="pb-required">*</span></label>
        <div className="pb-hints">
          {hints.map(h => <span key={h} className="pb-hint-chip">{h}</span>)}
        </div>
        <textarea
          className="pb-textarea"
          value={draft.bio}
          onChange={e => update({ bio: e.target.value.slice(0, BIO_MAX) })}
          placeholder={DEV_DETAILS_PLACEHOLDER}
          rows={4}
        />
        <div className="pb-char-count">{draft.bio.length} / {BIO_MAX}</div>
      </div>

      {!isDev && (
        <div className="pb-field">
          <label className="pb-label">Extended description <span className="pb-hint-label">(optional)</span></label>
          <textarea
            className="pb-textarea"
            value={draft.details}
            onChange={e => update({ details: e.target.value.slice(0, DETAILS_MAX) })}
            placeholder={STUDIO_DETAILS_PLACEHOLDER}
            rows={5}
          />
          <div className="pb-char-count">{draft.details.length} / {DETAILS_MAX}</div>
        </div>
      )}

      <div className="pb-nav">
        <button className="pb-btn pb-btn--ghost" type="button" onClick={onBack}>Back</button>
        <button
          className="pb-btn pb-btn--primary"
          type="button"
          onClick={onNext}
          disabled={!draft.bio.trim()}
        >
          Next
        </button>
      </div>
    </div>
  )
}
