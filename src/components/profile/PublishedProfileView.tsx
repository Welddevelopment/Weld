'use client'

import { useState } from 'react'

import SwipeCard from '@/components/SwipeCard'
import type { PreviewProfile } from '@/components/matching-preview/preview-types'

import OwnProfileModal from './OwnProfileModal'

interface Props {
  profile: PreviewProfile
  onEdit: () => void
  onDelete: () => Promise<void>
}

function DeleteWarningModal({
  isDeleting,
  onConfirm,
  onCancel,
}: {
  isDeleting: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 500,
      background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div style={{
        background: '#141211', border: '1px solid rgba(232,70,36,0.3)',
        borderRadius: 20, padding: '36px 28px', maxWidth: 380, width: '100%', textAlign: 'center',
      }}>
        <div style={{ fontSize: 36, marginBottom: 16 }}>⚠️</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 26, color: '#FFF7F1', marginBottom: 12, marginTop: 0 }}>
          Delete your profile?
        </h2>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.48)', lineHeight: 1.65, marginBottom: 28, marginTop: 0 }}>
          Your profile will be removed from the swipe pool immediately and your draft will be cleared. This cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button
            onClick={onCancel}
            disabled={isDeleting}
            style={{
              padding: '10px 22px', borderRadius: 999,
              border: '1.5px solid rgba(255,255,255,0.14)',
              background: 'transparent', color: 'rgba(255,255,255,0.65)',
              fontFamily: 'var(--font-mono)', fontSize: 11,
              letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            style={{
              padding: '10px 22px', borderRadius: 999,
              border: '1.5px solid #E84624',
              background: 'rgba(232,70,36,0.12)', color: '#E84624',
              fontFamily: 'var(--font-mono)', fontSize: 11,
              letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
            }}
          >
            {isDeleting ? 'Deleting…' : 'Delete profile'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function PublishedProfileView({ profile, onEdit, onDelete }: Props) {
  const [modalOpen, setModalOpen] = useState(false)
  const [showDeleteWarning, setShowDeleteWarning] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirmDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete()
    } catch {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 py-16">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/50">
          Live — you&apos;re in the swipe pool
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
        <div style={{ pointerEvents: 'none' }}>
          <SwipeCard profile={profile} />
        </div>
      </button>

      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={onEdit}
          className="font-mono text-[10px] uppercase tracking-[0.13em] text-white/40 transition hover:text-white/70"
        >
          Edit profile →
        </button>
        <button
          type="button"
          onClick={() => setShowDeleteWarning(true)}
          className="font-mono text-[10px] uppercase tracking-[0.13em] text-red-500/40 transition hover:text-red-500/70"
        >
          Delete profile
        </button>
      </div>

      {modalOpen && (
        <OwnProfileModal profile={profile} onClose={() => setModalOpen(false)} />
      )}

      {showDeleteWarning && (
        <DeleteWarningModal
          isDeleting={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteWarning(false)}
        />
      )}
    </div>
  )
}
