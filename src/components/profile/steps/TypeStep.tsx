'use client'

import { ProfileDraft } from '../profile-types'

interface Props {
  draft: ProfileDraft
  onSelect: (type: 'dev' | 'studio') => void
}

export default function TypeStep({ draft, onSelect }: Props) {
  return (
    <div className="pb-step-content">
      <div className="pb-step-eyebrow">Step 1</div>
      <h1 className="pb-step-title">Who are you on weld.?</h1>
      <p className="pb-step-sub">Choose the profile type that best describes you. You can&apos;t change this later.</p>

      <div className="pb-type-cards">
        <button
          type="button"
          className={`pb-type-card${draft.type === 'dev' ? ' pb-type-card--active' : ''}`}
          onClick={() => onSelect('dev')}
        >
          <div className="pb-type-icon">🛠</div>
          <div className="pb-type-label">Developer</div>
          <div className="pb-type-desc">I create games, scripts, art, or audio and I&apos;m looking for studios to work with.</div>
        </button>

        <button
          type="button"
          className={`pb-type-card${draft.type === 'studio' ? ' pb-type-card--active' : ''}`}
          onClick={() => onSelect('studio')}
        >
          <div className="pb-type-icon">🎮</div>
          <div className="pb-type-label">Studio</div>
          <div className="pb-type-desc">I run or represent a Roblox game studio and I&apos;m looking to hire developers.</div>
        </button>
      </div>
    </div>
  )
}
