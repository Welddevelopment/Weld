'use client'

import Image from 'next/image'
import { ProfileDraft } from '../profile-types'
import { DevWork } from '../../matching-preview/preview-types'

interface Props {
  draft: ProfileDraft
  update: (patch: Partial<ProfileDraft>) => void
  onNext: () => void
  onBack: () => void
}

function emptyWork(): DevWork {
  return { emoji: 'Game', title: '', desc: '', tools: '', time: '', amount: '', plays: '', imageUrl: '' }
}

function hasAnyWorkValue(work: DevWork) {
  return [work.title, work.desc, work.tools, work.time, work.amount, work.plays, work.imageUrl ?? '']
    .some(value => value.trim().length > 0)
}

function isCompleteEnough(work: DevWork) {
  return !hasAnyWorkValue(work) || (work.title.trim().length > 0 && work.desc.trim().length > 0)
}

export default function WorkStep({ draft, update, onNext, onBack }: Props) {
  const works = draft.bestWork
  const ready = works.every(isCompleteEnough)

  const addWork = () => update({ bestWork: [...works, emptyWork()] })
  const updateWork = (i: number, work: DevWork) => {
    const next = [...works]
    next[i] = work
    update({ bestWork: next })
  }
  const removeWork = (i: number) => update({ bestWork: works.filter((_, idx) => idx !== i) })

  return (
    <div className="ob-screen">
      <aside className="ob-side ob-side--dark">
        <div className="ob-brand ob-brand--light">
          <Image src="/Assets/weld-logo-official.svg" width={24} height={24} alt="weld" />
          <span>weld.</span>
        </div>
        <h1 className="ob-title ob-title--light">your<br />best work</h1>
        <p className="ob-copy ob-copy--light">
          Up to 3 projects you&apos;re most proud of. Real proof wins trust, even if the stats are simple.
        </p>

        <div className="ob-note-card">
          <strong>Optional but powerful</strong>
          <span>Profiles with at least one work entry give studios more to trust than empty profiles.</span>
        </div>
      </aside>

      <section className="ob-main">
        <div className="ob-progress"><span style={{ width: `${(4 / 6) * 100}%` }} /></div>
        <div className="ob-step-row">
          <span>Step 4 of 6 - Work</span>
          <span>4/6</span>
        </div>

        <div className="ob-work-list">
          {works.map((work, i) => (
            <div key={i} className="ob-work-entry">
              <div className="ob-work-head">
                <span>Project {i + 1}</span>
                <button type="button" onClick={() => removeWork(i)}>Remove</button>
              </div>
              <input
                className="pb-input"
                value={work.title}
                onChange={e => updateWork(i, { ...work, title: e.target.value })}
                placeholder="Project title"
              />
              <textarea
                className="pb-textarea"
                value={work.desc}
                onChange={e => updateWork(i, { ...work, desc: e.target.value })}
                placeholder="Built modular combat with custom abilities and UI integration..."
                rows={2}
              />
              <div className="ob-three-col">
                <input
                  className="pb-input"
                  value={work.tools}
                  onChange={e => updateWork(i, { ...work, tools: e.target.value })}
                  placeholder="Tools: Luau, Blender"
                />
                <input
                  className="pb-input"
                  value={work.time}
                  onChange={e => updateWork(i, { ...work, time: e.target.value })}
                  placeholder="2 weeks"
                />
                <input
                  className="pb-input"
                  value={work.amount}
                  onChange={e => updateWork(i, { ...work, amount: e.target.value })}
                  placeholder="$300"
                />
              </div>
              <input
                className="pb-input"
                value={work.plays}
                onChange={e => updateWork(i, { ...work, plays: e.target.value })}
                placeholder="Date"
              />
            </div>
          ))}
        </div>

        {works.length < 3 && (
          <button type="button" className="ob-add-dashed" onClick={addWork}>
            + Add project (up to 3)
          </button>
        )}

        <div className="pb-nav">
          <button className="pb-btn pb-btn--ghost" type="button" onClick={onBack}>Back</button>
          <button className="pb-btn pb-btn--primary" type="button" onClick={onNext} disabled={!ready}>
            Next: Portfolio
          </button>
        </div>
      </section>
    </div>
  )
}
