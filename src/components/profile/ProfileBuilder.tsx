'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Session } from '@supabase/supabase-js'
import { ProfileDraft, createDraft, draftToProfile } from './profile-types'
import type { PreviewProfile } from '@/components/matching-preview/preview-types'
import IdentityStep from './steps/IdentityStep'
import AvailabilityStep from './steps/AvailabilityStep'
import RoleStep from './steps/RoleStep'
import PortfolioStep from './steps/PortfolioStep'
import WorkStep from './steps/WorkStep'
import SkillsStep from './steps/SkillsStep'
import EditableCard from './EditableCard'
import SkillsEditPanel from './editor-panels/SkillsEditPanel'
import SkillDetailEditPanel from './editor-panels/SkillDetailEditPanel'
import WorkEditPanel from './editor-panels/WorkEditPanel'
import GamesEditPanel from './editor-panels/GamesEditPanel'
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
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  })
  if (!response.ok) throw new Error('Could not load account profile.')
  const result = (await response.json()) as { profile?: { draft?: unknown } | null }
  return result.profile?.draft ? mergeDraft(result.profile.draft) : null
}

async function saveAccountProfile(
  accessToken: string,
  draft: ProfileDraft,
  publishedProfile?: ReturnType<typeof draftToProfile>,
  signal?: AbortSignal
) {
  const response = await fetch('/api/account/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ draft, ...(publishedProfile ? { publishedProfile } : {}) }),
    signal,
  })
  if (!response.ok) throw new Error('Could not save account profile.')
}

type Phase = 'identity' | 'availability' | 'rate' | 'work' | 'portfolio' | 'skills' | 'editor' | 'published'
type SaveState = 'local' | 'loading' | 'saving' | 'saved' | 'error'

function saveStateLabel(s: SaveState) {
  if (s === 'loading') return 'Loading account'
  if (s === 'saving') return 'Saving'
  if (s === 'saved') return 'Saved to account'
  if (s === 'error') return 'Save issue'
  return 'Local draft'
}

function ProfileAccountStatus({ accountEmail, saveState }: { accountEmail: string | null; saveState: SaveState }) {
  if (!accountEmail) {
    return <Link href="/signup" className="pb-account-link">Sign in to save</Link>
  }
  return (
    <Link href="/account" className="pb-account-status">
      <span className={`pb-save-dot pb-save-dot--${saveState}`} />
      <span>{saveStateLabel(saveState)}</span>
      <span className="pb-account-email">{accountEmail}</span>
    </Link>
  )
}

function PublishedOverlay({ onStartMatching, onDismiss }: { onStartMatching: () => void; onDismiss: () => void }) {
  return (
    <div className="pb-pub-overlay">
      <div className="pb-pub-card" style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Close"
          style={{
            position: 'absolute', top: -14, right: -14,
            width: 32, height: 32, borderRadius: '50%',
            background: '#E84624', border: 'none', color: '#fff',
            fontSize: 15, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.35)',
          }}
        >✕</button>
        <div className="pb-pub-pulse">
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="pb-pub-heading">Profile is live</h2>
        <p className="pb-pub-sub">You&apos;re live — studios and devs can now find you.</p>
        <div className="pb-pub-actions">
          <button type="button" className="pb-pub-btn" onClick={onStartMatching}>
            <div className="pb-pub-icon pb-pub-icon--green">
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
            <span className="pb-pub-btn-label">Start swiping</span>
          </button>
        </div>
      </div>
    </div>
  )
}

