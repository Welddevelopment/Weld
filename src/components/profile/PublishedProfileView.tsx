'use client'

import { useState } from 'react'

import SwipeCard, { type PanelKind } from '@/components/SwipeCard'
import StudioCard from '@/components/StudioCard'
import GamesPanel from '@/components/matching-preview/panels/GamesPanel'
import WorkPanel from '@/components/matching-preview/panels/WorkPanel'
import SkillPanel from '@/components/matching-preview/panels/SkillPanel'
import StudioGamesPanel from '@/components/matching-preview/panels/StudioGamesPanel'
import StudioSkillPanel from '@/components/matching-preview/panels/StudioSkillPanel'
import type { PreviewProfile } from '@/components/matching-preview/preview-types'
import { usePanelQueue } from '@/hooks/usePanelQueue'

type EditStart = 'editor' | 'onboarding'

interface Props {
  profile: PreviewProfile
  onEdit: (start: EditStart) => void
  onDelete: () => Promise<void>
}

function EditChoiceModal({
  profileType,
  onChoose,
  onCancel,
}: {
  profileType: PreviewProfile['type']
  onChoose: (start: EditStart) => void
  onCancel: () => void
}) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 480,
        background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      }}
      onClick={onCancel}
    >
      <div
        style={{
          width: '100%', maxWidth: 420, borderRadius: 22,
          border: '1px solid rgba(255,255,255,0.12)',
          background: '#141211', padding: 24,
          boxShadow: '0 24px 80px rgba(0,0,0,0.42)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <p style={{ margin: '0 0 8px', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.42)' }}>
          Edit {profileType === 'studio' ? 'studio' : 'developer'} profile
        </p>
        <h2 style={{ margin: '0 0 10px', fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 28, color: '#FFF7F1' }}>
          How do you want to edit?
        </h2>
        <p style={{ margin: '0 0 22px', fontSize: 14, lineHeight: 1.65, color: 'rgba(255,255,255,0.52)' }}>
          Jump into the card editor for quick changes, or walk through onboarding again with your existing answers filled in.
        </p>
        <div style={{ display: 'grid', gap: 10 }}>
          <button
            type="button"
            onClick={() => onChoose('editor')}
            style={{
              width: '100%', border: '1px solid rgba(232,70,36,0.48)',
              background: 'rgba(232,70,36,0.14)', color: '#FFB49F',
              borderRadius: 14, padding: '13px 16px', cursor: 'pointer',
              fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
            }}
          >
            Continue to inline editor
          </button>
          <button
            type="button"
            onClick={() => onChoose('onboarding')}
            style={{
              width: '100%', border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.76)',
              borderRadius: 14, padding: '13px 16px', cursor: 'pointer',
              fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
            }}
          >
            Redo onboarding
          </button>
          <button
            type="button"
            onClick={onCancel}
            style={{
              width: '100%', border: 'none', background: 'transparent',
              color: 'rgba(255,255,255,0.34)', padding: '7px 16px', cursor: 'pointer',
              fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

function DeleteWarningModal({
  isDeleting,
  onConfirm,
  onCancel,
}: {
  isDeleting: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
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
          Delete your profile?
        </h2>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.48)', lineHeight: 1.65, marginBottom: 28, marginTop: 0 }}>
          Your profile will be removed from the swipe pool immediately and your draft will be cleared. This cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button
            onClick={onCancel}
            disabled={isDeleting}
            style={{
              padding: '10px 22px', borderRadius: 999,
              border: '1.5px solid rgba(255,255,255,0.14)',
              background: 'transparent', color: 'rgba(255,255,255,0.65)',
              fontFamily: 'var(--font-mono)', fontSize: 11,
              letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            style={{
              padding: '10px 22px', borderRadius: 999,
              border: '1.5px solid #E84624',
              background: 'rgba(232,70,36,0.12)', color: '#E84624',
              fontFamily: 'var(--font-mono)', fontSize: 11,
              letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
            }}
          >
            {isDeleting ? 'Deleting…' : 'Delete profile'}
          </button>
        </div>
      </div>
    </div>
  )
}

function renderPanel(panel: PanelKind, profile: PreviewProfile, onBack: () => void) {
  if (panel === 'games') {
    return profile.type === 'studio'
      ? <StudioGamesPanel key="studio-games" profile={profile} onBack={onBack} />
      : <GamesPanel key="games" profile={profile} onBack={onBack} />
  }
  if (panel === 'work') return <WorkPanel key="work" profile={profile} onBack={onBack} />
  if (typeof panel === 'object' && 'skill' in panel) {
    return profile.type === 'studio'
      ? <StudioSkillPanel key={`studio-skill-${panel.skill}`} profile={profile} skillName={panel.skill} initialRole={panel.role} onBack={onBack} />
      : <SkillPanel key={`skill-${panel.skill}`} profile={profile} skillName={panel.skill} onBack={onBack} />
  }
  return null
}

export default function PublishedProfileView({ profile, onEdit, onDelete }: Props) {
  const [showEditChoice, setShowEditChoice] = useState(false)
  const [showDeleteWarning, setShowDeleteWarning] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { slot0, slot1, openPanel, closePanel, leftPanelActive, rightPanelActive } = usePanelQueue()

  const handleConfirmDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete()
    } catch {
      setIsDeleting(false)
    }
  }

  const activePanels = [slot0, slot1].filter((p): p is PanelKind => p !== null)

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 py-16">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[rgba(8,24,39,0.5)]">
          Live — you&apos;re in the swipe pool
        </span>
      </div>

      <div className="npc-stack-row" style={{ alignItems: 'flex-start' }}>
        {slot0 && renderPanel(slot0, profile, () => closePanel(0))}

        {profile.type === 'studio' ? (
          <StudioCard
            profile={profile}
            activePanels={activePanels}
            onOpenPanel={openPanel}
          />
        ) : (
          <SwipeCard
            profile={profile}
            leftPanel={leftPanelActive}
            rightPanel={rightPanelActive}
            onOpenPanel={openPanel}
          />
        )}

        {slot1 && renderPanel(slot1, profile, () => closePanel(1))}
      </div>

      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={() => setShowEditChoice(true)}
          className="font-mono text-[10px] uppercase tracking-[0.13em] text-[rgba(8,24,39,0.42)] transition hover:text-[#081827]"
        >
          Edit profile →
        </button>
        <button
          type="button"
          onClick={() => setShowDeleteWarning(true)}
          className="font-mono text-[10px] uppercase tracking-[0.13em] text-red-400/60 transition hover:text-red-500"
        >
          Delete profile
        </button>
      </div>

      {showEditChoice && (
        <EditChoiceModal
          profileType={profile.type}
          onChoose={start => { setShowEditChoice(false); onEdit(start) }}
          onCancel={() => setShowEditChoice(false)}
        />
      )}

      {showDeleteWarning && (
        <DeleteWarningModal
          isDeleting={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteWarning(false)}
        />
      )}
    </div>
  )
}
