'use client'

import { ProfileDraft } from '../profile-types'
import { DEV_SKILL_DESCS } from '../../matching-preview/preview-data'

interface Props {
  draft: ProfileDraft
  update: (patch: Partial<ProfileDraft>) => void
  onNext: () => void
  onBack: () => void
}

const DEV_SKILLS = Object.keys(DEV_SKILL_DESCS)

const STUDIO_HIRING_FOCUS = [
  'Scripting', 'UI Design', 'VFX', 'Building', '3D Modeling',
  'Lighting', 'Animation', 'DataStore', 'Sound Design', 'Music',
  'Figma', 'Game Design', 'Producer', 'QA Tester',
]

const STUDIO_SKILL_DESCS: Record<string, string> = {
  'Scripting':    'Looking for developers who can build robust game systems in Luau.',
  'UI Design':    'Need a UI dev to design and build polished player-facing interfaces.',
  'VFX':          'Seeking a VFX artist to create immersive visual effects for our games.',
  'Building':     'Looking for a builder to create large-scale, detailed Roblox environments.',
  '3D Modeling':  'Need a 3D artist to produce custom assets and props in Blender.',
  'Lighting':     'Seeking a lighting artist to set mood and atmosphere across our game worlds.',
  'Animation':    'Looking for an animator for characters, cutscenes, and procedural motion.',
  'DataStore':    'Need a backend dev to build and maintain persistent player data systems.',
  'Sound Design': 'Seeking a sound designer to create original SFX for our games.',
  'Music':        'Looking for a composer to create adaptive in-game soundtracks.',
  'Figma':        'Need a designer who can run a full UI pipeline from wireframe to handoff.',
  'Game Design':  'Seeking a game designer to define core loops, economy, and progression.',
  'Producer':     'Looking for a producer to coordinate the team and keep projects on track.',
  'QA Tester':    'Need a tester to find and report bugs across all platforms and devices.',
}

const MAX_SKILLS = 5

export default function SkillsStep({ draft, update, onNext, onBack }: Props) {
  const isDev = draft.type === 'dev'
  const options = isDev ? DEV_SKILLS : STUDIO_HIRING_FOCUS
  const descs = isDev ? DEV_SKILL_DESCS : STUDIO_SKILL_DESCS

  const selected = draft.selectedSkills
  const selectedNames = new Set(selected.map(s => s.name))

  const toggle = (name: string) => {
    if (selectedNames.has(name)) {
      update({ selectedSkills: selected.filter(s => s.name !== name) })
    } else if (selected.length < MAX_SKILLS) {
      update({ selectedSkills: [...selected, { name, description: descs[name] ?? '' }] })
    }
  }

  return (
    <div className="pb-step-content">
      <div className="pb-step-eyebrow">Step 4</div>
      <h1 className="pb-step-title">{isDev ? 'Your skills' : 'What you\'re hiring for'}</h1>
      <p className="pb-step-sub">
        {isDev
          ? `Pick up to ${MAX_SKILLS} skills that best represent what you do.`
          : `Pick up to ${MAX_SKILLS} roles you need filled right now.`}
        {selected.length >= MAX_SKILLS && <strong> Max reached.</strong>}
      </p>

      <div className="pb-skill-grid">
        {options.map(name => {
          const on = selectedNames.has(name)
          const disabled = !on && selected.length >= MAX_SKILLS
          return (
            <button
              key={name}
              type="button"
              className={`pb-skill-btn${on ? ' pb-skill-btn--on' : ''}${disabled ? ' pb-skill-btn--disabled' : ''}`}
              onClick={() => !disabled && toggle(name)}
              disabled={disabled}
            >
              <span className="pb-skill-name">{name}</span>
              {on && <span className="pb-skill-check">✓</span>}
            </button>
          )
        })}
      </div>

      {selected.length > 0 && (
        <div className="pb-skill-selected">
          <div className="pb-skill-selected-label">Selected order (drag to reorder):</div>
          {selected.map((s, i) => (
            <div key={s.name} className="pb-skill-selected-row">
              <span className="pb-skill-selected-num">{i + 1}</span>
              <span className="pb-skill-selected-name">{s.name}</span>
              <button
                type="button"
                className="pb-skill-remove"
                onClick={() => update({ selectedSkills: selected.filter(x => x.name !== s.name) })}
              >✕</button>
            </div>
          ))}
        </div>
      )}

      <div className="pb-nav">
        <button className="pb-btn pb-btn--ghost" type="button" onClick={onBack}>Back</button>
        <button
          className="pb-btn pb-btn--primary"
          type="button"
          onClick={onNext}
          disabled={selected.length === 0}
        >
          Next
        </button>
      </div>
    </div>
  )
}
