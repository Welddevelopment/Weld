'use client'

import { useState, useEffect, useRef } from 'react'
import { PreviewProfile } from './preview-types'
import { LeftAuxPanel, RightAuxPanel } from './PreviewAuxPanel'

const DEV_PASS_REASONS = [
  'Not enough experience',
  "Skills don't match what I need",
  "Portfolio doesn't meet my standard",
  "Don't like the aesthetic of past work",
  'Rate is too high for my budget',
  "Availability doesn't match my timeline",
  'Specialisation is too niche for my project',
  'Just browsing, not ready to commit',
]

const STUDIO_PASS_REASONS = [
  'Team is too small for my needs',
  'Team is too large, looking for smaller studios',
  "Their games aren't in my genre",
  "Budget type doesn't work for me",
  "Game quality doesn't meet my standard",
  'Player numbers are too low',
  "Not hiring for my skillset",
  'Not enough track record or shipped games',
  'Just browsing, not ready to commit',
]

interface Props {
  profiles: PreviewProfile[]
  initialId: string
  onClose: () => void
  onPassed: (id: string) => void
  onLiked: (id: string) => void
}

interface PassToastData { name: string; isDev: boolean }

function AvatarImg({ userId, name, bg }: { userId: number; name: string; bg: string }) {
  const initials = name.slice(0, 2).toUpperCase()
  return (
    <div className="mp-modal-hero" style={{ background: bg }}>
      <div style={{ position: 'relative', width: 'clamp(60px,8vh,96px)', height: 'clamp(60px,8vh,96px)' }}>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: 'rgba(255,255,255,0.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: 24, color: 'rgba(255,255,255,.9)',
          border: '3px solid rgba(255,255,255,0.55)',
        }}>
          {initials}
        </div>
        <img
          src={`https://www.roblox.com/headshot-thumbnail/image?userId=${userId}&width=150&height=150&format=png`}
          alt={name}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
          onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
      </div>
    </div>
  )
}