function DeleteWarningModal({ isDeleting, onConfirm, onCancel }: { isDeleting: boolean; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 500,
      background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div style={{
        background: '#141211', border: '1px solid rgba(232,70,36,0.3)',
        borderRadius: 20, padding: '36px 28px', maxWidth: 380, width: '100%', textAlign: 'center',
      }}>
        <div style={{ fontSize: 36, marginBottom: 16 }}>⚠️</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 26, color: '#FFF7F1', marginBottom: 12, marginTop: 0 }}>
          Delete your draft?
        </h2>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.48)', lineHeight: 1.65, marginBottom: 28, marginTop: 0 }}>
          Your draft will be permanently cleared. If you&apos;ve published a profile, it will be removed from the swipe pool. This cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button onClick={onCancel} disabled={isDeleting} style={{ padding: '10px 22px', borderRadius: 999, border: '1.5px solid rgba(255,255,255,0.14)', background: 'transparent', color: 'rgba(255,255,255,0.65)', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>
            Cancel
          </button>
          <button onClick={onConfirm} disabled={isDeleting} style={{ padding: '10px 22px', borderRadius: 999, border: '1.5px solid #E84624', background: 'rgba(232,70,36,0.12)', color: '#E84624', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>
            {isDeleting ? 'Deleting…' : 'Delete draft'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ProfileBuilder({
  onPublished,
  onDelete,
  initialPhase = 'identity',
  onCancel,
}: {
  onPublished?: (profile: PreviewProfile) => void
  onDelete?: () => Promise<void>
  initialPhase?: Phase
  onCancel?: () => void
} = {}) {
  const router = useRouter()
  const [draft, setDraft] = useState<ProfileDraft>(createDraft)
  const [phase, setPhase] = useState<Phase>(initialPhase)
  const [leftPanel, setLeftPanel] = useState<null | 'games'>(null)
  const [rightPanel, setRightPanel] = useState<null | 'work' | 'skills' | 'portfolio' | { skill: string }>(null)
  const [hydrated, setHydrated] = useState(false)
  const [accountEmail, setAccountEmail] = useState<string | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [accountLoaded, setAccountLoaded] = useState(false)
  const [saveState, setSaveState] = useState<SaveState>('local')
  const [showDeleteWarning, setShowDeleteWarning] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showScrollActions, setShowScrollActions] = useState(false)
  const [checklistOpen, setChecklistOpen] = useState(true)
  const bodyRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const d = loadDraft()
    setDraft({ ...d, type: 'dev', badge: d.badge === 'Studio' ? '' : d.badge })
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    if (!hasBrowserSupabaseConfig()) { setAccountLoaded(true); return }

    const supabase = getBrowserSupabase()
    let alive = true

    async function applySession(session: Session | null, loadRemote: boolean) {
      if (!alive) return
      setAccountEmail(session?.user.email ?? null)
      setAccessToken(session?.access_token ?? null)
      if (!session?.access_token) { setSaveState('local'); setAccountLoaded(true); return }
      if (!loadRemote) { setAccountLoaded(true); return }
      setSaveState('loading')
      try {
        const remoteDraft = await loadAccountDraft(session.access_token)
        if (!alive) return
        if (remoteDraft) setDraft({ ...remoteDraft, type: 'dev', badge: remoteDraft.badge === 'Studio' ? '' : remoteDraft.badge })
        setSaveState('saved')
      } catch {
        if (!alive) return
        setSaveState('error')
      } finally {
        if (alive) setAccountLoaded(true)
      }
    }

    supabase.auth.getSession().then(({ data }) => { void applySession(data.session, true) })
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      void applySession(session, event === 'SIGNED_IN')
    })
    return () => { alive = false; data.subscription.unsubscribe() }
  }, [hydrated])

  useEffect(() => {
    if (!hydrated) return
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(draft)) } catch {}
  }, [draft, hydrated])

  useEffect(() => {
    const root = bodyRef.current
    if (!root) return
    const onScroll = () => setShowScrollActions(root.scrollTop > 120)
    root.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => root.removeEventListener('scroll', onScroll)
  }, [])

  const checklistTasks = useMemo(() => {
    const hasName = !!draft.name.trim()
    const hasBio = !!draft.bio.trim()
    const hasSkill = draft.selectedSkills.length > 0
    const hasGame = draft.topGames.length > 0
    const hasWork = draft.bestWork.length > 0
    const hasPortfolio = draft.portfolioLinks.some(link => link.url?.trim()) || draft.socials.some(link => link.url?.trim())

    return [
      { label: 'Fill in your name', completed: hasName },
      { label: 'Write a short bio', completed: hasBio },
      { label: 'Add at least one skill', completed: hasSkill },
      { label: 'Add a game you worked on', completed: hasGame },
      { label: 'Share your work or socials', completed: hasPortfolio },
      { label: 'Link a project or portfolio item', completed: hasWork },
    ]
  }, [draft])

  const completedChecklistCount = checklistTasks.filter(task => task.completed).length

  useEffect(() => {
    if (!hydrated || !accountLoaded || !accessToken) return
    const controller = new AbortController()
    setSaveState('saving')
    const timeout = window.setTimeout(() => {
      saveAccountProfile(accessToken, draft, undefined, controller.signal)
        .then(() => setSaveState('saved'))
        .catch(error => {
          if (error instanceof DOMException && error.name === 'AbortError') return
          setSaveState('error')
        })
    }, 500)
    return () => {
      window.clearTimeout(timeout)
      controller.abort()
    }
  }, [draft, hydrated, accountLoaded, accessToken])

  const update = useCallback((patch: Partial<ProfileDraft>) => {
    setDraft(prev => ({ ...prev, ...patch }))
  }, [])

  const profile = useMemo(() => draftToProfile(draft, 'preview'), [draft])

  const handlePublish = () => {
    setPhase('published')
    if (accessToken) {
      setSaveState('saving')
      saveAccountProfile(accessToken, draft, profile)
        .then(() => setSaveState('saved'))
        .catch(() => setSaveState('error'))
    }
  }

  const handleConfirmDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete?.()
    } catch {
      setIsDeleting(false)
    }
  }

  if (!hydrated) return null

  // Published overlay sits on top of the editor
  const publishedOverlay = phase === 'published' ? (
    <PublishedOverlay
      onStartMatching={() => router.push('/swipe')}
      onDismiss={() => onPublished?.(profile)}
    />
  ) : null

  // Header shown in all phases
  const isQuickStep = phase === 'identity' || phase === 'availability' || phase === 'rate' || phase === 'work' || phase === 'portfolio' || phase === 'skills'
  const quickStepNum = phase === 'identity' ? 1 : phase === 'availability' ? 2 : phase === 'rate' ? 3 : phase === 'work' ? 4 : phase === 'portfolio' ? 5 : 6
  const quickStepLabel = phase === 'identity' ? 'Roblox' : phase === 'availability' ? 'Availability' : phase === 'rate' ? 'Rate' : phase === 'work' ? 'Work' : phase === 'portfolio' ? 'Portfolio' : 'Skills'
  const quickStepCount = 6

  const header = (
    <div className="pb-form-top">
      <span className="pb-brand">weld</span>
      <ProfileAccountStatus accountEmail={accountEmail} saveState={saveState} />
      {isQuickStep && (
        <>
          <span className="pb-form-step-indicator">
            {quickStepLabel} · {quickStepNum} of {quickStepCount}
          </span>
          <div className="pb-form-progress">
            <div className="pb-form-progress-fill" style={{ width: `${(quickStepNum / quickStepCount) * 100}%` }} />
          </div>
        </>
      )}
      {!isQuickStep && (
        <span className="pb-form-step-indicator" style={{ marginLeft: 'auto' }}>
          Edit your profile
        </span>
      )}
      {isQuickStep && (
        <span className="pb-form-step-indicator">
          {quickStepLabel} · {quickStepNum} of {quickStepCount}
        </span>
      )}
      <button
        type="button"
        onClick={() => setShowDeleteWarning(true)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(232,70,36,0.45)', padding: '4px 0', flexShrink: 0 }}
      >
        Delete draft
      </button>
    </div>
  )

  // Editor phase: card + side panel row
  if (phase === 'editor' || phase === 'published') {
    return (
      <div className="pb-form-shell">
        {header}
        <div className="pb-form-body pb-form-body--editor" ref={bodyRef}>
          <div className="npc-stack-row" style={{ alignItems: 'flex-start' }}>
            {leftPanel === 'games' && (
              <GamesEditPanel draft={draft} update={update} onClose={() => setLeftPanel(null)} />
            )}
            <EditableCard
              draft={draft}
              update={update}
              leftPanel={leftPanel}
              rightPanel={rightPanel}
              onToggleLeft={() => setLeftPanel(p => p === 'games' ? null : 'games')}
              onToggleRight={p => setRightPanel(prev => {
                if (typeof p === 'object' && 'skill' in p) {
                  return typeof prev === 'object' && 'skill' in prev && prev.skill === p.skill ? null : p
                }
                return prev === p ? null : p
              })}
              onBack={() => {
                setLeftPanel(null)
                setRightPanel(null)
                if (onCancel) onCancel()
                else setPhase('skills')
              }}
              onBackLabel={onCancel ? '← Cancel' : '← Back'}
              onPublish={handlePublish}
              showPortfolioButton={true}
              showExperienceEdit={true}
              showScrollActions={showScrollActions}
            />
            {rightPanel === 'skills' && (
              <SkillsEditPanel draft={draft} update={update} onClose={() => setRightPanel(null)} />
            )}
            {rightPanel !== null && typeof rightPanel === 'object' && 'skill' in rightPanel && (
              <SkillDetailEditPanel
                skillName={rightPanel.skill}
                draft={draft}
                update={update}
                onBack={() => setRightPanel(null)}
              />
            )}
            {rightPanel === 'portfolio' && (
              <PortfolioStep
                draft={draft}
                update={update}
                onBack={() => setRightPanel(null)}
                onNext={() => setRightPanel(null)}
              />
            )}
            {rightPanel === 'work' && (
              <WorkEditPanel draft={draft} update={update} onClose={() => setRightPanel(null)} />
            )}
            <aside className={`pb-checklist-panel${checklistOpen ? '' : ' pb-checklist-panel--collapsed'}`}>
              <div className="pb-checklist-header">
                <div>
                  <div className="pb-checklist-title">Builder checklist</div>
                  <div className="pb-checklist-meta">{completedChecklistCount} of {checklistTasks.length} completed</div>
                </div>
                <button type="button" className="pb-checklist-toggle" onClick={() => setChecklistOpen(open => !open)}>
                  {checklistOpen ? 'Hide' : 'Show'}
                </button>
              </div>
              <div className="pb-checklist-progress">
                <div className="pb-checklist-progress-fill" style={{ width: `${(completedChecklistCount / checklistTasks.length) * 100}%` }} />
              </div>
              {checklistOpen && (
                <div className="pb-checklist-tasks">
                  {checklistTasks.map(task => (
                    <div key={task.label} className={`pb-checklist-task${task.completed ? ' pb-checklist-task--done' : ''}`}>
                      <div className="pb-checklist-bullet">
                        {task.completed ? '✓' : '•'}
                      </div>
                      <div className="pb-checklist-task-label">{task.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </aside>
          </div>
        </div>
        {publishedOverlay}
        {showDeleteWarning && (
          <DeleteWarningModal isDeleting={isDeleting} onConfirm={handleConfirmDelete} onCancel={() => setShowDeleteWarning(false)} />
        )}
      </div>
    )
  }

  // Quick setup steps
  const stepProps = { draft, update, onBack: () => { if (phase === 'availability') setPhase('identity') }, onNext: () => {} }

  return (
    <div className="pb-form-shell">
      {header}
      <div className="pb-form-body">
        {phase === 'identity' && (
          <IdentityStep
            {...stepProps}
            onNext={() => setPhase('availability')}
          />
        )}
        {phase === 'availability' && (
          <AvailabilityStep
            {...stepProps}
            onBack={() => setPhase('identity')}
            onNext={() => setPhase('rate')}
          />
        )}
        {phase === 'rate' && (
          <RoleStep
            {...stepProps}
            onBack={() => setPhase('availability')}
            onNext={() => setPhase('work')}
          />
        )}
        {phase === 'work' && (
          <WorkStep
            draft={draft}
            update={update}
            onBack={() => setPhase('rate')}
            onNext={() => { setLeftPanel(null); setRightPanel(null); setPhase('portfolio') }}
          />
        )}
        {phase === 'portfolio' && (
          <PortfolioStep
            draft={draft}
            update={update}
            onBack={() => setPhase('work')}
            onNext={() => setPhase('skills')}
          />
        )}
        {phase === 'skills' && (
          <SkillsStep
            draft={draft}
            update={update}
            onBack={() => setPhase('portfolio')}
            onNext={() => { setLeftPanel(null); setRightPanel(null); setPhase('editor') }}
          />
        )}
      </div>
      {showDeleteWarning && (
        <DeleteWarningModal isDeleting={isDeleting} onConfirm={handleConfirmDelete} onCancel={() => setShowDeleteWarning(false)} />
      )}
    </div>
  )
}
