'use client'

import { useState, useRef, forwardRef, useImperativeHandle } from 'react'
import ProfileCard from './ProfileCard'
import { Profile } from '@/lib/types'

const SWIPE_THRESHOLD = 100

interface Props {
  profiles: Profile[]
  onLike: (profile: Profile) => void
  onPass?: (profile: Profile) => void
  onCardClick: (profile: Profile) => void
}

export interface SwipeStackHandle {
  swipe: (dir: 'left' | 'right') => void
}

const SwipeStack = forwardRef<SwipeStackHandle, Props>(function SwipeStack(
  { profiles, onLike, onPass, onCardClick },
  ref
) {
  const [index, setIndex] = useState(0)
  const [flyDir, setFlyDir] = useState<'left' | 'right' | null>(null)
  const [dragOffset, setDragOffset] = useState(0)
  const [sparks, setSparks] = useState(0)

  const isDragging = useRef(false)
  const startX = useRef(0)
  const didDrag = useRef(false)
  const swipeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const flyDirRef = useRef<'left' | 'right' | null>(null)

  const current = profiles[index]
  const next = profiles[index + 1]
  const remaining = profiles.length - index

  const triggerSwipe = (dir: 'left' | 'right') => {
    if (flyDirRef.current) return
    if (swipeTimeout.current) clearTimeout(swipeTimeout.current)

    const profile = profiles[index]
    flyDirRef.current = dir
    setDragOffset(0)
    setFlyDir(dir)

    swipeTimeout.current = setTimeout(() => {
      swipeTimeout.current = null
      flyDirRef.current = null
      setIndex(i => i + 1)
      setFlyDir(null)
      if (dir === 'right') {
        setSparks(s => s + 1)
        onLike(profile)
      } else {
        onPass?.(profile)
      }
    }, 220)
  }

  useImperativeHandle(ref, () => ({ swipe: triggerSwipe }))

  const onDragStart = (clientX: number) => {
    if (flyDirRef.current) return
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
    if (!didDrag.current) {
      onCardClick(profiles[index])
      setDragOffset(0)
      return
    }
    if (dragOffset > SWIPE_THRESHOLD) {
      triggerSwipe('right')
    } else if (dragOffset < -SWIPE_THRESHOLD) {
      triggerSwipe('left')
    } else {
      setDragOffset(0)
    }
  }

  if (!current) {
    return (
      <div className="text-center">
        <p className="text-xl font-bold text-white">You've seen everyone</p>
        <p className="text-sm text-gray-500 mt-1">Check back soon for new talent</p>
        {sparks > 0 && (
          <p className="text-sm text-green-400 mt-3 font-medium">
            ⚡ {sparks} spark{sparks > 1 ? 's' : ''} made
          </p>
        )}
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

      <div
        className="relative"
        style={{ width: 340, height: 520 }}
        onMouseMove={e => { if (isDragging.current) onDragMove(e.clientX) }}
        onMouseUp={onDragEnd}
        onMouseLeave={onDragEnd}
      >
        {next && (
          <div
            className="absolute top-0 left-0 pointer-events-none"
            style={{
              width: 340,
              height: 520,
              overflow: 'hidden',
              transform: `scale(${flyDir ? 1 : 0.94})`,
              transformOrigin: 'top center',
              transition: flyDir ? 'transform 220ms ease-out' : 'none',
            }}
          >
            <ProfileCard profile={next} />
          </div>
        )}

        <div
          className={`absolute top-0 left-0 cursor-grab active:cursor-grabbing
            ${flyDir ? 'transition-[transform,opacity] duration-200' : ''}
            ${flyDir === 'left' ? '-translate-x-[200px] -rotate-[12deg] opacity-0' : ''}
            ${flyDir === 'right' ? 'translate-x-[200px] rotate-[12deg] opacity-0' : ''}
          `}
          style={frontStyle}
          onMouseDown={e => { e.preventDefault(); onDragStart(e.clientX) }}
          onTouchStart={e => onDragStart(e.touches[0].clientX)}
          onTouchMove={e => { e.preventDefault(); onDragMove(e.touches[0].clientX) }}
          onTouchEnd={onDragEnd}
        >
          <ProfileCard
            profile={current}
            dragOverlay={dragOverlay}
            dragOpacity={dragProgress}
            onPass={() => triggerSwipe('left')}
            onLike={() => triggerSwipe('right')}
            onViewProfile={() => onCardClick(current)}
          />
        </div>
      </div>

      <p className="text-[11px] text-gray-600">tap card to view full profile</p>
    </div>
  )
})

export default SwipeStack
