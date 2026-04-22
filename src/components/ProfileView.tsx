'use client'

import { Profile } from '@/lib/types'
import { getInitials, isAvailableNow } from '@/lib/utils'

interface Props {
  profile: Profile
  onBack: () => void
  onPass?: () => void
  onLike?: () => void
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-5 mt-3" style={{ background: '#1E1B16' }}>
      <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-widest mb-2">{label}</p>
      {children}
    </div>
  )
}

export default function ProfileView({ profile, onBack, onPass, onLike }: Props) {
  const available = isAvailableNow(profile.availability)

  return (
    <div
      className="h-screen overflow-y-auto flex flex-col items-center py-6 px-4"
      style={{ background: '#0E0C09' }}
    >
      {/* Fixed close button */}
      <button
        onClick={onBack}
        className="fixed top-4 right-4 z-50 w-9 h-9 rounded-full flex items-center justify-center transition-opacity hover:opacity-80 active:scale-95"
        style={{ background: 'rgba(255,250,247,.08)', border: '1px solid rgba(255,250,247,.12)', color: 'rgba(255,247,241,.6)' }}
        aria-label="Close"
      >
        ✕
      </button>

      <div className="w-full max-w-sm">

        {/* Header card */}
        <div className="rounded-3xl overflow-hidden" style={{ background: '#1E1B16', border: '1px solid rgba(255,250,247,.08)' }}>
          <div
            className="relative h-36 flex items-center justify-center"
            style={{ background: profile.headerGradient }}
          >
            <div
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl z-10"
              style={{ background: 'rgba(255,255,255,0.18)', border: '3px solid #1E1B16', backdropFilter: 'blur(4px)' }}
            >
              {getInitials(profile.name)}
            </div>
          </div>

          <div className="px-6 pt-12 pb-6">
            <p className="text-orange-400 text-[10px] font-semibold tracking-[0.2em] uppercase mb-2">
              {profile.tier}
            </p>
            <div className="flex items-center gap-2">
              <h1
                className="text-[#FFF7F1] text-3xl italic leading-tight"
                style={{ fontFamily: 'var(--font-instrument-serif)' }}
              >
                {profile.name}
              </h1>
              {profile.verified && (
                <span className="text-blue-400 text-xs border border-blue-400/40 px-1.5 py-0.5 rounded-full">✓</span>
              )}
            </div>
            <p className="text-gray-400 text-sm mt-1">
              {profile.role} · {profile.experience} experience
            </p>

            <div
              className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t text-center"
              style={{ borderColor: 'rgba(255,255,255,0.08)' }}
            >
              {[
                { value: profile.rate, label: 'rate' },
                { value: `★ ${profile.rating}`, label: 'rating' },
                { value: `${profile.matchScore}%`, label: 'match' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-white font-bold text-sm">{value}</p>
                  <p className="text-gray-500 text-[10px]">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Section label="About">
          <p className="text-gray-300 text-sm leading-relaxed">"{profile.bio}"</p>
        </Section>

        <Section label="Skills">
          <div className="flex gap-2 flex-wrap">
            {profile.skills.map(skill => (
              <span
                key={skill}
                className="text-white/70 text-sm px-3 py-1.5 rounded-full"
                style={{ border: '1px solid rgba(255,255,255,0.15)' }}
              >
                {skill}
              </span>
            ))}
          </div>
        </Section>

        <Section label="Availability">
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: available ? '#22c55e' : '#facc15' }}
            />
            <span className="text-gray-300 text-sm">{profile.availability}</span>
          </div>
        </Section>

        <Section label="Proven work">
          <p className="text-white font-bold text-lg">
            {profile.visits}{' '}
            <span className="text-gray-500 text-sm font-normal">total visits</span>
          </p>
        </Section>

        <div className="flex gap-3 mt-4 mb-8">
          <button
            onClick={onPass ?? onBack}
            className="flex-1 py-3 rounded-xl text-sm font-medium active:scale-95 transition-transform"
            style={{ border: '1px solid rgba(255,250,247,.12)', color: 'rgba(255,247,241,.5)' }}
          >
            Pass
          </button>
          <button
            onClick={onLike ?? onBack}
            className="flex-1 py-3 rounded-xl text-sm font-semibold active:scale-95 transition-transform"
            style={{ background: '#3DC77A', color: '#0E0C09' }}
          >
            ♥ Spark
          </button>
        </div>
      </div>
    </div>
  )
}
