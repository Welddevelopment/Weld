'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { PreviewProfile } from './preview-types'
import PreviewCard from './PreviewCard'

interface Props {
  profiles: PreviewProfile[]
  onOpen: (id: string) => void
}

export default function PreviewStack({ profiles, onOpen }: Props) {
  const [shuffling, setShuffling] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [])

  const displayed = profiles.slice(0, 8)

  const handlePreview = useCallback(() => {
    if (shuffling || displayed.length === 0) return
    setShuffling(true)
    timerRef.current = setTimeout(() => {
      setShuffling(false)
      onOpen(displayed[displayed.length - 1].id)
    }, 2800)
  }, [shuffling, displayed, onOpen])

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="card-stack hero-preview-stack">
        <div className={`fan-wrap cards-left${shuffling ? ' shuffling' : ''}`}>
          {displayed.map(profile => (
            <PreviewCard key={profile.id} profile={profile} />
          ))}
        </div>
      </div>

      <div className="hero-preview-actions">
        <button
          className="hero-preview-btn"
          onClick={handlePreview}
          disabled={shuffling || displayed.length === 0}
        >
          Matching preview
        </button>
      </div>
    </div>
  )
}
