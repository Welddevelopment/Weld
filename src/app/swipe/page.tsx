'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import AppNav from '@/components/AppNav'
import PreviewExpandedModal from '@/components/matching-preview/PreviewExpandedModal'
import SwipeStack, { SwipeProfile, SwipeStackHandle } from '@/components/SwipeStack'
import { getBrowserSupabase, hasBrowserSupabaseConfig } from '@/lib/supabase/browser'

type PageMode = 'loading' | 'unauthed' | 'ready'
type SwipeApiResponse = { ok?: boolean; match?: boolean; message?: string }

function MutualMatchScreen({
  profile,
  onKeepMatching,
}: {
  profile: SwipeProfile
  onKeepMatching: () => void
}) {
  return (
    <div className="mp-modal-overlay" onClick={onKeepMatching}>
      <div
        className="mp-carousel-card pos-center"
        style={{ position: 'relative', overflow: 'hidden', width: 340, height: 520 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="mp-match-overlay mp-its-a-match">
          <div className="mp-iam-heading">🎉 It&apos;s a Match!</div>
          <div className="mp-iam-sub">You and {profile.name} both liked each other</div>
          <div className="mp-iam-actions">
            <button className="mp-iam-reach-btn" onClick={onKeepMatching}>
              <div className="mp-iam-reach-icon">
                <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
              <span className="mp-iam-btn-label">Reach out</span>
            </button>
            <button className="mp-iam-scroll-btn" onClick={onKeepMatching}>
              <div className="mp-iam-scroll-circle">
                <svg viewBox="0 0 24 24" className="mp-iam-scroll-arrow"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
              <span className="mp-iam-btn-label">Keep matching</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SwipePage() {
  const [mode, setMode] = useState<PageMode>('loading')
  const [token, setToken] = useState<string | null>(null)
  const [profiles, setProfiles] = useState<SwipeProfile[]>([])
  const [loadingProfiles, setLoadingProfiles] = useState(false)
  const [modalProfile, setModalProfile] = useState<SwipeProfile | null>(null)
  const [matchedProfile, setMatchedProfile] = useState<SwipeProfile | null>(null)
  const [autoLikeModal, setAutoLikeModal] = useState(false)
  const [swipeError, setSwipeError] = useState<string | null>(null)
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

  const recordSwipe = async (userId: string, direction: 'like' | 'pass') => {
    if (!token) {
      setSwipeError('No active login session. Please log in again.')
      return false
    }

    try {
      const res = await fetch('/api/swipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ swipedUserId: userId, direction }),
      })
      const json = (await res.json().catch(() => null)) as SwipeApiResponse | null
      if (!res.ok || !json?.ok) {
        setSwipeError(json?.message ?? `Swipe request failed with status ${res.status}.`)
        return false
      }
      setSwipeError(null)
      return Boolean(res.ok && json?.ok && json.match)
    } catch {
      setSwipeError('Swipe request failed before reaching the server.')
      return false
    }
  }

  return (
    <div className="flex min-h-screen flex-col select-none" style={{ background: '#0E0C09' }}>
      <AppNav />

      {swipeError && (
        <div className="fixed left-1/2 top-24 z-[300] w-[min(92vw,560px)] -translate-x-1/2 rounded-xl border border-red-400/30 bg-red-950/95 px-4 py-3 text-sm text-red-50 shadow-2xl">
          <div className="flex items-start justify-between gap-4">
            <p>{swipeError}</p>
            <button
              type="button"
              className="shrink-0 text-red-100/70 transition hover:text-red-50"
              onClick={() => setSwipeError(null)}
              aria-label="Dismiss swipe error"
            >
              x
            </button>
          </div>
        </div>
      )}

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
              onLike={p => {
                void recordSwipe(p.userId, 'like').then(matched => {
                  if (matched) setMatchedProfile(p)
                })
              }}
              onPass={p => { void recordSwipe(p.userId, 'pass') }}
              onCardClick={p => setModalProfile(p)}
              onCardLike={p => { setAutoLikeModal(true); setModalProfile(p) }}
            />
          )}
        </div>
      )}

      {modalProfile && (
        <PreviewExpandedModal
          profiles={[modalProfile]}
          initialId={modalProfile.id}
          autoLike={autoLikeModal}
          onClose={() => { setModalProfile(null); setAutoLikeModal(false) }}
          onPassed={() => {
            void recordSwipe(modalProfile.userId, 'pass')
            setModalProfile(null)
            setAutoLikeModal(false)
            setTimeout(() => swipeRef.current?.swipe('left', { notify: false }), 0)
          }}
          onLiked={() => {
            setModalProfile(null)
            setAutoLikeModal(false)
          }}
          onLikeResult={async () => {
            const matched = await recordSwipe(modalProfile.userId, 'like')
            setTimeout(() => swipeRef.current?.swipe('right', { notify: false }), 0)
            return matched
          }}
        />
      )}

      {matchedProfile && (
        <MutualMatchScreen
          profile={matchedProfile}
          onKeepMatching={() => setMatchedProfile(null)}
        />
      )}
    </div>
  )
}
