'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Session } from '@supabase/supabase-js'
import { ProfileDraft, createDraft, draftToProfile } from './profile-types'
import ProfilePreviewScreen from './ProfilePreviewScreen'
import TypeStep from './steps/TypeStep'
import IdentityStep from './steps/IdentityStep'
import RoleStep from './steps/RoleStep'
import BioStep from './steps/BioStep'
import SkillsStep from './steps/SkillsStep'
import WorkStep from './steps/WorkStep'
import PortfolioStep from './steps/PortfolioStep'
import { getBrowserSupabase, hasBrowserSupabaseConfig } from '@/lib/supabase/browser'

const DRAFT_KEY = 'weld_profile_draft'

function loadDraft(): ProfileDraft {
  if (typeof window === 'undefined') return createDraft()
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (raw) return { ...createDraft(), ...JSON.parse(raw) }
  } catch {}
  return createDraft()
}

function mergeDraft(value: unknown): ProfileDraft {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return createDraft()
  return { ...createDraft(), ...(value as Partial<ProfileDraft>) }
}

async function loadAccountDraft(accessToken: string) {
  const response = await fetch('/api/account/profile', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  })

  if (!response.ok) throw new Error('Could not load account profile.')

  const result = (await response.json()) as {
    profile?: { draft?: unknown } | null
  }

  return result.profile?.draft ? mergeDraft(result.profile.draft) : null
}

async function saveAccountProfile(
  accessToken: string,
  draft: ProfileDraft,
  publishedProfile?: ReturnType<typeof draftToProfile>
) {
  const response = await fetch('/api/account/profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      draft,
      ...(publishedProfile ? { publishedProfile } : {}),
    }),
  })

  if (!response.ok) throw new Error('Could not save account profile.')
}

const DEV_STEPS    = ['Identity', 'Role', 'Bio', 'Skills', 'Work', 'Portfolio']
const STUDIO_STEPS = ['Identity', 'Role', 'Bio', 'Skills', 'Games']

type Phase = 'form' | 'preview' | 'published'
type SaveState = 'local' | 'loading' | 'saving' | 'saved' | 'error'

function saveStateLabel(saveState: SaveState) {
  if (saveState === 'loading') return 'Loading account'
  if (saveState === 'saving') return 'Saving'
  if (saveState === 'saved') return 'Saved to account'
  if (saveState === 'error') return 'Save issue'
  return 'Local draft'
}

function ProfileAccountStatus({
  accountEmail,
  saveState,
}: {
  accountEmail: string | null
  saveState: SaveState
}) {
  if (!accountEmail) {
    return (
      <Link href="/signup" className="pb-account-link">
        Sign in to save
      </Link>
    )
  }

  return (
    <Link href="/account" className="pb-account-status">
      <span className={`pb-save-dot pb-save-dot--${saveState}`} />
      <span>{saveStateLabel(saveState)}</span>
      <span className="pb-account-email">{accountEmail}</span>
    </Link>
  )
}

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
  const [accountEmail, setAccountEmail] = useState<string | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [accountLoaded, setAccountLoaded] = useState(false)
  const [saveState, setSaveState] = useState<SaveState>('local')

  useEffect(() => {
    setDraft(loadDraft())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    if (!hasBrowserSupabaseConfig()) {
      setAccountLoaded(true)
      return
    }

    const supabase = getBrowserSupabase()
    let alive = true

    async function applySession(session: Session | null, loadRemote: boolean) {
      if (!alive) return

      setAccountEmail(session?.user.email ?? null)
      setAccessToken(session?.access_token ?? null)

      if (!session?.access_token) {
        setSaveState('local')
        setAccountLoaded(true)
        return
      }

      if (!loadRemote) {
        setAccountLoaded(true)
        return
      }

      setSaveState('loading')

      try {
        const remoteDraft = await loadAccountDraft(session.access_token)
        if (!alive) return
        if (remoteDraft) setDraft(remoteDraft)
        setSaveState('saved')
      } catch {
        if (!alive) return
        setSaveState('error')
      } finally {
        if (alive) setAccountLoaded(true)
      }
    }

    supabase.auth.getSession().then(({ data }) => {
      void applySession(data.session, true)
    })

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      void applySession(session, event === 'SIGNED_IN')
    })

    return () => {
      alive = false
      data.subscription.unsubscribe()
    }
  }, [hydrated])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
    } catch {}
  }, [draft, hydrated])

  useEffect(() => {
    if (!hydrated || !accountLoaded || !accessToken) return

    setSaveState('saving')
    const timeout = window.setTimeout(() => {
      saveAccountProfile(accessToken, draft)
        .then(() => setSaveState('saved'))
        .catch(() => setSaveState('error'))
    }, 500)

    return () => window.clearTimeout(timeout)
  }, [draft, hydrated, accountLoaded, accessToken])

  const update = useCallback((patch: Partial<ProfileDraft>) => {
    setDraft(prev => ({ ...prev, ...patch }))
  }, [])

  const isDev = draft.type === 'dev'
  const contentSteps = isDev ? DEV_STEPS : STUDIO_STEPS
  const totalContentSteps = contentSteps.length
  const profile = useMemo(() => draftToProfile(draft, 'preview'), [draft])

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
      if (accessToken) {
        setSaveState('saving')
        saveAccountProfile(accessToken, draft, profile)
          .then(() => setSaveState('saved'))
          .catch(() => setSaveState('error'))
      }
      return
    }
    setStep(s => s + 1)
    setPhase('form')
  }

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
          <ProfileAccountStatus accountEmail={accountEmail} saveState={saveState} />
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
      case 5: return <PortfolioStep {...stepProps} />
      default: return null
    }
  }

  return (
    <div className="pb-form-shell">
      <div className="pb-form-top">
        <span className="pb-brand">weld</span>
        <ProfileAccountStatus accountEmail={accountEmail} saveState={saveState} />
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
