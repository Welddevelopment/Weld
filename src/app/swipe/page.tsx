'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import AppNav from '@/components/AppNav'
import PreviewExpandedModal from '@/components/matching-preview/PreviewExpandedModal'
import SwipeStack, { SwipeProfile, SwipeStackHandle } from '@/components/SwipeStack'
import { getBrowserSupabase, hasBrowserSupabaseConfig } from '@/lib/supabase/browser'

type PageMode = 'loading' | 'unauthed' | 'ready'

export default function SwipePage() {
  const [mode, setMode] = useState<PageMode>('loading')
  const [token, setToken] = useState<string | null>(null)
  const [profiles, setProfiles] = useState<SwipeProfile[]>([])
  const [loadingProfiles, setLoadingProfiles] = useState(false)
  const [modalProfile, setModalProfile] = useState<SwipeProfile | null>(null)
  const swipeRef = useRef<SwipeStackHandle>(null)

  useEffect(() => {
    if (!hasBrowserSupabaseConfig()) {
      setMode('unauthed')
      return
    }

    getBrowserSupabase().auth.getSession().then(({ data }) => {
      if (!data.session) {
        setMode('unauthed')
        return
      }
      setToken(data.session.access_token)
      setMode('ready')
    })
  }, [])

  useEffect(() => {
    if (mode !== 'ready' || !token) return
    setLoadingProfiles(true)
    fetch('/api/swipe/profiles', {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
      .then(res => res.json())
      .then(json => { if (json.ok) setProfiles(json.profiles) })
      .catch(() => {})
      .finally(() => setLoadingProfiles(false))
  }, [mode, token])

  const recordSwipe = (userId: string, direction: 'like' | 'pass') => {
    if (!token) return
    fetch('/api/swipe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ swipedUserId: userId, direction }),
    }).catch(() => {})
  }

  return (
    <div className="flex min-h-screen flex-col select-none" style={{ background: '#0E0C09' }}>
      <AppNav />

      {mode === 'loading' && (
        <div className="flex flex-1 items-center justify-center">
          <p className="font-mono text-sm text-white/40">Loading…</p>
        </div>
      )}

      {mode === 'unauthed' && (
        <div className="flex flex-1 flex-col items-center justify-center gap-5 py-32">
          <p className="font-mono text-sm text-white/50">You need to be logged in to match.</p>
          <Link
            href="/login"
            className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.13em] text-white/60 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white/90"
          >
            Log in →
          </Link>
        </div>
      )}

      {mode === 'ready' && (
        <div
          className="flex flex-1 items-center justify-center"
          style={{ minHeight: 'calc(100vh - 73px)' }}
        >
          {loadingProfiles ? (
            <p className="font-mono text-sm text-white/40">Loading profiles…</p>
          ) : (
            <SwipeStack
              ref={swipeRef}
              profiles={profiles}
              onLike={p => recordSwipe(p.userId, 'like')}
              onPass={p => recordSwipe(p.userId, 'pass')}
              onCardClick={p => setModalProfile(p)}
            />
          )}
        </div>
      )}

      {modalProfile && (
        <PreviewExpandedModal
          profiles={[modalProfile]}
          initialId={modalProfile.id}
          onClose={() => setModalProfile(null)}
          onPassed={() => {
            recordSwipe(modalProfile.userId, 'pass')
            setModalProfile(null)
            setTimeout(() => swipeRef.current?.swipe('left'), 0)
          }}
          onLiked={() => {
            recordSwipe(modalProfile.userId, 'like')
            setModalProfile(null)
            setTimeout(() => swipeRef.current?.swipe('right'), 0)
          }}
        />
      )}
    </div>
  )
}
