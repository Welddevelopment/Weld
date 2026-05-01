'use client'

type FilterSection = {
  label: string
  options: string[]
  active: string | null
  onToggle: (opt: string) => void
  onClear: () => void
}

interface Props {
  filterType: 'skills' | 'hiring'
  skillOptions: string[]
  rangeOptions: string[]
  playOptions: string[]
  extraSections: FilterSection[]
  activeSkills: Set<string>
  activeRange: string | null
  activePlay: string | null
  onToggleSkill: (opt: string) => void
  onToggleRange: (opt: string) => void
  onTogglePlay: (opt: string) => void
  onClearSkill: () => void
  onClearRange: () => void
  onClearPlay: () => void
  onClearAll: () => void
  onStartMatching: () => void
  canStartMatching: boolean
  onClose: () => void
}

export default function PreviewFilterModal({
  filterType,
  skillOptions,
  rangeOptions,
  playOptions,
  extraSections,
  activeSkills,
  activeRange,
  activePlay,
  onToggleSkill,
  onToggleRange,
  onTogglePlay,
  onClearSkill,
  onClearRange,
  onClearPlay,
  onClearAll,
  onStartMatching,
  canStartMatching,
  onClose,
}: Props) {
  const isSkills = filterType === 'skills'
  const totalActive = activeSkills.size
    + (activeRange ? 1 : 0)
    + (activePlay ? 1 : 0)
    + extraSections.filter(section => section.active).length

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
            {activeSkills.size > 0 && (
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
                className={`pf-pill${activeSkills.has(opt) ? ' pf-pill--on' : ''}`}
                aria-pressed={activeSkills.has(opt)}
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

        <div className="pf-section">
          <div className="pf-row-head">
            <span className="pf-row-label">{isSkills ? 'Plays contributed to' : 'Total plays'}</span>
            {activePlay && (
              <button className="pf-clear-btn" type="button" onClick={onClearPlay}>
                Clear
              </button>
            )}
          </div>
          <div className="pf-pills">
            {playOptions.map(opt => (
              <button
                key={opt}
                type="button"
                className={`pf-pill${activePlay === opt ? ' pf-pill--on' : ''}`}
                aria-pressed={activePlay === opt}
                onClick={() => onTogglePlay(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {extraSections.map(section => (
          <div className="pf-section" key={section.label}>
            <div className="pf-row-head">
              <span className="pf-row-label">{section.label}</span>
              {section.active && (
                <button className="pf-clear-btn" type="button" onClick={section.onClear}>
                  Clear
                </button>
              )}
            </div>
            <div className="pf-pills">
              {section.options.map(opt => (
                <button
                  key={opt}
                  type="button"
                  className={`pf-pill${section.active === opt ? ' pf-pill--on' : ''}`}
                  aria-pressed={section.active === opt}
                  onClick={() => section.onToggle(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="pf-footer">
          {totalActive === 0
            ? <span className="pf-hint">Showing all profiles</span>
            : (
              <div className="pf-footer-row">
                <span className="pf-hint pf-hint--active">
                  {totalActive} filter{totalActive > 1 ? 's' : ''} active
                </span>
                <button
                  className="pf-start-btn"
                  type="button"
                  onClick={onStartMatching}
                  disabled={!canStartMatching}
                >
                  start swiping
                </button>
                <button className="pf-clear-btn" type="button" onClick={onClearAll}>Clear all</button>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}
