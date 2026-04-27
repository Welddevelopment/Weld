'use client'

interface Props {
  filterType: 'skills' | 'hiring'
  skillOptions: string[]
  rangeOptions: string[]
  activeSkill: string | null
  activeRange: string | null
  onToggleSkill: (opt: string) => void
  onToggleRange: (opt: string) => void
  onClearSkill: () => void
  onClearRange: () => void
  onClearAll: () => void
  onClose: () => void
}

export default function PreviewFilterModal({
  filterType,
  skillOptions,
  rangeOptions,
  activeSkill,
  activeRange,
  onToggleSkill,
  onToggleRange,
  onClearSkill,
  onClearRange,
  onClearAll,
  onClose,
}: Props) {
  const isSkills = filterType === 'skills'
  const totalActive = (activeSkill ? 1 : 0) + (activeRange ? 1 : 0)

  return (
    <div className="pf-overlay">
      <div className="pf-card" onClick={e => e.stopPropagation()}>
        <button className="pf-close-btn" type="button" onClick={onClose} aria-label="Close filters">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="pf-header">
          <p className="pf-eyebrow">{isSkills ? 'Developer filters' : 'Studio filters'}</p>
          <h2 className="pf-title">Filters</h2>
          <p className="pf-subtitle">
            {isSkills
              ? 'Narrow by skills and experience level'
              : 'Narrow by hiring focus and studio size'}
          </p>
        </div>

        <div className="pf-section">
          <div className="pf-row-head">
            <span className="pf-row-label">{isSkills ? 'Primary skills' : 'Hiring focus'}</span>
            {activeSkill && (
              <button className="pf-clear-btn" type="button" onClick={onClearSkill}>
                Clear
              </button>
            )}
          </div>
          <div className="pf-pills">
            {skillOptions.map(opt => (
              <button
                key={opt}
                type="button"
                className={`pf-pill${activeSkill === opt ? ' pf-pill--on' : ''}`}
                aria-pressed={activeSkill === opt}
                onClick={() => onToggleSkill(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="pf-section">
          <div className="pf-row-head">
            <span className="pf-row-label">{isSkills ? 'Years of experience' : 'Team size'}</span>
            {activeRange && (
              <button className="pf-clear-btn" type="button" onClick={onClearRange}>
                Clear
              </button>
            )}
          </div>
          <div className="pf-pills">
            {rangeOptions.map(opt => (
              <button
                key={opt}
                type="button"
                className={`pf-pill${activeRange === opt ? ' pf-pill--on' : ''}`}
                aria-pressed={activeRange === opt}
                onClick={() => onToggleRange(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="pf-footer">
          {totalActive === 0
            ? <span className="pf-hint">Showing all profiles</span>
            : (
              <div className="pf-footer-row">
                <span className="pf-hint pf-hint--active">
                  {totalActive} filter{totalActive > 1 ? 's' : ''} active
                </span>
                <button className="pf-clear-btn" type="button" onClick={onClearAll}>Clear all</button>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}
