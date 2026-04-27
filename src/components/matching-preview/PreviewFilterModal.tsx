'use client'

interface Props {
  filterType: 'skills' | 'hiring'
  options: string[]
  active: Set<string>
  onToggle: (opt: string) => void
  onClear: () => void
  onClose: () => void
}

export default function PreviewFilterModal({ filterType, options, active, onToggle, onClear, onClose }: Props) {
  const isSkills = filterType === 'skills'

  return (
    <div className="pf-overlay">
      <div className="pf-card" onClick={e => e.stopPropagation()}>
        <button className="pf-close-btn" onClick={onClose} aria-label="Close filters">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="pf-header">
          <p className="pf-eyebrow">{isSkills ? 'Developer filters' : 'Studio filters'}</p>
          <h2 className="pf-title">{isSkills ? 'Primary Skills' : 'Hiring Focus'}</h2>
          <p className="pf-subtitle">
            {isSkills
              ? 'Show developers who specialise in these areas'
              : 'Show studios that are actively hiring for these roles'}
          </p>
        </div>

        <div className="pf-body">
          <div className="pf-row-head">
            <span className="pf-row-label">{isSkills ? 'Skills' : 'Roles'}</span>
            {active.size > 0 && (
              <button className="pf-clear-btn" onClick={onClear}>Clear all</button>
            )}
          </div>
          <div className="pf-pills">
            {options.map(opt => (
              <button
                key={opt}
                className={`pf-pill${active.has(opt) ? ' pf-pill--on' : ''}`}
                onClick={() => onToggle(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="pf-footer">
          {active.size === 0
            ? <span className="pf-hint">Showing all profiles</span>
            : <span className="pf-hint pf-hint--active">{active.size} filter{active.size > 1 ? 's' : ''} active</span>
          }
        </div>
      </div>
    </div>
  )
}
