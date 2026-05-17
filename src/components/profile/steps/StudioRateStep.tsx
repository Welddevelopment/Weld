'use client'

import { ProfileDraft } from '../profile-types'

interface Props {
  draft: ProfileDraft
  update: (patch: Partial<ProfileDraft>) => void
  onNext: () => void
  onBack: () => void
}

const RATE_TYPES = ['Hourly (USD)', 'Hourly (Robux)', 'Per Project', 'Revenue Share', 'Negotiable']

function rateRangeLabel(rateType: string | null | undefined): string {
  switch (rateType) {
    case 'Hourly (USD)':   return '(optional, USD/hr)'
    case 'Hourly (Robux)': return '(optional, R$/hr)'
    case 'Per Project':    return '(optional, USD/project)'
    case 'Revenue Share':  return '(optional, %)'
    default:               return '(optional)'
  }
}

const NUMERIC_RANGE_TYPES = new Set(['Hourly (USD)', 'Hourly (Robux)', 'Per Project', 'Revenue Share'])

export default function StudioRateStep({ draft, update, onNext, onBack }: Props) {
  return (
    <div className="ob-screen">
      <aside className="ob-side ob-side--dark">
        <div className="ob-brand ob-brand--light">
          <span className="ob-mark">*</span>
          <span>weld.</span>
        </div>
        <h1 className="ob-title ob-title--light">rate &<br />hiring</h1>
        <p className="ob-copy ob-copy--light">
          Let developers know what you pay and whether you&apos;re actively hiring.
        </p>
        <div className="ob-note-card">
          <strong>Be transparent</strong>
          <span>Studios that share their rate range get significantly more responses from developers.</span>
        </div>
      </aside>

      <section className="ob-main">
        <div className="ob-progress"><span style={{ width: `${(3 / 5) * 100}%` }} /></div>
        <div className="ob-step-row">
          <span>Step 3 of 5 - Rate & Hiring</span>
          <span>3/5</span>
        </div>

        <div className="pb-field">
          <label className="pb-label">Actively hiring?</label>
          <div className="pb-option-pills">
            <button
              type="button"
              className={`pb-option-pill${draft.hiring ? ' pb-option-pill--on' : ''}`}
              onClick={() => update({ hiring: true })}
            >
              Yes, hiring now
            </button>
            <button
              type="button"
              className={`pb-option-pill${!draft.hiring ? ' pb-option-pill--on' : ''}`}
              onClick={() => update({ hiring: false })}
            >
              Not right now
            </button>
          </div>
        </div>

        <div className="pb-field">
          <label className="pb-label">Pay rate type <span className="pb-hint-label">(optional)</span></label>
          <div className="pb-option-pills">
            {RATE_TYPES.map(r => (
              <button
                key={r}
                type="button"
                className={`pb-option-pill${draft.rateType === r ? ' pb-option-pill--on' : ''}`}
                onClick={() => update({ rateType: draft.rateType === r ? null : r })}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {draft.rateType !== 'Negotiable' && (
          <div className="pb-field">
            <label className="pb-label">Rate range <span className="pb-hint-label">{rateRangeLabel(draft.rateType)}</span></label>
            {NUMERIC_RANGE_TYPES.has(draft.rateType ?? '') ? (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                  className="pb-input"
                  type="number"
                  placeholder="Min (e.g. 15)"
                  value={draft.rateMin ?? ''}
                  onChange={e => update({ rateMin: e.target.value ? Number(e.target.value) : null })}
                />
                <span style={{ color: 'rgba(255,255,255,0.35)', flexShrink: 0, fontSize: 14 }}>–</span>
                <input
                  className="pb-input"
                  type="number"
                  placeholder="Max (e.g. 50)"
                  value={draft.rateMax ?? ''}
                  onChange={e => update({ rateMax: e.target.value ? Number(e.target.value) : null })}
                />
              </div>
            ) : (
              <input
                className="pb-input"
                type="text"
                placeholder="e.g. 20–30%"
                value={draft.rateMin != null ? String(draft.rateMin) : ''}
                onChange={e => update({ rateMin: e.target.value ? Number(e.target.value) : null })}
              />
            )}
          </div>
        )}

        <div className="pb-field">
          <label className="pb-label">Rate note <span className="pb-hint-label">(optional)</span></label>
          <input
            className="pb-input"
            value={draft.rateNote}
            onChange={e => update({ rateNote: e.target.value })}
            placeholder="e.g. Rates vary by project scope"
          />
        </div>

        <div className="pb-nav">
          <button className="pb-btn pb-btn--ghost" type="button" onClick={onBack}>Back</button>
          <button className="pb-btn pb-btn--primary" type="button" onClick={onNext}>
            Next: Open Roles
          </button>
        </div>
      </section>
    </div>
  )
}
