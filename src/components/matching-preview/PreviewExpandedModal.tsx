'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { PreviewProfile } from './preview-types'
import PreviewAuxPanel from './PreviewAuxPanel'

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
  const [sliding, setSliding] = useState(false)
  const [interaction, setInteraction] = useState<InteractionState>('idle')
  const [showingShowcase, setShowingShowcase] = useState(false)
  const busyRef = useRef(false)

  const n = profiles.length
  const center = profiles[activeIdx]
  const left = n > 1 ? profiles[wrap(activeIdx - 1, n)] : null
  const right = n > 1 ? profiles[wrap(activeIdx + 1, n)] : null

  const navigate = useCallback((dir: -1 | 1) => {
    if (busyRef.current || n <= 1) return
    busyRef.current = true
    setSliding(true)
    setShowingShowcase(false)
    setInteraction('idle')
    setTimeout(() => {
      setActiveIdx(i => wrap(i + dir, n))
      setSliding(false)
      busyRef.current = false
    }, 500)
  }, [n])

  const handleLike = useCallback(() => {
    if (busyRef.current) return
    busyRef.current = true
    setShowingShowcase(false)
    setInteraction('like-glow')
    setTimeout(() => {
      setInteraction('match-overlay')
      busyRef.current = false
    }, 460)
  }, [])

  const handlePass = useCallback(() => {
    if (busyRef.current) return
    busyRef.current = true
    setShowingShowcase(false)
    setInteraction('pass-glow')
    setTimeout(() => {
      setInteraction('pass-overlay')
      busyRef.current = false
    }, 1750)
  }, [])

  const advanceAfterLike = useCallback(() => {
    onLiked(center.id)
  }, [center.id, onLiked])

  const advanceAfterPass = useCallback(() => {
    onPassed(center.id)
  }, [center.id, onPassed])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight' && interaction === 'idle') navigate(1)
      if (e.key === 'ArrowLeft' && interaction === 'idle') navigate(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, navigate, interaction])

  const glowStyle: React.CSSProperties = interaction === 'like-glow'
    ? { animation: 'previewLikeGlow 1.1s cubic-bezier(0.4,0,0.2,1) forwards' }
    : interaction === 'pass-glow'
    ? { animation: 'previewPassGlow 1.75s cubic-bezier(0.4,0,0.2,1) forwards' }
    : {}

  return (
    <>
      {/* Keyframes */}
      <style>{`
        @keyframes previewLikeGlow {
          0% { box-shadow: 0 20px 60px rgba(0,0,0,0.5); }
          15% { box-shadow: 0 0 0 5px rgba(61,199,122,0.7),0 0 40px rgba(61,199,122,0.55),0 0 80px rgba(61,199,122,0.3); }
          65% { box-shadow: 0 0 0 5px rgba(61,199,122,0.5),0 0 50px rgba(61,199,122,0.4); }
          100% { box-shadow: 0 0 0 3px rgba(61,199,122,0.25),0 0 30px rgba(61,199,122,0.15); }
        }
        @keyframes previewPassGlow {
          0% { box-shadow: 0 20px 60px rgba(0,0,0,0.5); }
          20% { box-shadow: 0 0 0 4px rgba(232,70,36,0.65),0 0 50px rgba(232,70,36,0.45),0 0 100px rgba(232,70,36,0.25); }
          75% { box-shadow: 0 0 0 3px rgba(232,70,36,0.35),0 0 30px rgba(232,70,36,0.25); }
          100% { box-shadow: 0 0 0 2px rgba(232,70,36,0.15),0 0 20px rgba(232,70,36,0.1); }
        }
        @keyframes previewModalIn {
          from { opacity:0; transform: translateX(-50%) translateY(-50%) scale(0.94); }
          to { opacity:1; transform: translateX(-50%) translateY(-50%) scale(1); }
        }
        @keyframes previewOverlayIn {
          from { opacity:0; transform: translateY(10px) scale(0.95); }
          to { opacity:1; transform: translateY(0) scale(1); }
        }
        @keyframes previewChatPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(61,199,122,0.45); }
          50% { box-shadow: 0 0 0 8px rgba(61,199,122,0.1); }
        }
      `}</style>

      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ background: 'radial-gradient(circle at top, rgba(14,12,9,0.88), rgba(14,12,9,0.75))', backdropFilter: 'blur(6px)' }}
        onClick={e => { if (e.target === e.currentTarget) onClose() }}
      >
        {/* Left peek card */}
        {left && (
          <div
            className="absolute cursor-pointer hidden md:block"
            style={{
              left: '50%',
              top: '50%',
              width: 340,
              height: 500,
              transform: `translateX(calc(-50% - 420px)) translateY(-50%) scale(0.88)`,
              opacity: sliding ? 0 : 0.4,
              zIndex: 2,
              transition: sliding ? 'opacity 0.5s ease' : 'opacity 0.3s ease',
              borderRadius: 20,
              background: 'linear-gradient(180deg, #1E1B16 0%, #16130E 100%)',
              border: '1px solid rgba(255,250,247,.08)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={() => navigate(-1)}
          >
            <PeekCardContent profile={left} />
          </div>
        )}

        {/* Right peek card */}
        {right && (
          <div
            className="absolute cursor-pointer hidden md:block"
            style={{
              left: '50%',
              top: '50%',
              width: 340,
              height: 500,
              transform: `translateX(calc(-50% + 420px)) translateY(-50%) scale(0.88)`,
              opacity: sliding ? 0 : 0.4,
              zIndex: 2,
              transition: sliding ? 'opacity 0.5s ease' : 'opacity 0.3s ease',
              borderRadius: 20,
              background: 'linear-gradient(180deg, #1E1B16 0%, #16130E 100%)',
              border: '1px solid rgba(255,250,247,.08)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={() => navigate(1)}
          >
            <PeekCardContent profile={right} />
          </div>
        )}

        {/* Aux panels (desktop only) */}
        <div
          className="absolute hidden lg:flex"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translateX(calc(-50% - 340px - 32px - 200px)) translateY(-50%)',
            zIndex: 3,
          }}
        >
          <PreviewAuxPanel profile={center} side="left" />
        </div>

        <div
          className="absolute hidden lg:flex"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translateX(calc(-50% + 340px + 32px)) translateY(-50%)',
            zIndex: 3,
          }}
        >
          <PreviewAuxPanel profile={center} side="right" />
        </div>

        {/* Center card */}
        <div
          className="absolute"
          style={{
            left: '50%',
            top: '50%',
            width: 340,
            maxHeight: '90vh',
            transform: 'translateX(-50%) translateY(-50%)',
            zIndex: 5,
            borderRadius: 20,
            background: 'linear-gradient(180deg, #1E1B16 0%, #16130E 100%)',
            border: '1px solid rgba(255,250,247,.10)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            animation: 'previewModalIn 0.25s cubic-bezier(0.4,0,0.2,1)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            ...glowStyle,
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Face */}
          <div style={{ display: showingShowcase ? 'none' : 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto', paddingBottom: 76 }}>
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center text-sm transition-opacity hover:opacity-70"
              style={{ background: 'rgba(0,0,0,0.35)', color: 'rgba(255,247,241,.8)' }}
            >
              ✕
            </button>

            {/* Header */}
            <div className="relative flex-shrink-0" style={{ height: 120, background: center.headerGradient }}>
              <div
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center justify-center rounded-full font-bold text-white text-lg z-10"
                style={{
                  width: 52,
                  height: 52,
                  background: 'rgba(255,255,255,0.2)',
                  border: '3px solid #1E1B16',
                  backdropFilter: 'blur(4px)',
                }}
              >
                {getInitials(center.name)}
              </div>
            </div>

            {/* Body */}
            <div className="px-5 pt-9 pb-4">
              <div className="text-center mb-4">
                <span
                  className="inline-block text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full mb-2"
                  style={{ background: 'rgba(255,190,116,.12)', color: '#FFBE74' }}
                >
                  {center.badge}
                </span>
                <h2
                  className="text-[#FFF7F1] text-2xl italic leading-tight"
                  style={{ fontFamily: 'var(--font-instrument-serif)' }}
                >
                  {center.name}
                </h2>
                <p className="text-gray-500 text-xs mt-1">{center.roleLine}</p>
              </div>

              {/* Stats row */}
              <div
                className="grid grid-cols-3 gap-2 py-3 mb-4 text-center"
                style={{ borderTop: '1px solid rgba(255,250,247,.07)', borderBottom: '1px solid rgba(255,250,247,.07)' }}
              >
                {center.stats.map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-white font-bold text-sm">{value}</p>
                    <p className="text-gray-600 text-[9px]">{label}</p>
                  </div>
                ))}
              </div>

              {/* Bio */}
              <p className="text-gray-300 text-sm leading-relaxed mb-4">"{center.bio}"</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {center.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 rounded-full"
                    style={{ border: '1px solid rgba(232,70,36,.3)', color: '#E84624', background: 'rgba(232,70,36,.06)' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Status */}
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#3DC77A' }} />
                <span className="text-gray-400 text-sm">{center.status}</span>
              </div>

              {/* Showcase button */}
              {(center.bestWork?.length ?? 0) > 0 && (
                <button
                  onClick={() => setShowingShowcase(true)}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-80 active:scale-[0.98]"
                  style={{ border: '2px solid rgba(232,70,36,.5)', color: '#E84624' }}
                >
                  {center.type === 'dev' ? 'See best work →' : 'See top games →'}
                </button>
              )}
            </div>
          </div>

          {/* Showcase back */}
          {showingShowcase && (
            <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 76 }}>
              <button
                onClick={onClose}
                className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center text-sm hover:opacity-70"
                style={{ background: 'rgba(0,0,0,0.35)', color: 'rgba(255,247,241,.8)' }}
              >
                ✕
              </button>

              {/* Showcase header */}
              <div className="relative flex-shrink-0" style={{ height: 80, background: center.headerGradient }} />

              <div className="px-5 pt-4 pb-2">
                <h3 className="font-bold text-base text-white mb-3">
                  {center.name} — {center.type === 'dev' ? 'Best Work' : 'Top Games'}
                </h3>

                <div className="flex flex-col gap-3">
                  {center.bestWork?.map(work => (
                    <div
                      key={work.title}
                      className="flex gap-3 p-3 rounded-xl"
                      style={{ border: '1px solid rgba(255,250,247,.08)', background: 'rgba(255,250,247,.03)' }}
                    >
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                        style={{ background: center.headerGradient }}
                      >
                        {work.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-sm mb-1 leading-tight">{work.title}</p>
                        <p className="text-gray-500 text-[11px] leading-relaxed mb-2">{work.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {work.meta.map(({ label, value }) => (
                            <span
                              key={label}
                              className="text-[10px] px-2 py-0.5 rounded-full"
                              style={{ background: 'rgba(255,190,116,.1)', color: '#FFBE74' }}
                            >
                              {label}: {value}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setShowingShowcase(false)}
                  className="w-full mt-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-80 active:scale-[0.98]"
                  style={{ border: '2px solid rgba(232,70,36,.5)', color: '#E84624' }}
                >
                  ← Back to profile
                </button>
              </div>
            </div>
          )}

          {/* Action bar */}
          <div
            className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-6 py-4"
            style={{
              background: 'linear-gradient(0deg, #16130E 60%, transparent)',
              zIndex: 30,
            }}
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
              className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
              style={{ border: '2px solid #FFBE74', color: '#FFBE74' }}
              title="Chat"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
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

          {/* Like / Match overlay */}
          {interaction === 'match-overlay' && (
            <div
              className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 rounded-[20px]"
              style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(18px)', animation: 'previewOverlayIn 0.35s cubic-bezier(0.34,1.56,0.64,1)' }}
            >
              <p
                className="text-2xl font-bold"
                style={{ color: '#1a6640', fontFamily: 'var(--font-instrument-serif)' }}
              >
                💚 You sparked!
              </p>
              <p className="text-sm text-center" style={{ color: 'rgba(26,102,64,0.7)' }}>
                We'll let you know when it's a match.
              </p>
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  border: '2.5px solid #3DC77A',
                  color: '#3DC77A',
                  background: 'rgba(61,199,122,.08)',
                  animation: 'previewChatPulse 2s 0.5s ease-in-out infinite',
                }}
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <button
                onClick={advanceAfterLike}
                className="px-6 py-2.5 rounded-full text-sm font-semibold transition-all hover:scale-105 active:scale-95"
                style={{ border: '2px solid rgba(61,199,122,.55)', color: '#1a6640' }}
              >
                Keep matching →
              </button>
            </div>
          )}

          {/* Pass overlay */}
          {interaction === 'pass-overlay' && (
            <div
              className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 px-6 rounded-[20px]"
              style={{ background: 'rgba(255,245,240,0.12)', backdropFilter: 'blur(18px)', animation: 'previewOverlayIn 0.35s cubic-bezier(0.34,1.56,0.64,1)' }}
            >
              <span className="text-4xl">👋</span>
              <p className="text-xl font-bold text-center" style={{ color: '#8B2010', fontFamily: 'var(--font-instrument-serif)' }}>
                You passed on {center.name}
              </p>
              <p className="text-xs text-center" style={{ color: 'rgba(139,32,16,.55)' }}>
                Help us improve — why wasn't it a fit?
              </p>
              <select
                className="w-full rounded-xl px-3 py-2.5 text-sm appearance-none outline-none"
                style={{ border: '2px solid rgba(232,70,36,.3)', background: '#1E1B16', color: '#FFF7F1' }}
                defaultValue=""
              >
                <option value="" disabled>Select a reason…</option>
                {center.type === 'dev'
                  ? <>
                      <option value="not-enough-exp">Not enough experience</option>
                      <option value="wrong-skills">Skills don't match what I need</option>
                      <option value="portfolio-quality">Portfolio quality</option>
                      <option value="rate-too-high">Rate is too high</option>
                      <option value="availability">Availability doesn't work</option>
                      <option value="just-browsing">Just browsing</option>
                    </>
                  : <>
                      <option value="team-too-small">Team is too small</option>
                      <option value="wrong-genre">Games aren't in my genre</option>
                      <option value="budget-mismatch">Budget doesn't work for me</option>
                      <option value="wrong-roles">Not hiring for my skills</option>
                      <option value="low-ccu">Player numbers too low</option>
                      <option value="just-browsing">Just browsing</option>
                    </>
                }
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
      </div>
    </>
  )
}

function PeekCardContent({ profile }: { profile: PreviewProfile }) {
  return (
    <>
      <div style={{ height: 80, background: profile.headerGradient, flexShrink: 0 }} />
      <div className="flex-1 px-4 pt-4 pb-3 flex flex-col gap-2">
        <span
          className="text-[8px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full self-center"
          style={{ background: 'rgba(255,190,116,.12)', color: '#FFBE74' }}
        >
          {profile.badge}
        </span>
        <p
          className="text-[#FFF7F1] text-base italic text-center leading-tight"
          style={{ fontFamily: 'var(--font-instrument-serif)' }}
        >
          {profile.name}
        </p>
        <p className="text-gray-600 text-[10px] text-center">{profile.roleLine}</p>
        <div className="flex flex-wrap gap-1 justify-center mt-1">
          {profile.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-[8px] px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(232,70,36,.1)', color: '#E84624' }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </>
  )
}
