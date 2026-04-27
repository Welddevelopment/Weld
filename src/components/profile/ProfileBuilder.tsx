'use client'

import { useState, useEffect, useCallback } from 'react'
import { ProfileDraft, createDraft, draftToProfile } from './profile-types'
import ProfileStepBar from './ProfileStepBar'
import ProfileCardPreview from './ProfileCardPreview'
import TypeStep from './steps/TypeStep'
import IdentityStep from './steps/IdentityStep'
import RoleStep from './steps/RoleStep'
import BioStep from './steps/BioStep'
import SkillsStep from './steps/SkillsStep'
import WorkStep from './steps/WorkStep'
import PortfolioStep from './steps/PortfolioStep'
import ReviewStep from './steps/ReviewStep'

const DRAFT_KEY = 'weld_profile_draft'

function loadDraft(): ProfileDraft {
  if (typeof window === 'undefined') return createDraft()
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (raw) return { ...createDraft(), ...JSON.parse(raw) }
  } catch {}
  return createDraft()
}

const DEV_STEPS = ['Type', 'Identity', 'Role', 'Bio', 'Skills', 'Work', 'Portfolio', 'Review']
const STUDIO_STEPS = ['Type', 'Identity', 'Role', 'Bio', 'Skills', 'Games', 'Review']

export default function ProfileBuilder() {
  const [draft, setDraft] = useState<ProfileDraft>(createDraft)
  const [step, setStep] = useState(0)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setDraft(loadDraft())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
  }, [draft, hydrated])

  const update = useCallback((patch: Partial<ProfileDraft>) => {
    setDraft(prev => ({ ...prev, ...patch }))
  }, [])

  const isDev = draft.type === 'dev'
  const steps = isDev ? DEV_STEPS : STUDIO_STEPS
  const totalSteps = steps.length

  const goNext = () => setStep(s => Math.min(s + 1, totalSteps - 1))
  const goBack = () => setStep(s => Math.max(s - 1, 0))

  const handleTypeChange = (type: 'dev' | 'studio') => {
    update({ type })
    setStep(1)
  }

  const profile = draftToProfile(draft, 'preview')

  const stepProps = { draft, update, onNext: goNext, onBack: goBack }

  function renderStep() {
    if (step === 0) return <TypeStep draft={draft} onSelect={handleTypeChange} />
    if (step === 1) return <IdentityStep {...stepProps} />
    if (step === 2) return <RoleStep {...stepProps} />
    if (step === 3) return <BioStep {...stepProps} />
    if (step === 4) return <SkillsStep {...stepProps} />
    if (step === 5) return isDev
      ? <WorkStep {...stepProps} />
      : <WorkStep {...stepProps} studioMode />
    if (step === 6) return isDev
      ? <PortfolioStep {...stepProps} />
      : <ReviewStep {...stepProps} />
    if (step === 7) return <ReviewStep {...stepProps} />
    return null
  }

  if (!hydrated) return null

  return (
    <div className="pb-shell">
      <div className="pb-left">
        <div className="pb-brand">weld</div>
        <ProfileStepBar steps={steps} current={step} onJump={setStep} />
      </div>

      <div className="pb-main">
        <div className="pb-step-wrap">
          {renderStep()}
        </div>
      </div>

      <div className="pb-right">
        <div className="pb-preview-label">Live preview</div>
        <ProfileCardPreview profile={profile} />
      </div>
    </div>
  )
}
