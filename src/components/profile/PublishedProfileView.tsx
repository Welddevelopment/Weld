'use client'

import { useState } from 'react'

import PreviewCard from '@/components/matching-preview/PreviewCard'
import type { PreviewProfile } from '@/components/matching-preview/preview-types'

import OwnProfileModal from './OwnProfileModal'

interface Props {
  profile: PreviewProfile
  onEdit: () => void
}

export default function PublishedProfileView({ profile, onEdit }: Props) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 py-16">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/50">
          Live in matching pool
        </span>
      </div>

      {/* Card sits in the stack CSS context so its styles apply correctly */}
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="focus:outline-none"
        style={{ background: 'none', border: 'none', padding: 0 }}
        aria-label="View your full profile"
      >
        <div className="card-stack hero-preview-stack" style={{ pointerEvents: 'none' }}>
          <div className="fan-wrap cards-left">
            <PreviewCard profile={profile} />
          </div>
        </div>
      </button>

      <button
        type="button"
        onClick={onEdit}
        className="font-mono text-[10px] uppercase tracking-[0.13em] text-white/40 transition hover:text-white/70"
      >
        Edit profile →
      </button>

      {modalOpen && (
        <OwnProfileModal profile={profile} onClose={() => setModalOpen(false)} />
      )}
    </div>
  )
}
