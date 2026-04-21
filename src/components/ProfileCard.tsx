'use client'

import { Profile } from '@/lib/types'
import { getInitials, isAvailableNow } from '@/lib/utils'

interface Props {
  profile: Profile
  dragOverlay?: 'like' | 'nope' | null
  dragOpacity?: number
  onPass?: () => void
  onLike?: () => void
}

export default function ProfileCard({
  profile,
  dragOverlay = null,
  dragOpacity = 0,
  onPass,
  onLike,
}: Props) {
  const available = isAvailableNow(profile.availability)

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

      {/* Header */}
      <div className="relative h-[100px]" style={{ background: profile.headerGradient }}>
        <div
          className="absolute -bottom-7 left-1/2 -translate-x-1/2 w-[52px] h-[52px] rounded-full flex items-center justify-center text-white font-semibold text-base z-10"
          style={{
            background: 'rgba(255,255,255,.18)',
            border: '3px solid #1A170F',
            backdropFilter: 'blur(4px)',
          }}
        >
          {getInitials(profile.name)}
        </div>
      </div>

      <div className="px-5 pt-10 pb-5">
        {/* Tier badge */}
        <div className="flex justify-center mb-2">
          <span
            className="px-3 py-[3px] rounded-full text-[9px] uppercase tracking-[0.15em]"
            style={{
              fontFamily: 'var(--font-geist-mono)',
              color: '#FFBE74',
              background: 'rgba(255,190,100,.1)',
            }}
          >
            {profile.tier}
          </span>
        </div>

        {/* Name + verified */}
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <h2
            className="text-[26px] italic leading-tight"
            style={{ fontFamily: 'var(--font-instrument-serif)', color: '#FFF7F1' }}
          >
            {profile.name}
          </h2>
          {profile.verified && (
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-full"
              style={{ border: '1px solid rgba(100,149,255,.4)', color: '#6495ff' }}
            >
              ✓
            </span>
          )}
        </div>

        {/* Role */}
        <p
          className="text-center text-[11px] tracking-[0.04em] mb-3"
          style={{ fontFamily: 'var(--font-geist-mono)', color: 'rgba(255,247,241,.46)' }}
        >
          {profile.role} · {profile.experience}
        </p>

        {/* Bio */}
        <p
          className="text-[13px] leading-relaxed mb-3 line-clamp-2"
          style={{ color: 'rgba(255,247,241,.7)' }}
        >
          {profile.bio}
        </p>

        {/* Skills */}
        <div className="flex gap-1.5 flex-wrap mb-4">
          {profile.skills.slice(0, 4).map(skill => (
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

        {/* Divider */}
        <div
          className="h-px mb-3"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,250,247,.1), transparent)' }}
        />

        {/* Availability + Rate */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-1.5">
            <span
              className="w-[7px] h-[7px] rounded-full flex-shrink-0"
              style={{ background: available ? '#3DC77A' : '#FFBE74' }}
            />
            <span
              className="text-[11px]"
              style={{ fontFamily: 'var(--font-geist-mono)', color: 'rgba(255,247,241,.5)' }}
            >
              {profile.availability}
            </span>
          </div>
          <span
            className="text-[11px]"
            style={{ fontFamily: 'var(--font-geist-mono)', color: 'rgba(255,247,241,.5)' }}
          >
            {profile.rate}
          </span>
        </div>

        {/* Stats */}
        <div className="flex justify-around mb-5">
          {[
            { value: `★ ${profile.rating}`, label: 'RATING' },
            { value: `${profile.matchScore}%`, label: 'MATCH' },
            { value: profile.visits, label: 'VISITS' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p
                className="text-[19px] italic leading-none"
                style={{ fontFamily: 'var(--font-instrument-serif)', color: '#FFF7F1' }}
              >
                {value}
              </p>
              <p
                className="text-[9px] mt-0.5 tracking-[0.1em]"
                style={{ fontFamily: 'var(--font-geist-mono)', color: 'rgba(255,247,241,.35)' }}
              >
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex justify-center gap-8">
          <button
            onClick={e => { e.stopPropagation(); onPass?.() }}
            className="w-12 h-12 rounded-full flex items-center justify-center text-xl transition-transform active:scale-90"
            style={{ border: '2px solid #E84624', color: '#E84624' }}
            aria-label="Pass"
          >
            ✕
          </button>
          <button
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
