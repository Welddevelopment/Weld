'use client'

import { ProfileDraft } from '../profile-types'

interface Props {
  draft: ProfileDraft
  update: (patch: Partial<ProfileDraft>) => void
  onNext: () => void
  onBack: () => void
}

const EXP_OPTIONS = [
  { label: 'Under 1 year', value: 0 },
  { label: '1 – 2 years', value: 1 },
  { label: '3 – 4 years', value: 3 },
  { label: '5+ years', value: 5 },
]

const RATE_TYPES = ['USD / hr', 'Robux / hr', 'Fixed USD', 'Fixed Robux', 'Revenue share']

const TEAM_SIZES = [
  { label: '1 – 2 people', value: 1 },
  { label: '3 – 4 people', value: 3 },
  { label: '5 – 9 people', value: 5 },
  { label: '10 – 19 people', value: 10 },
  { label: '20+ people', value: 20 },
]

const STATUS_OPTIONS = ['Hiring Now', 'Open to Offers', 'Closed']
const BUDGET_TYPES = ['USD', 'Robux', 'Mixed', 'Revenue share']

export default function RoleStep({ draft, update, onNext, onBack }: Props) {
  const isDev = draft.type === 'dev'

  const devReady = draft.experienceYears !== null && !!draft.rateType
  const studioReady = draft.teamSize !== null && !!draft.status

  return (
    <div className="pb-step-content">
      <div className="pb-step-eyebrow">Step 3</div>
      <h1 className="pb-step-title">{isDev ? 'Your experience & rate' : 'Your team & status'}</h1>
      <p className="pb-step-sub">
        {isDev
          ? 'This helps studios understand your level and what you charge.'
          : 'This helps developers see if you\'re a match for their availability and expectations.'}
      </p>

      {isDev ? (
        <>
          <div className="pb-field">
            <label className="pb-label">Years of experience <span className="pb-required">*</span></label>
            <div className="pb-option-pills">
              {EXP_OPTIONS.map(opt => (
                <button
                  key={opt.label}
                  type="button"
                  className={`pb-option-pill${draft.experienceYears === opt.value ? ' pb-option-pill--on' : ''}`}
                  onClick={() => update({ experienceYears: opt.value })}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pb-field">
            <label className="pb-label">Rate type <span className="pb-required">*</span></label>
            <div className="pb-option-pills">
              {RATE_TYPES.map(r => (
                <button
                  key={r}
                  type="button"
                  className={`pb-option-pill${draft.rateType === r ? ' pb-option-pill--on' : ''}`}
                  onClick={() => update({ rateType: r })}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {draft.rateType && !draft.rateType.includes('share') && (
            <div className="pb-field">
              <label className="pb-label">Rate amount <span className="pb-hint-label">(optional)</span></label>
              <input
                className="pb-input"
                type="text"
                value={draft.rateAmount}
                onChange={e => update({ rateAmount: e.target.value })}
                placeholder={draft.rateType.includes('Robux') ? 'e.g. 5,000' : 'e.g. $25'}
              />
            </div>
          )}
        </>
      ) : (
        <>
          <div className="pb-field">
            <label className="pb-label">Team size <span className="pb-required">*</span></label>
            <div className="pb-option-pills">
              {TEAM_SIZES.map(opt => (
                <button
                  key={opt.label}
                  type="button"
                  className={`pb-option-pill${draft.teamSize === opt.value ? ' pb-option-pill--on' : ''}`}
                  onClick={() => update({ teamSize: opt.value })}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pb-field">
            <label className="pb-label">Hiring status <span className="pb-required">*</span></label>
            <div className="pb-option-pills">
              {STATUS_OPTIONS.map(s => (
                <button
                  key={s}
                  type="button"
                  className={`pb-option-pill${draft.status === s ? ' pb-option-pill--on' : ''}`}
                  onClick={() => update({ status: s })}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="pb-field">
            <label className="pb-label">Budget type <span className="pb-hint-label">(optional)</span></label>
            <div className="pb-option-pills">
              {BUDGET_TYPES.map(b => (
                <button
                  key={b}
                  type="button"
                  className={`pb-option-pill${draft.budgetType === b ? ' pb-option-pill--on' : ''}`}
                  onClick={() => update({ budgetType: draft.budgetType === b ? null : b })}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          <div className="pb-field">
            <label className="pb-label">Project value range <span className="pb-hint-label">(optional)</span></label>
            <input
              className="pb-input"
              type="text"
              value={draft.projectValue}
              onChange={e => update({ projectValue: e.target.value })}
              placeholder="e.g. $500 – $2,000"
            />
          </div>
        </>
      )}

      <div className="pb-nav">
        <button className="pb-btn pb-btn--ghost" type="button" onClick={onBack}>Back</button>
        <button
          className="pb-btn pb-btn--primary"
          type="button"
          onClick={onNext}
          disabled={isDev ? !devReady : !studioReady}
        >
          Next
        </button>
      </div>
    </div>
  )
}