function CenterCard({
  profile,
  glowClass,
  showMatch,
  isMatch,
  onPass,
  onLike,
  onKeepMatching,
}: {
  profile: PreviewProfile
  glowClass: string
  showMatch: boolean
  isMatch: boolean
  onPass: () => void
  onLike: () => void
  onKeepMatching: () => void
}) {
  const isDev = profile.type === 'dev'

  return (
    <div className={`mp-carousel-card pos-center ${glowClass}`} style={{ position: 'relative' }}>
      <AvatarImg userId={profile.robloxUserId} name={profile.name} bg={profile.bg} />

      <div className="mp-modal-body">
        <div className="mp-modal-badge">{profile.badge}</div>
        <div className="mp-modal-name">{profile.name}</div>
        <div className="mp-modal-role">{profile.role}</div>
        <div className="mp-modal-bio">{profile.bio}</div>

        {!isDev && profile.details && (
          <div className="mp-modal-description">{profile.details}</div>
        )}

        {!isDev && profile.skillsNeeded && profile.skillsNeeded.length > 0 && (
          <>
            <div className="mp-modal-section-title">Skills needed</div>
            <div className="mp-profile-skills">
              {profile.skillsNeeded.map(s => (
                <div key={s.name} className="mp-profile-skill">
                  <div className="mp-skill-label">{s.name}</div>
                  <div className="mp-skill-desc">{s.description}</div>
                </div>
              ))}
            </div>
          </>
        )}
        {isDev && profile.skills && profile.skills.length > 0 && (
          <>
            <div className="mp-modal-section-title">Skills</div>
            <div className="mp-profile-skills">
              {profile.skills.map(s => (
                <div key={s.name} className="mp-profile-skill">
                  <div className="mp-skill-label">{s.name}</div>
                  <div className="mp-skill-desc">{s.description}</div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="mp-modal-tags">
          {profile.tags.map(tag => (
            <span key={tag} className="mp-modal-tag">{tag}</span>
          ))}
        </div>

        <div className="mp-modal-meta">
          <div className="mp-modal-dot" />
          {profile.meta}
        </div>

        {isDev && profile.portfolio && (
          <>
            <div className="mp-modal-divider" />
            <div className="mp-modal-section-title">Portfolio</div>
            <div className="mp-modal-portfolio-links">
              {profile.portfolio.links.map(link => (
                <a key={link.name} href={`https://${link.url}`} target="_blank" rel="noreferrer" className="mp-modal-portfolio-link">
                  <span className="mp-modal-portfolio-link-name">{link.name}</span>
                  <span className="mp-modal-portfolio-link-url">{link.url}</span>
                </a>
              ))}
            </div>
          </>
        )}
        {isDev && profile.socials && profile.socials.length > 0 && (
          <>
            <div className="mp-modal-section-title" style={{ marginTop: 14 }}>Socials</div>
            <div className="mp-modal-socials">
              {profile.socials.map(s => (
                <a key={s.label} href={s.url} className="mp-modal-social-btn">
                  <span className="mp-modal-social-icon">{s.icon}</span>
                  {s.label}
                </a>
              ))}
            </div>
          </>
        )}

        <div className="mp-action-bar">
          <button className="mp-action-btn btn-pass" onClick={onPass} title="Pass">
            <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <button className="mp-action-btn btn-like" onClick={onLike} title="Like">
            <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
        </div>
      </div>

      {showMatch && !isMatch && (
        <div className="mp-match-overlay">
          <div className="mp-match-overlay-text">💚 You swiped right!</div>
          <div className="mp-match-overlay-sub">We&apos;ll let you know when it&apos;s a match.</div>
          <div className="mp-match-chat-icon">
            <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <button className="mp-match-keep-btn" onClick={onKeepMatching}>Keep matching →</button>
        </div>
      )}

      {showMatch && isMatch && (
        <div className="mp-match-overlay mp-its-a-match">
          <div className="mp-iam-heading">🎉 It&apos;s a Match!</div>
          <div className="mp-iam-sub">You and {profile.name} both liked each other</div>
          <div className="mp-iam-actions">
            <button className="mp-iam-reach-btn" onClick={onKeepMatching}>
              <div className="mp-iam-reach-icon">
                <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
              <span className="mp-iam-btn-label">Reach out</span>
            </button>
            <button className="mp-iam-scroll-btn" onClick={onKeepMatching}>
              <div className="mp-iam-scroll-circle">
                <svg viewBox="0 0 24 24" className="mp-iam-scroll-arrow"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
              <span className="mp-iam-btn-label">Keep matching</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function PassToast({ data, onDismiss }: { data: PassToastData; onDismiss: () => void }) {
  const [expanded, setExpanded] = useState(false)
  const reasons = data.isDev ? DEV_PASS_REASONS : STUDIO_PASS_REASONS

  return (
    <div
      className={`mp-pass-toast${expanded ? ' mp-pass-toast--open' : ''}`}
      onClick={e => { e.stopPropagation(); if (!expanded) setExpanded(true) }}
    >
      <div className="mp-pass-toast-row">
        <span className="mp-pass-toast-icon">👋</span>
        <div className="mp-pass-toast-content">
          <span className="mp-pass-toast-text">Passed on {data.name}</span>
          {!expanded && <span className="mp-pass-toast-hint">Tap to leave feedback</span>}
        </div>
        <button
          className="mp-pass-toast-close"
          onClick={e => { e.stopPropagation(); onDismiss() }}
        >✕</button>
      </div>

      {expanded && (
        <div className="mp-pass-toast-body" onClick={e => e.stopPropagation()}>
          <select className="mp-pass-reason-select" defaultValue="">
            <option value="" disabled>Select a reason…</option>
            {reasons.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <div className="mp-pass-toast-btns">
            <button className="mp-pass-toast-submit" onClick={onDismiss}>Submit</button>
            <button className="mp-pass-toast-skip" onClick={onDismiss}>Skip</button>
          </div>
        </div>
      )}

      {!expanded && (
        <div className="mp-pass-toast-timer" onAnimationEnd={onDismiss} />
      )}
    </div>
  )
}

export default function PreviewExpandedModal({ profiles, initialId, onClose, onPassed, onLiked }: Props) {
  const [currentId, setCurrentId] = useState(initialId)
  const [glowClass, setGlowClass] = useState('')
  const [showMatch, setShowMatch] = useState(false)
  const [isMatch, setIsMatch] = useState(false)
  const [passToast, setPassToast] = useState<PassToastData | null>(null)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    return () => { timersRef.current.forEach(clearTimeout) }
  }, [])

  useEffect(() => {
    setCurrentId(initialId)
    setGlowClass('')
    setShowMatch(false)
    setIsMatch(false)
  }, [initialId])

  const profile = profiles.find(p => p.id === currentId)
  if (!profile) return null

  const advance = (excludeId: string) => {
    const remaining = profiles.filter(p => p.id !== excludeId)
    if (remaining.length === 0) { onClose(); return }
    const curIdx = profiles.findIndex(p => p.id === excludeId)
    const next = remaining[curIdx % remaining.length]
    setCurrentId(next.id)
    setGlowClass('')
    setShowMatch(false)
    setIsMatch(false)
  }

  const handlePass = () => {
    if (glowClass) return
    const { name, type } = profile
    onPassed(currentId)
    advance(currentId)
    setPassToast({ name, isDev: type === 'dev' })
  }

  const handleLike = () => {
    if (glowClass) return
    setGlowClass('mp-like-glow')
    setIsMatch(Math.random() < 0.15)
    const t = setTimeout(() => setShowMatch(true), 460)
    timersRef.current.push(t)
  }

  const handleKeepMatching = () => {
    onLiked(currentId)
    advance(currentId)
  }

  return (
    <div className="mp-modal-overlay" onClick={onClose}>
      <button className="mp-modal-close-screen" onClick={e => { e.stopPropagation(); onClose() }}>✕</button>

      {passToast && (
        <PassToast data={passToast} onDismiss={() => setPassToast(null)} />
      )}

      <div className="mp-modal-row" onClick={e => e.stopPropagation()}>
        <div className="mp-carousel-card pos-left" style={{ overflow: 'hidden' }}>
          <LeftAuxPanel profile={profile} />
        </div>

        <CenterCard
          profile={profile}
          glowClass={glowClass}
          showMatch={showMatch}
          isMatch={isMatch}
          onPass={handlePass}
          onLike={handleLike}
          onKeepMatching={handleKeepMatching}
        />

        <div className="mp-carousel-card pos-right" style={{ overflow: 'hidden' }}>
          <RightAuxPanel profile={profile} />
        </div>
      </div>
    </div>
  )
}
