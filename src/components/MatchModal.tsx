'use client'

import { Profile } from '@/lib/types'
import { getInitials } from '@/lib/utils'

interface Props {
  profile: Profile
  onClose: () => void
}

export default function MatchModal({ profile, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 px-4"
      style={{ background: 'rgba(0,0,0,0.85)' }}
      onClick={onClose}
    >
      <div
        className="rounded-3xl p-8 text-center max-w-sm w-full"
        style={{ background: '#1E1B16', border: '1px solid rgba(255,250,247,.08)' }}
        onClick={e => e.stopPropagation()}
      >
        <div
          className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-2xl"
          style={{ background: 'linear-gradient(to bottom, #7C3AED, #3b0764)' }}
        >
          {getInitials(profile.name)}
        </div>

        <p className="text-orange-400 text-[10px] font-semibold tracking-[0.2em] uppercase mb-2">
          {profile.tier}
        </p>
        <h2
          className="text-[#FFF7F1] text-2xl italic"
          style={{ fontFamily: 'var(--font-instrument-serif)' }}
        >
          It's a Spark!
        </h2>
        <p className="text-gray-400 mt-2 text-sm leading-relaxed">
          You and <span className="text-white font-semibold">{profile.name}</span> are both interested.
        </p>

        <div
          className="flex justify-center gap-6 mt-4 pt-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
        >
          {[
            { value: profile.rate, label: 'rate' },
            { value: `★ ${profile.rating}`, label: 'rating' },
            { value: `${profile.matchScore}%`, label: 'match' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-white font-bold text-sm">{value}</p>
              <p className="text-gray-500 text-[10px]">{label}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 mt-6">
          <button className="w-full bg-white text-black rounded-xl py-3 font-semibold text-sm active:scale-95 transition-transform">
            Send intro message
          </button>
          <button
            onClick={onClose}
            className="w-full text-gray-500 text-sm py-2 active:scale-95 transition-transform"
          >
            Keep swiping
          </button>
        </div>
      </div>
    </div>
  )
}
