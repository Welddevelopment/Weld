'use client'

import { useState, useRef, forwardRef, useImperativeHandle } from 'react'
import Link from 'next/link'

import type { PreviewProfile } from '@/components/matching-preview/preview-types'
import GamesPanel from '@/components/matching-preview/panels/GamesPanel'
import StudioGamesPanel from '@/components/matching-preview/panels/StudioGamesPanel'
import WorkPanel from '@/components/matching-preview/panels/WorkPanel'
import SkillPanel from '@/components/matching-preview/panels/SkillPanel'
import StudioSkillPanel from '@/components/matching-preview/panels/StudioSkillPanel'
import SwipeCard, { type PanelKind } from './SwipeCard'
import StudioCard from './StudioCard'
import { usePanelQueue } from '@/hooks/usePanelQueue'

export type SwipeProfile = PreviewProfile & { userId: string }

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

const SWIPE_THRESHOLD = 100
const CARD_WIDTH = 380
const CARD_HEIGHT = 628 // 560 face + 68 action bar

interface Props {
  profiles: SwipeProfile[]
  onLike: (profile: SwipeProfile) => void
  onPass?: (profile: SwipeProfile) => void
  onMessage?: (profile: SwipeProfile) => void
  disabled?: boolean
}

export interface SwipeStackHandle {
  swipe: (dir: 'left' | 'right', options?: { notify?: boolean }) => void
}

