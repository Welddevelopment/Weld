'use client'

import { MatchCandidate } from '@/lib/types'
import { getInitials, isAvailableNow } from '@/lib/utils'

interface Props {
  candidate: MatchCandidate
  dragOverlay?: 'like' | 'nope' | null
  dragOpacity?: number
  onPass?: () => void
  onLike?: () => void
  onViewDetails?: () => void
}

export default function CandidateCard({
  candidate,
  dragOverlay,
  dragOpacity = 0,
  onPass,
  onLike,
  onViewDetails,
}: Props) {
  const available = isAvailableNow(candidate.availability)

  return (
    <div className="relative h-[520px] w-[340px] overflow-hidden rounded-[28px] border border-black/5 bg-[#FFFDF9] shadow-2xl">
      {dragOverlay && (
        <div
          className={`pointer-events-none absolute inset-0 z-20 flex items-center justify-center ${
            dragOverlay === 'like' ? 'bg-green-500/10' : 'bg-red-500/10'
          }`}
          style={{ opacity: dragOpacity }}
        >
          <span
            className={`rotate-[-15deg] rounded-2xl border-4 px-4 py-2 text-5xl font-black ${
              dragOverlay === 'like' ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'
            }`}
          >
            {dragOverlay === 'like' ? 'SPARK' : 'PASS'}
          </span>
        </div>
      )}

      <div className="relative h-[100px]" style={{ background: candidate.headerGradient }}>
        <div className="absolute -bottom-9 left-6 flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-white text-2xl font-bold text-gray-900 shadow-lg">
          {getInitials(candidate.name)}
        </div>
        <div className="absolute right-4 top-4 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
          {candidate.tier}
        </div>
      </div>

      <div className="px-6 pb-5 pt-12">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold leading-tight text-gray-950">{candidate.name}</h2>
            <p className="mt-1 text-sm text-gray-500">
              {candidate.role} · {candidate.experience}
            </p>
          </div>
          {candidate.verified && (
            <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
              verified
            </span>
          )}
        </div>

        <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-gray-700">
          {candidate.bio}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {candidate.skills.slice(0, 4).map(skill => (
            <span key={skill} className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700">
              {skill}
            </span>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-gray-50 p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Availability</p>
            <p className={`mt-1 text-sm font-semibold ${available ? 'text-green-600' : 'text-gray-800'}`}>
              {candidate.availability}
            </p>
          </div>
          <div className="rounded-2xl bg-gray-50 p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Rate</p>
            <p className="mt-1 text-sm font-semibold text-gray-900">{candidate.rate}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-gray-100 pt-4">
          {[
            { value: `★ ${candidate.rating}`, label: 'Rating' },
            { value: `${candidate.matchScore}%`, label: 'Match' },
            { value: candidate.visits, label: 'Visits' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-sm font-bold text-gray-950">{value}</p>
              <p className="mt-0.5 text-[10px] uppercase text-gray-400">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white via-white to-transparent p-4">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={event => { event.stopPropagation(); onPass?.() }}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-100 bg-white text-xl text-red-500 shadow-lg transition-transform active:scale-95"
            aria-label="Pass"
          >
            x
          </button>
          <button
            onClick={event => { event.stopPropagation(); onViewDetails?.() }}
            className="h-11 rounded-full bg-gray-900 px-4 text-xs font-semibold text-white transition-transform active:scale-95"
          >
            Details
          </button>
          <button
            onClick={event => { event.stopPropagation(); onLike?.() }}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-xl text-white shadow-lg transition-transform active:scale-95"
            aria-label="Like"
          >
            +
          </button>
        </div>
      </div>
    </div>
  )
}
