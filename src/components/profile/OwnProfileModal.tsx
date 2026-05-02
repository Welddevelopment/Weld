'use client'

import { useState, useEffect } from 'react'
import type { PreviewProfile } from '@/components/matching-preview/preview-types'
import SwipeCard, { PanelKind } from '@/components/SwipeCard'
import GamesPanel from '@/components/matching-preview/panels/GamesPanel'
import WorkPanel from '@/components/matching-preview/panels/WorkPanel'
import SkillPanel from '@/components/matching-preview/panels/SkillPanel'

interface Props {
  profile: PreviewProfile
  onClose: () => void
}

export default function OwnProfileModal({ profile, onClose }: Props) {
  const [leftPanel, setLeftPanel] = useState<'games' | null>(null)
  const [rightPanel, setRightPanel] = useState<'work' | { skill: string } | null>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  function handleOpenPanel(panel: PanelKind) {
    if (panel === 'games') {
      setLeftPanel(p => p === 'games' ? null : 'games')
    } else if (panel === 'work') {
      setRightPanel(p => p === 'work' ? null : 'work')
    } else if (typeof panel === 'object' && 'skill' in panel) {
      const current = rightPanel !== null && typeof rightPanel === 'object' && 'skill' in rightPanel && rightPanel.skill === panel.skill
      setRightPanel(current ? null : panel)
    }
  }

  const activeSkillName = rightPanel !== null && typeof rightPanel === 'object' && 'skill' in rightPanel
    ? rightPanel.skill
    : null

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
        {leftPanel === 'games' && (
          <GamesPanel profile={profile} onBack={() => setLeftPanel(null)} />
        )}

        <SwipeCard
          profile={profile}
          leftPanel={leftPanel}
          rightPanel={rightPanel}
          onOpenPanel={handleOpenPanel}
        />

        {rightPanel === 'work' && (
          <WorkPanel profile={profile} onBack={() => setRightPanel(null)} />
        )}
        {activeSkillName && (
          <SkillPanel profile={profile} skillName={activeSkillName} onBack={() => setRightPanel(null)} />
        )}
      </div>
    </div>
  )
}