const SwipeStack = forwardRef<SwipeStackHandle, Props>(function SwipeStack(
  { profiles, onLike, onPass, onMessage, disabled = false },
  ref
) {
  const [index, setIndex] = useState(0)
  const [flyDir, setFlyDir] = useState<'left' | 'right' | null>(null)
  const [dragOffset, setDragOffset] = useState(0)
  const [sparks, setSparks] = useState(0)
  const [likeFlash, setLikeFlash] = useState(false)
  const [panelsCollapsing, setPanelsCollapsing] = useState(false)
  const { slot0, slot1, panelOpen, openPanel, closePanel, clearPanels, leftPanelActive, rightPanelActive } = usePanelQueue()

  const isDragging = useRef(false)
  const startX = useRef(0)
  const didDrag = useRef(false)
  const swipeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const flyDirRef = useRef<'left' | 'right' | null>(null)
  const likeFlashTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const current = profiles[index]
  const next = profiles[index + 1]
  const remaining = profiles.length - index


  const triggerSwipe = (dir: 'left' | 'right', notify = true) => {
    if (disabled || flyDirRef.current) return
    if (swipeTimeout.current) clearTimeout(swipeTimeout.current)

    const profile = profiles[index]
    flyDirRef.current = dir
    setDragOffset(0)
    setFlyDir(dir)
    clearPanels()

    swipeTimeout.current = setTimeout(() => {
      swipeTimeout.current = null
      flyDirRef.current = null
      setIndex(i => i + 1)
      setFlyDir(null)
      if (notify) {
        if (dir === 'right') { setSparks(s => s + 1); onLike(profile) }
        else onPass?.(profile)
      }
    }, 220)
  }

  const handleCardLike = () => {
    if (flyDirRef.current || likeFlash) return
    if (likeFlashTimeout.current) clearTimeout(likeFlashTimeout.current)
    setLikeFlash(true)
    likeFlashTimeout.current = setTimeout(() => {
      setLikeFlash(false)
      triggerSwipe('right')
    }, 600)
  }

  const collapseAndAct = (action: () => void) => {
    if (!panelOpen) { action(); return }
    setPanelsCollapsing(true)
    setTimeout(() => {
      clearPanels()
      setPanelsCollapsing(false)
      action()
    }, 200)
  }

  useImperativeHandle(ref, () => ({
    swipe: (dir, options) => triggerSwipe(dir, options?.notify ?? true),
  }))

  const onDragStart = (clientX: number) => {
    if (disabled || flyDirRef.current || likeFlash || panelOpen) return
    isDragging.current = true
    didDrag.current = false
    startX.current = clientX
  }

  const onDragMove = (clientX: number) => {
    if (!isDragging.current) return
    const offset = clientX - startX.current
    if (Math.abs(offset) > 5) didDrag.current = true
    setDragOffset(offset)
  }

  const onDragEnd = () => {
    if (!isDragging.current) return
    isDragging.current = false
    if (!didDrag.current) { setDragOffset(0); return }
    if (dragOffset > SWIPE_THRESHOLD) triggerSwipe('right')
    else if (dragOffset < -SWIPE_THRESHOLD) triggerSwipe('left')
    else setDragOffset(0)
  }

  const viewAgain = () => {
    if (swipeTimeout.current) clearTimeout(swipeTimeout.current)
    if (likeFlashTimeout.current) clearTimeout(likeFlashTimeout.current)
    swipeTimeout.current = null
    likeFlashTimeout.current = null
    flyDirRef.current = null
    isDragging.current = false
    didDrag.current = false
    setDragOffset(0)
    setFlyDir(null)
    setLikeFlash(false)
    setIndex(0)
    clearPanels()
  }

  if (!current) {
    return (
      <div className="flex flex-col items-center gap-5 text-center">
        <div>
          <p className="font-mono text-sm uppercase tracking-[0.16em]" style={{ color: 'rgba(255,247,241,.4)' }}>
            You&apos;ve seen everyone for now
          </p>
          {sparks > 0 && (
            <p className="mt-2 font-mono text-xs text-white/30">
              {sparks} like{sparks !== 1 ? 's' : ''} sent — see who liked you back on your home page.
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={viewAgain}
            className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.13em] text-white/55 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white/80"
          >
            View again
          </button>
          {sparks > 0 && (
            <Link
              href="/home"
              className="rounded-full border border-white/15 bg-white/[0.06] px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.13em] text-white/70 transition hover:border-white/25 hover:bg-white/[0.10] hover:text-white/90"
            >
              See activity →
            </Link>
          )}
        </div>
      </div>
    )
  }

  const dragProgress = Math.min(Math.abs(dragOffset) / SWIPE_THRESHOLD, 1)
  const rotation = dragOffset * 0.07
  const dragOverlay: 'like' | 'nope' | null =
    dragOffset > 10 ? 'like' : dragOffset < -10 ? 'nope' : null

  const frontStyle = flyDir
    ? undefined
    : { transform: `translateX(${dragOffset}px) rotate(${rotation}deg)` }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-3 text-xs text-gray-500">
        <span>{remaining} of {profiles.length}</span>
        <span>·</span>
        <span className="text-green-400 font-medium">⚡ {sparks} spark{sparks !== 1 ? 's' : ''}</span>
      </div>

      <div className="npc-stack-row">
        {/* Left panel slot */}
        {slot0 && (
          <div className={panelsCollapsing ? 'npc-panel-slot--out-left' : ''}>
            {renderPanel(slot0, current, () => closePanel(0))}
          </div>
        )}

        {/* Card drag container */}
        <div
          className="relative"
          style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
          onMouseMove={e => { if (isDragging.current) onDragMove(e.clientX) }}
          onMouseUp={onDragEnd}
          onMouseLeave={onDragEnd}
        >
          {/* Back card */}
          {next && (
            <div
              className="absolute top-0 left-0 pointer-events-none"
              style={{
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
                overflow: 'hidden',
                transform: `scale(${flyDir ? 1 : 0.94})`,
                transformOrigin: 'top center',
                transition: flyDir ? 'transform 220ms ease-out' : 'none',
              }}
            >
              <SwipeCard profile={next} />
            </div>
          )}

          {/* Front card */}
          <div
            className={`absolute top-0 left-0 ${panelOpen ? '' : 'cursor-grab active:cursor-grabbing'}
              ${flyDir ? 'transition-[transform,opacity] duration-200' : ''}
              ${flyDir === 'left' ? '-translate-x-[200px] -rotate-[12deg] opacity-0' : ''}
              ${flyDir === 'right' ? 'translate-x-[200px] rotate-[12deg] opacity-0' : ''}
            `}
            style={frontStyle}
            onMouseDown={e => { if (!panelOpen) { e.preventDefault(); onDragStart(e.clientX) } }}
            onTouchStart={e => { if (!panelOpen) onDragStart(e.touches[0].clientX) }}
            onTouchMove={e => { e.preventDefault(); onDragMove(e.touches[0].clientX) }}
            onTouchEnd={onDragEnd}
          >
            {current.type === 'studio' ? (
              <StudioCard
                profile={current}
                dragOverlay={likeFlash ? 'like' : dragOverlay}
                dragOpacity={likeFlash ? 1 : dragProgress}
                activePanels={[slot0, slot1].filter((p): p is PanelKind => p !== null)}
                onPass={() => collapseAndAct(() => triggerSwipe('left'))}
                onLike={() => collapseAndAct(handleCardLike)}
                onMessage={() => collapseAndAct(() => onMessage?.(current))}
                onOpenPanel={openPanel}
              />
            ) : (
              <SwipeCard
                profile={current}
                dragOverlay={likeFlash ? 'like' : dragOverlay}
                dragOpacity={likeFlash ? 1 : dragProgress}
                leftPanel={leftPanelActive}
                rightPanel={rightPanelActive}
                onPass={() => collapseAndAct(() => triggerSwipe('left'))}
                onLike={() => collapseAndAct(handleCardLike)}
                onMessage={() => collapseAndAct(() => onMessage?.(current))}
                onOpenPanel={openPanel}
              />
            )}
          </div>
        </div>

        {/* Right panel slot */}
        {slot1 && (
          <div className={panelsCollapsing ? 'npc-panel-slot--out-right' : ''}>
            {renderPanel(slot1, current, () => closePanel(1))}
          </div>
        )}
      </div>
    </div>
  )
})

export default SwipeStack
