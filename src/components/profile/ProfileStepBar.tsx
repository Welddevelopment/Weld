'use client'

interface Props {
  steps: string[]
  current: number
  onJump: (i: number) => void
}

export default function ProfileStepBar({ steps, current, onJump }: Props) {
  return (
    <nav className="pb-stepbar">
      {steps.map((label, i) => {
        const done = i < current
        const active = i === current
        return (
          <button
            key={label}
            className={`pb-step${active ? ' pb-step--active' : ''}${done ? ' pb-step--done' : ''}`}
            onClick={() => done && onJump(i)}
            disabled={!done && !active}
            type="button"
          >
            <span className="pb-step-dot">
              {done
                ? <svg viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                : <span className="pb-step-num">{i + 1}</span>
              }
            </span>
            <span className="pb-step-label">{label}</span>
          </button>
        )
      })}
    </nav>
  )
}
