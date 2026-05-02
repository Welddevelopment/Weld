'use client'

import { ProfileDraft } from '../profile-types'

interface Props {
  draft: ProfileDraft
  update: (patch: Partial<ProfileDraft>) => void
  onNext: () => void
  onBack: () => void
}

const STATUS_OPTIONS = ['Available Now', 'Open to Offers', 'Not Available']
const HOUR_OPTIONS = ['Under 10', '10-20 hrs', '20-40 hrs', 'Full-time']

export default function AvailabilityStep({ draft, update, onNext, onBack }: Props) {
  const status = draft.availabilityStatus || 'Available Now'

  return (
    <div className="ob-screen">
      <aside className="ob-side">
        <div className="ob-brand">
          <span className="ob-mark">*</span>
          <span>weld.</span>
        </div>
        <h1 className="ob-title">your<br />availability</h1>
        <p className="ob-copy">Studios filter by availability status. You can update this anytime from your profile.</p>

        <div className="ob-status-badge">
          <span />
          {status}
        </div>
      </aside>

      <section className="ob-main">
        <div className="ob-progress"><span style={{ width: `${(2 / 6) * 100}%` }} /></div>
        <div className="ob-step-row">
          <span>Step 2 of 6 - Availability</span>
          <span>2/6</span>
        </div>

        <div className="pb-field">
          <label className="pb-label">Work status <span className="pb-required">*</span></label>
          <div className="ob-pill-row">
            {STATUS_OPTIONS.map(option => (
              <button
                key={option}
                type="button"
                className={`ob-pill${status === option ? ' ob-pill--on' : ''}`}
                onClick={() => update({ availabilityStatus: option })}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="ob-two-col">
          <div className="pb-field">
            <label className="pb-label">Hours / week <span className="pb-hint-label">(optional)</span></label>
            <div className="ob-pill-row">
              {HOUR_OPTIONS.map(option => (
                <button
                  key={option}
                  type="button"
                  className={`ob-pill${draft.availabilityHours === option ? ' ob-pill--on' : ''}`}
                  onClick={() => update({ availabilityHours: draft.availabilityHours === option ? '' : option })}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="pb-field">
            <label className="pb-label">Timezone <span className="pb-hint-label">(optional)</span></label>
            <input
              className="pb-input"
              value={draft.availabilityTimezone}
              onChange={e => update({ availabilityTimezone: e.target.value })}
              placeholder="e.g. EST (UTC-5)"
            />
          </div>
        </div>

        <div className="pb-field">
          <label className="pb-label">Note <span className="pb-hint-label">(optional)</span></label>
          <input
            className="pb-input"
            value={draft.availabilityNote}
            onChange={e => update({ availabilityNote: e.target.value })}
            placeholder="e.g. Available for short projects, 2 week turnaround"
            maxLength={120}
          />
        </div>

        <div className="pb-nav">
          <button className="pb-btn pb-btn--ghost" type="button" onClick={onBack}>Back</button>
          <button className="pb-btn pb-btn--primary" type="button" onClick={onNext}>
            Next: Role & Rate
          </button>
        </div>
      </section>
    </div>
  )
}
