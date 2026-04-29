'use client'

import type { PreviewProfile } from '@/components/matching-preview/preview-types'
import { getInitials } from '@/lib/utils'

interface Props {
  profile: PreviewProfile
  dragOverlay?: 'like' | 'nope' | null
  dragOpacity?: number
  onPass?: () => void
  onLike?: () => void
  onViewProfile?: () => void
}

export default function SwipeCard({
  profile,
  dragOverlay = null,
  dragOpacity = 0,
  onPass,
  onLike,
  onViewProfile,
}: Props) {
  const initials = getInitials(profile.name) || '?'
  const skillNames = profile.type === 'dev'
    ? (profile.skills ?? []).map(s => s.name)
    : (profile.skillsNeeded ?? []).map(s => s.name)

  return (
    <div
      className="w-[340px] rounded-[24px] overflow-hidden shadow-2xl relative select-none"
      style={{
        background: 'linear-gradient(145deg, #1E1B16, #16130E)',
        border: '1px solid rgba(255,250,247,.08)',
      }}
    >
      {dragOverlay === 'like' && (
        <div
          className="absolute inset-0 z-20 rounded-[24px] flex items-start justify-end p-5 pointer-events-none"
          style={{ opacity: dragOpacity, background: 'rgba(61,199,122,0.1)' }}
        >
          <span
            className="border-[3px] border-[#3DC77A] text-[#3DC77A] font-black text-xl px-4 py-1 rounded-lg uppercase tracking-widest"
            style={{ transform: 'rotate(-15deg)', fontFamily: 'var(--font-geist-mono)' }}
          >
            LIKE
          </span>
        </div>
      )}

      {dragOverlay === 'nope' && (
        <div
          className="absolute inset-0 z-20 rounded-[24px] flex items-start justify-start p-5 pointer-events-none"
          style={{ opacity: dragOpacity, background: 'rgba(232,70,36,0.1)' }}
        >
          <span
            className="border-[3px] border-[#E84624] text-[#E84624] font-black text-xl px-4 py-1 rounded-lg uppercase tracking-widest"
            style={{ transform: 'rotate(15deg)', fontFamily: 'var(--font-geist-mono)' }}
          >
            NOPE
          </span>
        </div>
      )}

      <div className="relative h-[100px]" style={{ background: profile.bg }}>
        <div
          className="absolute -bottom-7 left-1/2 -translate-x-1/2 w-[52px] h-[52px] rounded-full z-10 overflow-hidden flex items-center justify-center text-white font-semibold text-base"
          style={{
            background: 'rgba(255,255,255,.18)',
            border: '3px solid #1A170F',
            backdropFilter: 'blur(4px)',
          }}
        >
          <span style={{ position: 'absolute' }}>{initials}</span>
          {profile.robloxUserId !== 1 && (
            <img
              src={`https://www.roblox.com/headshot-thumbnail/image?userId=${profile.robloxUserId}&width=150&height=150&format=png`}
              alt={profile.name}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          )}
        </div>
      </div>

      <div className="px-5 pt-10 pb-5">
        {profile.badge && (
          <div className="flex justify-center mb-2">
            <span
              className="px-3 py-[3px] rounded-full text-[9px] uppercase tracking-[0.15em]"
              style={{
                fontFamily: 'var(--font-geist-mono)',
                color: '#FFBE74',
                background: 'rgba(255,190,100,.1)',
              }}
            >
              {profile.badge}
            </span>
          </div>
        )}

        <h2
          className="text-[26px] italic leading-tight text-center mb-1"
          style={{ fontFamily: 'var(--font-instrument-serif)', color: '#FFF7F1' }}
        >
          {profile.name}
        </h2>

        <p
          className="text-center text-[11px] tracking-[0.04em] mb-3"
          style={{ fontFamily: 'var(--font-geist-mono)', color: 'rgba(255,247,241,.46)' }}
        >
          {profile.role}
        </p>

        <p
          className="text-[13px] leading-relaxed mb-3 line-clamp-2"
          style={{ color: 'rgba(255,247,241,.7)' }}
        >
          {profile.bio}
        </p>

        {skillNames.length > 0 && (
          <div className="flex gap-1.5 flex-wrap mb-4">
            {skillNames.slice(0, 4).map(skill => (
              <span
                key={skill}
                className="text-[11px] px-2.5 py-[3px] rounded-full"
                style={{
                  fontFamily: 'var(--font-geist-mono)',
                  color: 'rgba(255,250,247,.6)',
                  background: 'rgba(255,250,247,.06)',
                  border: '1px solid rgba(255,250,247,.1)',
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        <div
          className="h-px mb-3"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,250,247,.1), transparent)' }}
        />

        {profile.tags.length > 0 && (
          <div className="flex gap-1.5 flex-wrap mb-3">
            {profile.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="text-[11px] px-2.5 py-[3px] rounded-full"
                style={{
                  fontFamily: 'var(--font-geist-mono)',
                  color: 'rgba(232,70,36,.8)',
                  background: 'rgba(232,70,36,.08)',
                  border: '1px solid rgba(232,70,36,.2)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {profile.meta && (
          <p
            className="text-[11px] mb-4"
            style={{ fontFamily: 'var(--font-geist-mono)', color: 'rgba(255,247,241,.4)' }}
          >
            {profile.meta}
          </p>
        )}

        <button
          onMouseDown={e => e.stopPropagation()}
          onClick={e => { e.stopPropagation(); onViewProfile?.() }}
          className="w-full text-center py-2 mb-3 transition-opacity hover:opacity-80 active:opacity-60"
          style={{ fontFamily: 'var(--font-geist-mono)', color: 'rgba(255,247,241,.35)', fontSize: 11, letterSpacing: '0.06em' }}
        >
          view full profile →
        </button>

        <div className="flex justify-center gap-8">
          <button
            onMouseDown={e => e.stopPropagation()}
            onClick={e => { e.stopPropagation(); onPass?.() }}
            className="w-12 h-12 rounded-full flex items-center justify-center text-xl transition-transform active:scale-90"
            style={{ border: '2px solid #E84624', color: '#E84624' }}
            aria-label="Pass"
          >
            ✕
          </button>
          <button
            onMouseDown={e => e.stopPropagation()}
            onClick={e => { e.stopPropagation(); onLike?.() }}
            className="w-12 h-12 rounded-full flex items-center justify-center text-xl transition-transform active:scale-90"
            style={{ border: '2px solid #3DC77A', color: '#3DC77A' }}
            aria-label="Like"
          >
            ♥
          </button>
        </div>
      </div>
    </div>
  )
}
