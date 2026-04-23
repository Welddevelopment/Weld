'use client'

import { useState, useRef, useCallback } from 'react'
import { PreviewProfile } from './preview-types'
import PreviewCard from './PreviewCard'

interface Props {
  profiles: PreviewProfile[]
  onOpen: (profileId: string) => void
}

const STACK_STYLES = [
  { scale: 0.92, x: -6, y: -2, opacity: 0.25, z: 1 },
  { scale: 0.93, x: -4, y: -4, opacity: 0.32, z: 2 },
  { scale: 0.94, x: -2, y: -6, opacity: 0.40, z: 3 },
  { scale: 0.95, x:  0, y: -8, opacity: 0.50, z: 4 },
  { scale: 0.96, x:  2, y:-10, opacity: 0.62, z: 5 },
  { scale: 0.97, x:  3, y:-12, opacity: 0.75, z: 6 },
  { scale: 0.98, x:  4, y:-14, opacity: 0.88, z: 7 },
  { scale: 1.00, x:  5, y:-16, opacity: 1.00, z: 8 },
]

const SHUFFLE_ANIMATIONS = [
  'previewShuffleBg 2.8s cubic-bezier(0.4,0,0.2,1) forwards',
  'previewShuffleBg 2.8s cubic-bezier(0.4,0,0.2,1) 0.04s forwards',
  'previewShuffleMid 2.8s cubic-bezier(0.4,0,0.2,1) forwards',
  'previewShuffleMid 2.8s cubic-bezier(0.4,0,0.2,1) 0.04s forwards',
  'previewShuffleCycleA 2.8s cubic-bezier(0.4,0,0.2,1) forwards',
  'previewShuffleCycleB 2.8s cubic-bezier(0.4,0,0.2,1) forwards',
  'previewShuffleCycleC 2.8s cubic-bezier(0.4,0,0.2,1) forwards',
  'previewShuffleWinner 2.8s cubic-bezier(0.4,0,0.2,1) forwards',
]

export default function PreviewStack({ profiles, onOpen }: Props) {
  const [shuffling, setShuffling] = useState(false)
  const [winnerIdx, setWinnerIdx] = useState<number | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const visible = profiles.slice(0, 8)
  const cards = visible.length < 8
    ? Array.from({ length: 8 }, (_, i) => visible[i % visible.length])
    : visible

  const triggerShuffle = useCallback(() => {
    if (shuffling) return
    const idx = Math.floor(Math.random() * profiles.length)
    setWinnerIdx(idx)
    setShuffling(true)

    timerRef.current = setTimeout(() => {
      setShuffling(false)
      setWinnerIdx(null)
      onOpen(profiles[idx].id)
    }, 3000)
  }, [shuffling, profiles, onOpen])

  return (
    <>
      <style>{`
        @keyframes previewShuffleBg {
          0% { transform: translateY(-2px) translateX(-6px) scale(0.92); opacity: 0.25; }
          50% { transform: translateY(-10px) translateX(-14px) rotate(-8deg) scale(0.90); opacity: 0.15; }
          100% { transform: translateY(-2px) translateX(-6px) scale(0.92); opacity: 0.25; }
        }
        @keyframes previewShuffleMid {
          0% { opacity: 0.40; }
          35% { transform: translateY(-18px) translateX(12px) rotate(6deg) scale(0.99); opacity: 0.65; }
          100% { opacity: 0.40; }
        }
        @keyframes previewShuffleCycleA {
          0% { transform: translateY(-10px) translateX(2px) scale(0.96); }
          40% { transform: translateY(-30px) translateX(-18px) rotate(-12deg) scale(1.02); }
          100% { transform: translateY(-10px) translateX(2px) scale(0.96); }
        }
        @keyframes previewShuffleCycleB {
          0% { transform: translateY(-12px) translateX(3px) scale(0.97); }
          45% { transform: translateY(-36px) translateX(24px) rotate(11deg) scale(1.03); }
          100% { transform: translateY(-12px) translateX(3px) scale(0.97); }
        }
        @keyframes previewShuffleCycleC {
          0% { transform: translateY(-14px) translateX(4px) scale(0.98); }
          50% { transform: translateY(-44px) translateX(-10px) rotate(-7deg) scale(1.05); }
          100% { transform: translateY(-14px) translateX(4px) scale(0.98); }
        }
        @keyframes previewShuffleWinner {
          0% { transform: translateY(-16px) translateX(5px) scale(1); box-shadow: 0 8px 28px rgba(232,70,36,0.18); }
          38% { transform: translateY(-54px) translateX(8px) rotate(3deg) scale(1.08); box-shadow: 0 18px 50px rgba(232,70,36,0.30); }
          70% { transform: translateY(-18px) translateX(6px) scale(1.01); }
          100% { transform: translateY(-16px) translateX(5px) scale(1); box-shadow: 0 8px 28px rgba(232,70,36,0.18); }
        }
        .preview-front-card:hover {
          transform: translateY(-24px) translateX(5px) scale(1.02) !important;
          box-shadow: 0 16px 40px rgba(232,70,36,0.28) !important;
        }
      `}</style>

      <div className="flex flex-col items-center gap-5">
        {/* Fan stack */}
        <div style={{ position: 'relative', width: 200, height: 420 }}>
          {cards.map((profile, i) => {
            const s = STACK_STYLES[i]
            const isTop = i === 7
            const isWinner = shuffling && winnerIdx !== null && profiles[winnerIdx % 8 === i ? i : -1] !== undefined

            const baseTransform = `translateY(${s.y}px) translateX(${s.x}px) scale(${s.scale})`
            const animation = shuffling ? (isTop && winnerIdx !== null ? SHUFFLE_ANIMATIONS[7] : SHUFFLE_ANIMATIONS[i]) : undefined

            return (
              <div
                key={i}
                className={isTop && !shuffling ? 'preview-front-card' : ''}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: 200,
                  height: 340,
                  transform: animation ? undefined : baseTransform,
                  transformOrigin: 'center bottom',
                  transition: animation ? undefined : 'transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s ease',
                  opacity: s.opacity,
                  zIndex: s.z,
                  borderRadius: 18,
                  overflow: 'hidden',
                  boxShadow: isTop ? '0 8px 28px rgba(232,70,36,0.18)' : `0 ${2 + i}px ${8 + i * 3}px rgba(232,70,36,${0.04 + i * 0.01})`,
                  animation: animation,
                  cursor: isTop ? 'pointer' : 'default',
                  pointerEvents: isTop ? 'auto' : 'none',
                }}
                onClick={isTop ? triggerShuffle : undefined}
              >
                <PreviewCard profile={profile} compact />
              </div>
            )
          })}
        </div>

        {/* CTA button */}
        <button
          onClick={triggerShuffle}
          disabled={shuffling}
          className="px-5 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all hover:-translate-y-px active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            border: '1px solid rgba(255,247,241,.14)',
            background: 'rgba(255,247,241,.04)',
            color: 'rgba(255,247,241,.86)',
          }}
        >
          {shuffling ? 'Finding a match…' : 'Open preview'}
        </button>
      </div>
    </>
  )
}
