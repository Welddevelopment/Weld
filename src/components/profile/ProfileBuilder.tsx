'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ProfileDraft, createDraft, draftToProfile } from './profile-types'
import ProfilePreviewScreen from './ProfilePreviewScreen'
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

const DEV_STEPS    = ['Identity', 'Role', 'Bio', 'Skills', 'Work', 'Portfolio', 'Review']
const STUDIO_STEPS = ['Identity', 'Role', 'Bio', 'Skills', 'Games', 'Review']

type Phase = 'form' | 'preview' | 'published'

function PublishedOverlay({ onViewProfile, onStartMatching }: { onViewProfile: () => void; onStartMatching: () => void }) {
  return (
    <div className="pb-pub-overlay">
      <div className="pb-pub-card">
        <div className="pb-pub-pulse">
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h2 className="pb-pub-heading">Profile is live</h2>
        <p className="pb-pub-sub">You&apos;re now visible in the matching pool.</p>

        <div className="pb-pub-actions">
          <button type="button" className="pb-pub-btn" onClick={onViewProfile}>
            <div className="pb-pub-icon pb-pub-icon--ghost">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <span className="pb-pub-btn-label">View finished profile</span>
          </button>

          <button type="button" className="pb-pub-btn" onClick={onStartMatching}>
            <div className="pb-pub-icon pb-pub-icon--green">
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
            <span className="pb-pub-btn-label">Start matching</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ProfileBuilder() {
  const router = useRouter()
  const [draft, setDraft] = useState<ProfileDraft>(createDraft)
  const [step, setStep] = useState(0)
  const [phase, setPhase] = useState<Phase>('form')
  const [hydrated, setHydrated] = useState(false)
  const [typeChosen, setTypeChosen] = useState(false)

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
  const contentSteps = isDev ? DEV_STEPS : STUDIO_STEPS
  const totalContentSteps = contentSteps.length

  const handleTypeSelect = (type: 'dev' | 'studio') => {
    update({ type })
    setTypeChosen(true)
    setStep(0)
    setPhase('form')
  }

  const goNext = () => setPhase('preview')
  const goBack = () => {
    if (step === 0) {
      setTypeChosen(false)
    } else {
      setStep(s => s - 1)
    }
    setPhase('form')
  }

  const continueFromPreview = () => {
    if (step >= totalContentSteps - 1) {
      setPhase('published')
      return
    }
    setStep(s => s + 1)
    setPhase('form')
  }

  const profile = draftToProfile(draft, 'preview')

  if (!hydrated) return null

  if (phase === 'published') {
    return (
      <>
        <ProfilePreviewScreen
          profile={profile}
          onContinue={continueFromPreview}
          onBack={() => setPhase('form')}
          isLast
        />
        <PublishedOverlay
          onViewProfile={() => setPhase('preview')}
          onStartMatching={() => router.push('/preview')}
        />
      </>
    )
  }

  if (!typeChosen) {
    return (
      <div className="pb-form-shell">
        <div className="pb-form-top">
          <span className="pb-brand">weld</span>
        </div>
        <div className="pb-form-body">
          <TypeStep draft={draft} onSelect={handleTypeSelect} />
        </div>
      </div>
    )
  }

  if (phase === 'preview') {
    return (
      <ProfilePreviewScreen
        profile={profile}
        onContinue={continueFromPreview}
        onBack={() => setPhase('form')}
        isLast={step >= totalContentSteps - 1}
      />
    )
  }

  const stepLabel = contentSteps[step]
  const stepProps = { draft, update, onNext: goNext, onBack: goBack }

  function renderStep() {
    switch (step) {
      case 0: return <IdentityStep {...stepProps} />
      case 1: return <RoleStep {...stepProps} />
      case 2: return <BioStep {...stepProps} />
      case 3: return <SkillsStep {...stepProps} />
      case 4: return isDev ? <WorkStep {...stepProps} /> : <WorkStep {...stepProps} studioMode />
      case 5: return isDev ? <PortfolioStep {...stepProps} /> : <ReviewStep {...stepProps} />
      case 6: return <ReviewStep {...stepProps} />
      default: return null
    }
  }

  return (
    <div className="pb-form-shell">
      <div className="pb-form-top">
        <span className="pb-brand">weld</span>
        <span className="pb-form-step-indicator">
          {stepLabel} · {step + 1} of {totalContentSteps}
        </span>
        <div className="pb-form-progress">
          <div
            className="pb-form-progress-fill"
            style={{ width: `${((step + 1) / totalContentSteps) * 100}%` }}
          />
        </div>
      </div>
      <div className="pb-form-body">
        {renderStep()}
      </div>
    </div>
  )
}
