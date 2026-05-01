'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import AppNav from '@/components/AppNav'
import PreviewExpandedModal, { type LikeFeedback } from '@/components/matching-preview/PreviewExpandedModal'
import type { SwipeProfile } from '@/components/SwipeStack'
import { getBrowserSupabase, hasBrowserSupabaseConfig } from '@/lib/supabase/browser'

type SavedProfileItem = {
  profile: SwipeProfile
  likedAt: string | null
  matched: boolean
}

type HomeMatchesResponse = {
  ok?: boolean
  message?: string
  likes?: SavedProfileItem[]
  matches?: SavedProfileItem[]
  inboundLikes?: SavedProfileItem[]
}

type PageMode = 'loading' | 'unauthed' | 'ready'

function formatSavedAt(value: string | null) {
  if (!value) return 'saved'
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

function SavedProfileCard({ item, label, onClick, onMessage }: { item: SavedProfileItem; label: string; onClick?: () => void; onMessage?: () => void }) {
  const { profile } = item
  const skillNames = profile.type === 'dev'
    ? (profile.skills ?? []).map(skill => skill.name)
    : (profile.skillsNeeded ?? []).map(skill => skill.name)

  return (
    <article className="rounded-[18px] border border-white/10 bg-white/[0.04] p-4 shadow-[0_18px_42px_rgba(0,0,0,0.18)] cursor-pointer transition hover:border-white/20 hover:bg-white/[0.07]" onClick={onClick}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#FFBE74]">{label}</p>
          <h2 className="mt-2 truncate text-2xl italic text-[#FFF7F1]" style={{ fontFamily: 'var(--font-instrument-serif)' }}>
            {profile.name}
          </h2>
          <p className="mt-1 truncate font-mono text-[11px] text-white/40">{profile.role}</p>
        </div>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 text-sm font-semibold text-white/80" style={{ background: profile.bg }}>
          {profile.name.slice(0, 2).toUpperCase()}
        </div>
      </div>

      <p className="mt-4 line-clamp-2 text-sm leading-6 text-white/62">{profile.bio}</p>

      {skillNames.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {skillNames.slice(0, 4).map(skill => (
            <span key={skill} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[10px] text-white/54">
              {skill}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/35">
          {formatSavedAt(item.likedAt)}
        </span>
        <div className="flex items-center gap-2">
          {item.matched && (
            <span className="rounded-full border border-[#3DC77A]/30 bg-[#3DC77A]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[#85e3ad]">
              sparked
            </span>
          )}
          {onMessage && (
            <button
              onClick={e => { e.stopPropagation(); onMessage() }}
              className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-white/55 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white/80"
            >
              Message
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

function EmptyState({ title, copy, cta, href }: { title: string; copy: string; cta?: string; href?: string }) {
  return (
    <div className="rounded-[18px] border border-dashed border-white/12 bg-white/[0.025] p-6 text-center">
      <p className="text-sm font-semibold text-white/70">{title}</p>
      <p className="mt-2 text-sm leading-6 text-white/38">{copy}</p>
      {cta && href && (
        <Link
          href={href}
          className="mt-4 inline-block rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.13em] text-white/55 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white/80"
        >
          {cta}
        </Link>
      )}
    </div>
  )
}

export default function HomePage() {
  const router = useRouter()
  const [mode, setMode] = useState<PageMode>('loading')
  const [token, setToken] = useState<string | null>(null)
  const [likes, setLikes] = useState<SavedProfileItem[]>([])
  const [matches, setMatches] = useState<SavedProfileItem[]>([])
  const [inboundLikes, setInboundLikes] = useState<SavedProfileItem[]>([])
  const [modalProfile, setModalProfile] = useState<SwipeProfile | null>(null)
  const [error, setError] = useState<string | null>(null)

  const openConversation = async (userId: string) => {
    if (!token) return
    try {
      const res = await fetch('/api/messages/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ recipientId: userId }),
      })
      const json = await res.json().catch(() => null)
      if (json?.ok) router.push(`/messages?c=${json.conversationId}`)
    } catch { /* navigation fails silently */ }
  }

  const recordSwipe = async (userId: string, direction: 'like' | 'pass'): Promise<LikeFeedback | null> => {
    if (!token) return null
    try {
      const res = await fetch('/api/swipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ swipedUserId: userId, direction }),
      })
      const json = await res.json().catch(() => null)
      if (!res.ok || !json?.ok) return null
      return json.status === 'passed' ? null : (json.status ?? (json.match ? 'matched' : 'liked'))
    } catch {
      return null
    }
  }

  useEffect(() => {
    if (!hasBrowserSupabaseConfig()) {
      setMode('unauthed')
      return
    }

    getBrowserSupabase().auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        setMode('unauthed')
        return
      }

      setToken(data.session.access_token)
      try {
        const res = await fetch('/api/home/matches', {
          headers: { Authorization: `Bearer ${data.session.access_token}` },
          cache: 'no-store',
        })
        const json = (await res.json().catch(() => null)) as HomeMatchesResponse | null
        if (!res.ok || !json?.ok) {
          setError(json?.message ?? `Could not load home data (${res.status}).`)
        } else {
          setLikes(json.likes ?? [])
          setMatches(json.matches ?? [])
          setInboundLikes(json.inboundLikes ?? [])
        }
      } catch {
        setError('Could not load home data.')
      } finally {
        setMode('ready')
      }
    })
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-[#0c0e0f]">
      <AppNav />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#FFBE74]">Home</p>
            <h1 className="mt-2 text-4xl italic text-[#FFF7F1]" style={{ fontFamily: 'var(--font-instrument-serif)' }}>
              Sparks &amp; Likes
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/45">
              Likes and sparks are loaded from your account, so resetting the swipe deck will not clear this list.
            </p>
          </div>
          <Link
            href="/swipe"
            className="w-fit rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.13em] text-white/70 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white/90"
          >
            Start swiping
          </Link>
        </div>

        {mode === 'loading' && (
          <p className="py-20 text-center font-mono text-sm text-white/35">Loading saved activity...</p>
        )}

        {mode === 'unauthed' && (
          <div className="flex flex-col items-center justify-center gap-5 py-28">
            <p className="font-mono text-sm text-white/50">Log in to see saved likes and matches.</p>
            <Link
              href="/login"
              className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.13em] text-white/60 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white/90"
            >
              Log in
            </Link>
          </div>
        )}

        {mode === 'ready' && (
          <>
            {error && (
              <div className="rounded-xl border border-red-400/30 bg-red-950/70 px-4 py-3 text-sm text-red-50">
                {error}
              </div>
            )}

            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-mono text-xs uppercase tracking-[0.16em] text-white/55">Sparks</h2>
                <span className="font-mono text-xs text-white/30">{matches.length}</span>
              </div>
              {matches.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {matches.map(item => (
                    <SavedProfileCard key={item.profile.userId} item={item} label="Sparked" onClick={() => setModalProfile(item.profile)} onMessage={() => void openConversation(item.profile.userId)} />
                  ))}
                </div>
              ) : (
                <EmptyState title="No sparks yet" copy="When someone you liked also likes you back, you'll spark — and they'll appear here." cta="Start swiping →" href="/swipe" />
              )}
            </section>

            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-mono text-xs uppercase tracking-[0.16em] text-white/55">Liked profiles</h2>
                <span className="font-mono text-xs text-white/30">{likes.length}</span>
              </div>
              {likes.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {likes.map(item => (
                    <SavedProfileCard key={item.profile.userId} item={item} label={item.matched ? 'Sparked' : 'Liked'} onClick={() => setModalProfile(item.profile)} onMessage={() => void openConversation(item.profile.userId)} />
                  ))}
                </div>
              ) : (
                <EmptyState title="No likes sent yet" copy="Profiles you like from the swipe page will appear here." cta="Go to swipe →" href="/swipe" />
              )}
            </section>

            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-mono text-xs uppercase tracking-[0.16em] text-white/55">Liked you</h2>
                <span className="font-mono text-xs text-white/30">{inboundLikes.length}</span>
              </div>
              {inboundLikes.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {inboundLikes.map(item => (
                    <SavedProfileCard key={item.profile.userId} item={item} label="Liked you" onClick={() => setModalProfile(item.profile)} onMessage={() => void openConversation(item.profile.userId)} />
                  ))}
                </div>
              ) : (
                <EmptyState title="No inbound likes yet" copy="When someone swipes right on you they'll show up here — and you can message them first." cta="Go to swipe →" href="/swipe" />
              )}
            </section>
          </>
        )}
      </main>

      {modalProfile && (
        <PreviewExpandedModal
          profiles={[modalProfile]}
          initialId={modalProfile.id}
          onClose={() => setModalProfile(null)}
          onPassed={() => setModalProfile(null)}
          onLiked={() => setModalProfile(null)}
          onLikeResult={async (id) => {
            const feedback = await recordSwipe(id, 'like')
            return feedback ?? 'liked'
          }}
        />
      )}
    </div>
  )
}
