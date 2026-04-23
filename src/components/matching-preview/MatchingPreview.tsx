'use client'

import { useState, useMemo } from 'react'
import { PreviewProfile, PreviewProfileType } from './preview-types'
import { PREVIEW_DEVS, PREVIEW_STUDIOS } from './preview-data'
import PreviewStack from './PreviewStack'
import PreviewExpandedModal from './PreviewExpandedModal'

interface Props {
  audience?: PreviewProfileType
}

export default function MatchingPreview({ audience: initialAudience = 'dev' }: Props) {
  const [audience, setAudience] = useState<PreviewProfileType>(initialAudience)
  const [passed, setPassed] = useState<Set<string>>(new Set())
  const [liked, setLiked] = useState<Set<string>>(new Set())
  const [openProfileId, setOpenProfileId] = useState<string | null>(null)

  const allProfiles: PreviewProfile[] = audience === 'dev' ? PREVIEW_STUDIOS : PREVIEW_DEVS

  const availableProfiles = useMemo(
    () => allProfiles.filter(p => !passed.has(p.id) && !liked.has(p.id)),
    [allProfiles, passed, liked]
  )

  const handleOpen = (id: string) => setOpenProfileId(id)
  const handleClose = () => setOpenProfileId(null)

  const handlePassed = (id: string) => {
    setPassed(prev => new Set(prev).add(id))
    const remaining = availableProfiles.filter(p => p.id !== id)
    if (remaining.length === 0) {
      setOpenProfileId(null)
    } else {
      const currentIdx = availableProfiles.findIndex(p => p.id === id)
      const next = remaining[currentIdx % remaining.length]
      setOpenProfileId(next.id)
    }
  }

  const handleLiked = (id: string) => {
    setLiked(prev => new Set(prev).add(id))
    const remaining = availableProfiles.filter(p => p.id !== id)
    if (remaining.length === 0) {
      setOpenProfileId(null)
    } else {
      const currentIdx = availableProfiles.findIndex(p => p.id === id)
      const next = remaining[currentIdx % remaining.length]
      setOpenProfileId(next.id)
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Audience toggle */}
      <div
        className="flex rounded-full p-0.5 text-xs font-semibold"
        style={{ background: 'rgba(255,250,247,.06)', border: '1px solid rgba(255,250,247,.1)' }}
      >
        {(['dev', 'studio'] as const).map(type => (
          <button
            key={type}
            onClick={() => {
              setAudience(type)
              setPassed(new Set())
              setLiked(new Set())
              setOpenProfileId(null)
            }}
            className="px-4 py-1.5 rounded-full transition-all capitalize"
            style={{
              background: audience === type ? 'rgba(232,70,36,.18)' : 'transparent',
              color: audience === type ? '#E84624' : 'rgba(255,247,241,.5)',
              border: audience === type ? '1px solid rgba(232,70,36,.3)' : '1px solid transparent',
            }}
          >
            {type === 'dev' ? 'I am a developer' : 'I am a studio'}
          </button>
        ))}
      </div>

      {availableProfiles.length > 0 ? (
        <PreviewStack profiles={availableProfiles} onOpen={handleOpen} />
      ) : (
        <div className="text-center py-8">
          <p className="text-white font-semibold mb-1">You've seen everyone</p>
          <p className="text-gray-600 text-sm mb-4">Reset to browse again</p>
          <button
            onClick={() => { setPassed(new Set()); setLiked(new Set()) }}
            className="px-4 py-2 rounded-full text-sm font-semibold transition-all hover:opacity-80"
            style={{ border: '1px solid rgba(232,70,36,.4)', color: '#E84624' }}
          >
            Reset
          </button>
        </div>
      )}

      {openProfileId && availableProfiles.length > 0 && (
        <PreviewExpandedModal
          profiles={availableProfiles}
          initialId={openProfileId}
          onClose={handleClose}
          onPassed={handlePassed}
          onLiked={handleLiked}
        />
      )}
    </div>
  )
}
