'use client'

import { ProfileDraft } from '../profile-types'

interface Props {
  draft: ProfileDraft
  update: (patch: Partial<ProfileDraft>) => void
  onNext: () => void
  onBack: () => void
}

const TEAM_SIZES = [
  { label: '1 – 2', value: 1 },
  { label: '3 – 5', value: 3 },
  { label: '6 – 10', value: 6 },
  { label: '11 – 20', value: 11 },
  { label: '20+', value: 20 },
]

const STATUS_OPTIONS = ['Hiring Now', 'Open to Offers', 'Closed']

export default function StudioInfoStep({ draft, update, onNext, onBack }: Props) {
  const ss = draft.studioStats
  const ready = !!draft.name.trim() && !!draft.bio.trim() && draft.teamSize !== null && !!draft.status

  return (
    <div className="ob-screen">
      <aside className="ob-side ob-side--dark">
        <div className="ob-brand ob-brand--light">
                    <span>weld.</span>
        </div>
        <h1 className="ob-title ob-title--light">your<br />studio</h1>
        <p className="ob-copy ob-copy--light">
          Tell developers who you are, what you&apos;ve built, and what you&apos;re looking to create.
        </p>
        <div className="ob-note-card">
          <strong>Stats matter</strong>
          <span>Developers look for studios with track records. Even rough numbers build trust.</span>
        </div>
      </aside>

      <section className="ob-main">
        <div className="ob-progress"><span style={{ width: `${(2 / 5) * 100}%` }} /></div>
        <div className="ob-step-row">
          <span>Step 2 of 5 - Studio Info</span>
          <span>2/5</span>
        </div>

        <div className="pb-field">
          <label className="pb-label">Studio name <span className="pb-required">*</span></label>
          <input
            className="pb-input"
            value={draft.name}
            onChange={e => update({ name: e.target.value })}
            placeholder="e.g. DoBig Studios"
          />
        </div>

        <div className="pb-field">
          <label className="pb-label">Short bio <span className="pb-required">*</span></label>
          <textarea
            className="pb-textarea"
            rows={2}
            value={draft.bio}
            onChange={e => update({ bio: e.target.value })}
            placeholder="One sentence about your studio and what you make."
          />
        </div>

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
          <label className="pb-label">About your studio <span className="pb-hint-label">(optional)</span></label>
          <textarea
            className="pb-textarea"
            rows={3}
            value={draft.about}
            onChange={e => update({ about: e.target.value })}
            placeholder="Your studio's story, mission, or what makes you different."
          />
        </div>

        <div className="pb-field">
          <label className="pb-label">Studio stats <span className="pb-hint-label">(optional)</span></label>
          <div className="pb-panel-row3" style={{ gap: 8 }}>
            <input
              className="pb-input"
              placeholder="Years building"
              value={ss.yearsBuilding}
              onChange={e => update({ studioStats: { ...ss, yearsBuilding: e.target.value } })}
            />
            <input
              className="pb-input"
              placeholder="Projects shipped"
              value={ss.projectsShipped}
              onChange={e => update({ studioStats: { ...ss, projectsShipped: e.target.value } })}
            />
            <input
              className="pb-input"
              placeholder="Total visits"
              value={ss.totalVisits}
              onChange={e => update({ studioStats: { ...ss, totalVisits: e.target.value } })}
            />
          </div>
          <input
            className="pb-input"
            style={{ marginTop: 8 }}
            placeholder="On-time delivery (e.g. 98%)"
            value={ss.onTimeDelivery}
            onChange={e => update({ studioStats: { ...ss, onTimeDelivery: e.target.value } })}
          />
        </div>

        <div className="pb-nav">
          <button className="pb-btn pb-btn--ghost" type="button" onClick={onBack}>Back</button>
          <button
            className="pb-btn pb-btn--primary"
            type="button"
            onClick={onNext}
            disabled={!ready}
          >
            Next: Rate & Hiring
          </button>
        </div>
      </section>
    </div>
  )
}
