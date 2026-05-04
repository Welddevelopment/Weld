'use client'

import { MatchCandidate } from '@/lib/types'
import { getInitials, isAvailableNow } from '@/lib/utils'

interface Props {
  candidate: MatchCandidate
  onBack: () => void
  onPass: () => void
  onLike: () => void
}

export default function CandidateDetails({ candidate, onBack, onPass, onLike }: Props) {
  const available = isAvailableNow(candidate.availability)

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6">
      <button
        onClick={onBack}
        className="mb-4 text-sm font-medium text-gray-500 transition-colors hover:text-white"
      >
        Back to stack
      </button>

      <div className="overflow-hidden rounded-[32px] border border-white/[0.08] bg-[#161310] shadow-2xl">
        <div className="relative h-36" style={{ background: candidate.headerGradient }}>
          <div className="absolute -bottom-12 left-8 flex h-24 w-24 items-center justify-center rounded-3xl border-4 border-[#161310] bg-white text-3xl font-bold text-gray-950 shadow-xl">
            {getInitials(candidate.name)}
          </div>
          <div className="absolute right-5 top-5 rounded-full bg-black/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            {candidate.tier}
          </div>
        </div>

        <div className="px-8 pb-8 pt-16">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#FFF7F1]">{candidate.name}</h1>
              <p className="mt-1 text-gray-400">{candidate.role} · {candidate.experience} experience</p>
            </div>
            {candidate.verified && (
              <span className="rounded-full border border-blue-400/20 bg-blue-500/15 px-3 py-1 text-xs font-semibold text-blue-300">
                verified
              </span>
            )}
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { value: candidate.rate, label: 'rate' },
              { value: `★ ${candidate.rating}`, label: 'rating' },
              { value: `${candidate.matchScore}%`, label: 'match' },
            ].map(({ value, label }) => (
              <div key={label} className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-4">
                <p className="font-bold text-[#FFF7F1]">{value}</p>
                <p className="mt-1 text-[10px] uppercase text-gray-500">{label}</p>
              </div>
            ))}
          </div>

          <section className="mt-8">
            <h2 className="mb-3 text-sm font-semibold text-[#FFF7F1]">Intro</h2>
            <p className="text-sm leading-relaxed text-gray-300">&quot;{candidate.bio}&quot;</p>
          </section>

          <section className="mt-8">
            <h2 className="mb-3 text-sm font-semibold text-[#FFF7F1]">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map(skill => (
                <span key={skill} className="rounded-full border border-white/[0.08] bg-white/[0.06] px-3 py-2 text-sm text-gray-300">
                  {skill}
                </span>
              ))}
            </div>
          </section>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-4">
              <p className="text-[10px] uppercase tracking-wider text-gray-500">Availability</p>
              <p className={`mt-1 font-semibold ${available ? 'text-green-400' : 'text-gray-300'}`}>
                {candidate.availability}
              </p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-4">
              <p className="text-[10px] uppercase tracking-wider text-gray-500">Visits shipped</p>
              <p className="mt-1 font-semibold text-gray-300">{candidate.visits}</p>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              onClick={onPass}
              className="flex-1 rounded-2xl border border-red-400/20 bg-red-500/10 py-4 font-semibold text-red-300 transition-transform active:scale-[0.98]"
            >
              Pass
            </button>
            <button
              onClick={onLike}
              className="flex-1 rounded-2xl border border-green-400/20 bg-green-500/15 py-4 font-semibold text-green-300 transition-transform active:scale-[0.98]"
            >
              Spark
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
