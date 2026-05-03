'use client'

import { useEffect } from 'react'
import type { PreviewProfile } from '@/components/matching-preview/preview-types'
import SwipeCard, { PanelKind } from '@/components/SwipeCard'
import StudioCard from '@/components/StudioCard'
import GamesPanel from '@/components/matching-preview/panels/GamesPanel'
import StudioGamesPanel from '@/components/matching-preview/panels/StudioGamesPanel'
import WorkPanel from '@/components/matching-preview/panels/WorkPanel'
import SkillPanel from '@/components/matching-preview/panels/SkillPanel'
import StudioSkillPanel from '@/components/matching-preview/panels/StudioSkillPanel'
import { usePanelQueue } from '@/hooks/usePanelQueue'

interface Props {
  profile: PreviewProfile
  onClose: () => void
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

export default function OwnProfileModal({ profile, onClose }: Props) {
  const { slot0, slot1, openPanel, closePanel, leftPanelActive, rightPanelActive } = usePanelQueue()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 400,
        background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
      onClick={onClose}
    >
      <button
        onClick={e => { e.stopPropagation(); onClose() }}
        style={{
          position: 'fixed', top: 20, right: 20,
          width: 36, height: 36, borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)', border: 'none',
          color: '#fff', fontSize: 16, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >✕</button>

      <div className="npc-stack-row" style={{ alignItems: 'flex-start' }} onClick={e => e.stopPropagation()}>
        {slot0 && renderPanel(slot0, profile, () => closePanel(0))}

        {profile.type === 'studio' ? (
          <StudioCard
            profile={profile}
            activePanels={[slot0, slot1].filter((p): p is PanelKind => p !== null)}
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
    </div>
  )
}
