'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { PreviewProfile } from './preview-types'
import { LeftAuxPanel, RightAuxPanel } from './PreviewAuxPanel'

interface Props {
  profiles: PreviewProfile[]
  initialId: string
  onClose: () => void
  onPassed: (id: string) => void
  onLiked: (id: string) => void
}

type InteractionState = 'idle' | 'like-glow' | 'pass-glow' | 'match-overlay' | 'pass-overlay'

function getInitials(name: string) {
  return name.replace(/[^a-zA-Z ]/g, '').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || name.slice(0, 2).toUpperCase()
}

function wrap(i: number, len: number) {
  return ((i % len) + len) % len
}

export default function PreviewExpandedModal({ profiles, initialId, onClose, onPassed, onLiked }: Props) {
  const [activeIdx, setActiveIdx] = useState(() => Math.max(0, profiles.findIndex(p => p.id === initialId)))
  const [interaction, setInteraction] = useState<InteractionState>('idle')
  const busyRef = useRef(false)

  const n = profiles.length
  const profile = profiles[activeIdx]

  const navigate = useCallback((dir: -1 | 1) => {
    if (busyRef.current || n <= 1 || interaction !== 'idle') return
    setActiveIdx(i => wrap(i + dir, n))
  }, [n, interaction])

  const handleLike = useCallback(() => {
    if (busyRef.current) return
    busyRef.current = true
    setInteraction('like-glow')
    setTimeout(() => {
      setInteraction('match-overlay')
      busyRef.current = false
    }, 460)
  }, [])

  const handlePass = useCallback(() => {
    if (busyRef.current) return
    busyRef.current = true
    setInteraction('pass-glow')
    setTimeout(() => {
      setInteraction('pass-overlay')
      busyRef.current = false
    }, 1750)
  }, [])

  const advanceAfterLike = useCallback(() => {
    onLiked(profile.id)
  }, [profile.id, onLiked])

  const advanceAfterPass = useCallback(() => {
    onPassed(profile.id)
  }, [profile.id, onPassed])

  useEffect(() => {
    setInteraction('idle')
    busyRef.current = false
  }, [activeIdx])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') navigate(1)
      if (e.key === 'ArrowLeft') navigate(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, navigate])

  const centerBoxShadow =
    interaction === 'like-glow' || interaction === 'match-overlay'
      ? '0 0 0 4px rgba(61,199,122,0.6), 0 0 50px rgba(61,199,122,0.35)'
      : interaction === 'pass-glow' || interaction === 'pass-overlay'
      ? '0 0 0 4px rgba(232,70,36,0.55), 0 0 50px rgba(232,70,36,0.3)'
      : '0 24px 80px rgba(0,0,0,0.55)'

  return (
    <>
      <style>{`
        @keyframes mpGlowLike {
          0% { box-shadow: 0 24px 80px rgba(0,0,0,0.55); }
          15% { box-shadow: 0 0 0 5px rgba(61,199,122,0.7), 0 0 40px rgba(61,199,122,0.55), 0 0 80px rgba(61,199,122,0.3); }
          65% { box-shadow: 0 0 0 4px rgba(61,199,122,0.5), 0 0 40px rgba(61,199,122,0.35); }
          100% { box-shadow: 0 0 0 3px rgba(61,199,122,0.3), 0 0 24px rgba(61,199,122,0.2); }
        }
        @keyframes mpGlowPass {
          0% { box-shadow: 0 24px 80px rgba(0,0,0,0.55); }
          20% { box-shadow: 0 0 0 4px rgba(232,70,36,0.65), 0 0 50px rgba(232,70,36,0.45), 0 0 100px rgba(232,70,36,0.25); }
          75% { box-shadow: 0 0 0 3px rgba(232,70,36,0.35), 0 0 30px rgba(232,70,36,0.25); }
          100% { box-shadow: 0 0 0 2px rgba(232,70,36,0.15), 0 0 20px rgba(232,70,36,0.1); }
        }
        @keyframes mpOverlayIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes mpChatPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(61,199,122,0.45); }
          50% { box-shadow: 0 0 0 8px rgba(61,199,122,0.08); }
        }
        @keyframes mpModalIn {
          from { opacity: 0; transform: scale(0.97) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
        style={{ background: 'rgba(14,12,9,0.82)', backdropFilter: 'blur(8px)' }}
        onClick={e => { if (e.target === e.currentTarget) onClose() }}
      >
        <div
          className="flex rounded-2xl overflow-hidden"
          style={{
            maxHeight: '90vh',
            width: '100%',
            maxWidth: 1160,
            animation: 'mpModalIn 0.22s cubic-bezier(0.4,0,0.2,1)',
            boxShadow: '0 32px 100px rgba(0,0,0,0.6)',
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Left aux panel */}
          <div className="hidden lg:block flex-shrink-0 overflow-y-auto" style={{ width: 300 }}>
            <LeftAuxPanel profile={profile} />
          </div>

          {/* Center card */}
          <div
            className="flex flex-col flex-shrink-0 relative overflow-hidden"
            style={{
              width: 420,
              minWidth: 320,
              flex: '1 0 320px',
              maxWidth: 500,
              background: 'linear-gradient(180deg, #1A1714 0%, #0D0B08 100%)',
              transition: 'box-shadow 0.3s ease',
              boxShadow: centerBoxShadow,
              animation:
                interaction === 'like-glow' ? 'mpGlowLike 1.1s cubic-bezier(0.4,0,0.2,1) forwards'
                : interaction === 'pass-glow' ? 'mpGlowPass 1.75s cubic-bezier(0.4,0,0.2,1) forwards'
                : undefined,
            }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full flex items-center justify-center text-sm transition-opacity hover:opacity-70"
              style={{ background: 'rgba(0,0,0,0.4)', color: 'rgba(255,247,241,.8)' }}
            >
              ✕
            </button>

            {/* Nav arrows (visible if multiple profiles) */}
            {n > 1 && interaction === 'idle' && (
              <>
                <button
                  onClick={() => navigate(-1)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full flex items-center justify-center transition-opacity hover:opacity-80"
                  style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,247,241,.6)' }}
                >
                  ‹
                </button>
                <button
                  onClick={() => navigate(1)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full flex items-center justify-center transition-opacity hover:opacity-80"
                  style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,247,241,.6)' }}
                >
                  ›
                </button>
              </>
            )}

            {/* Scrollable face */}
            <div className="flex-1 overflow-y-auto" style={{ paddingBottom: 80 }}>
              {/* Header */}
              <div
                className="relative flex items-center justify-center flex-shrink-0"
                style={{ height: 120, background: profile.headerGradient }}
              >
                <div
                  className="absolute -bottom-7 left-1/2 -translate-x-1/2 flex items-center justify-center rounded-full font-bold text-white text-xl z-10"
                  style={{
                    width: 56,
                    height: 56,
                    background: 'rgba(255,255,255,0.2)',
                    border: '3px solid #1A1714',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  {getInitials(profile.name)}
                </div>
              </div>

              {/* Body */}
              <div className="px-6 pt-10 pb-5">
                {/* Badge */}
                <div className="flex justify-center mb-3">
                  <span
                    className="text-[10px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full"
                    style={{ background: 'rgba(255,250,247,.08)', color: 'rgba(255,247,241,.5)', border: '1px solid rgba(255,250,247,.1)' }}
                  >
                    {profile.badge}
                  </span>
                </div>

                {/* Name */}
                <h2
                  className="text-[#FFF7F1] text-3xl italic leading-tight text-center mb-1"
                  style={{ fontFamily: 'var(--font-instrument-serif)' }}
                >
                  {profile.name}
                </h2>
                <p className="text-center text-sm mb-4" style={{ color: 'rgba(255,247,241,.5)' }}>
                  {profile.roleLine}
                </p>

                {/* Bio */}
                <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(255,247,241,.7)' }}>
                  {profile.bio}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {profile.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-sm px-3 py-1 rounded-full"
                      style={{ background: 'rgba(255,250,247,.08)', color: 'rgba(255,247,241,.7)', border: '1px solid rgba(255,250,247,.1)' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Status */}
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#3DC77A' }} />
                  <span className="text-sm" style={{ color: 'rgba(255,247,241,.6)' }}>{profile.status}</span>
                </div>
              </div>
            </div>

            {/* Action bar */}
            <div
              className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-8 py-5"
              style={{ background: 'linear-gradient(0deg, #0D0B08 65%, transparent)', zIndex: 10 }}
            >
              <button
                onClick={handlePass}
                className="w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
                style={{ border: '2px solid #E84624', color: '#E84624' }}
                title="Pass"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
              <button
                onClick={handleLike}
                className="w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
                style={{ border: '2px solid #3DC77A', color: '#3DC77A' }}
                title="Like"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>

            {/* Match overlay */}
            {interaction === 'match-overlay' && (
              <div
                className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-5 px-6"
                style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', animation: 'mpOverlayIn 0.35s cubic-bezier(0.34,1.56,0.64,1)' }}
              >
                <p className="text-3xl font-bold text-center" style={{ color: '#1a6640', fontFamily: 'var(--font-instrument-serif)' }}>
                  💚 You sparked!
                </p>
                <p className="text-sm text-center" style={{ color: 'rgba(26,102,64,0.7)' }}>
                  We'll let you know when it's a match.
                </p>
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ border: '2.5px solid #3DC77A', color: '#3DC77A', background: 'rgba(61,199,122,.08)', animation: 'mpChatPulse 2s 0.5s ease-in-out infinite' }}
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <button
                  onClick={advanceAfterLike}
                  className="px-7 py-2.5 rounded-full text-sm font-semibold transition-all hover:scale-105 active:scale-95"
                  style={{ border: '2px solid rgba(61,199,122,.5)', color: '#1a6640' }}
                >
                  Keep matching →
                </button>
              </div>
            )}

            {/* Pass overlay */}
            {interaction === 'pass-overlay' && (
              <div
                className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 px-6"
                style={{ background: 'rgba(255,245,240,0.1)', backdropFilter: 'blur(20px)', animation: 'mpOverlayIn 0.35s cubic-bezier(0.34,1.56,0.64,1)' }}
              >
                <span className="text-4xl">👋</span>
                <p className="text-2xl font-bold text-center" style={{ color: '#8B2010', fontFamily: 'var(--font-instrument-serif)' }}>
                  You passed on {profile.name}
                </p>
                <p className="text-xs text-center" style={{ color: 'rgba(139,32,16,.55)' }}>
                  Help us improve — why wasn't it a fit?
                </p>
                <select
                  className="w-full rounded-xl px-3 py-2.5 text-sm appearance-none outline-none"
                  style={{ border: '2px solid rgba(232,70,36,.3)', background: '#1A1714', color: 'rgba(255,247,241,.8)' }}
                  defaultValue=""
                >
                  <option value="" disabled>Select a reason…</option>
                  {profile.type === 'dev' ? <>
                    <option value="not-enough-exp">Not enough experience</option>
                    <option value="wrong-skills">Skills don't match what I need</option>
                    <option value="portfolio-quality">Portfolio quality</option>
                    <option value="rate-too-high">Rate is too high</option>
                    <option value="availability">Availability doesn't work</option>
                    <option value="just-browsing">Just browsing</option>
                  </> : <>
                    <option value="team-too-small">Team is too small</option>
                    <option value="wrong-genre">Games aren't in my genre</option>
                    <option value="budget-mismatch">Budget doesn't work for me</option>
                    <option value="wrong-roles">Not hiring for my skills</option>
                    <option value="low-ccu">Player numbers too low</option>
                    <option value="just-browsing">Just browsing</option>
                  </>}
                </select>
                <button
                  onClick={advanceAfterPass}
                  className="w-full py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
                  style={{ background: 'linear-gradient(135deg,#E84624,#FF8A5C)', color: '#FFFAF7' }}
                >
                  Continue matching →
                </button>
                <button
                  onClick={advanceAfterPass}
                  className="text-xs transition-opacity hover:opacity-70"
                  style={{ color: 'rgba(139,32,16,.4)' }}
                >
                  Skip feedback
                </button>
              </div>
            )}
          </div>

          {/* Right aux panel */}
          <div className="hidden lg:block flex-shrink-0 overflow-y-auto" style={{ width: 380 }}>
            <RightAuxPanel profile={profile} />
          </div>
        </div>
      </div>
    </>
  )
}
