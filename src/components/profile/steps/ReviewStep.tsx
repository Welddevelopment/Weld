'use client'

import { ProfileDraft } from '../profile-types'

interface Props {
  draft: ProfileDraft
  update: (patch: Partial<ProfileDraft>) => void
  onNext: () => void
  onBack: () => void
}

function Row({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null
  return (
    <div className="pb-review-row">
      <span className="pb-review-label">{label}</span>
      <span className="pb-review-value">{value}</span>
    </div>
  )
}

export default function ReviewStep({ draft, onBack }: Props) {
  const isDev = draft.type === 'dev'

  const handlePublish = () => {
    alert('Profile saved! (In a real app this would submit to the backend.)')
  }

  return (
    <div className="pb-step-content">
      <div className="pb-step-eyebrow">Final step</div>
      <h1 className="pb-step-title">Review & publish</h1>
      <p className="pb-step-sub">Check everything looks right before your profile goes live.</p>

      <div className="pb-review-card">
        <Row label="Type" value={isDev ? 'Developer' : 'Studio'} />
        <Row label="Name" value={draft.name} />
        <Row label="Bio" value={draft.bio} />

        {isDev ? (
          <>
            <Row label="Experience" value={
              draft.experienceYears !== null
                ? draft.experienceYears === 0 ? 'Under 1 year' : `${draft.experienceYears}+ years`
                : null
            } />
            <Row label="Rate" value={
              draft.rateType
                ? [draft.rateAmount, draft.rateType].filter(Boolean).join(' ')
                : null
            } />
          </>
        ) : (
          <>
            <Row label="Team size" value={draft.teamSize !== null ? `${draft.teamSize}+ people` : null} />
            <Row label="Status" value={draft.status} />
            <Row label="Budget" value={draft.budgetType} />
          </>
        )}

        <Row label="Skills" value={draft.selectedSkills.map(s => s.name).join(', ') || null} />

        {isDev && draft.portfolioLinks.length > 0 && (
          <Row label="Portfolio links" value={draft.portfolioLinks.map(l => l.name || l.url).join(', ')} />
        )}

        {isDev && draft.bestWork.length > 0 && (
          <Row label="Projects" value={draft.bestWork.map(w => w.title).filter(Boolean).join(', ')} />
        )}

        {!isDev && draft.topGames.length > 0 && (
          <Row label="Games" value={draft.topGames.map(g => g.title).filter(Boolean).join(', ')} />
        )}
      </div>

      <div className="pb-review-notice">
        Your profile will be visible in the matching pool. You can edit it at any time.
      </div>

      <div className="pb-nav">
        <button className="pb-btn pb-btn--ghost" type="button" onClick={onBack}>Back</button>
        <button className="pb-btn pb-btn--publish" type="button" onClick={handlePublish}>
          Publish profile
        </button>
      </div>
    </div>
  )
}
