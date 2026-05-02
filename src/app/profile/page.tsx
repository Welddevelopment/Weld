'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import AppNav from '@/components/AppNav'
import type { PreviewProfile } from '@/components/matching-preview/preview-types'
import ProfileBuilder from '@/components/profile/ProfileBuilder'
import PublishedProfileView from '@/components/profile/PublishedProfileView'
import { getBrowserSupabase, hasBrowserSupabaseConfig } from '@/lib/supabase/browser'

const DRAFT_KEY = 'weld_profile_draft'

type PageMode = 'loading' | 'unauthed' | 'empty' | 'published' | 'editing'

export default function ProfilePage() {
  const router = useRouter()
  const [mode, setMode] = useState<PageMode>('loading')
  const [publishedProfile, setPublishedProfile] = useState<PreviewProfile | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [builderKey, setBuilderKey] = useState(0)
  const [hasDraft, setHasDraft] = useState(false)

  useEffect(() => {
    if (!hasBrowserSupabaseConfig()) {
      setMode('unauthed')
      return
    }

    const supabase = getBrowserSupabase()

    supabase.auth.getSession().then(async ({ data }) => {
      const session = data.session
      if (!session) {
        setMode('unauthed')
        return
      }

      setToken(session.access_token)

      try {
        const res = await fetch('/api/account/profile', {
          headers: { Authorization: `Bearer ${session.access_token}` },
          cache: 'no-store',
        })
        if (res.ok) {
          const json = await res.json()
          if (json.profile?.publishedProfile) {
            setPublishedProfile(json.profile.publishedProfile as PreviewProfile)
            setMode('published')
            return
          }
          setHasDraft(Boolean(json.profile?.draft))
        }
      } catch {}

      setMode('empty')
    })
  }, [])

  function handlePublished(profile: PreviewProfile) {
    setPublishedProfile(profile)
    setMode('published')
  }

  async function handleDelete() {
    try { localStorage.removeItem(DRAFT_KEY) } catch {}

    if (token) {
      const response = await fetch('/api/account/profile', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) throw new Error('Could not delete profile.')
    }

    setPublishedProfile(null)
    setHasDraft(false)
    setBuilderKey(k => k + 1)
    router.push('/home')
  }

  // Full-screen editor — hides the nav
  if (mode === 'editing') {
    return (
      <ProfileBuilder
        key={builderKey}
        onPublished={handlePublished}
        onDelete={handleDelete}
        initialPhase={publishedProfile ? 'editor' : 'identity'}
        onCancel={publishedProfile ? () => setMode('published') : undefined}
      />
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a]">
      <AppNav />

      {mode === 'loading' && (
        <div className="flex flex-1 items-center justify-center">
          <p className="font-mono text-sm text-white/30">Loading…</p>
        </div>
      )}

      {mode === 'unauthed' && (
        <div className="flex flex-col items-center justify-center gap-5 py-32">
          <p className="font-mono text-sm text-white/50">
            You need to be logged in to view this page.
          </p>
          <Link
            href="/login"
            className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.13em] text-white/60 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white/90"
          >
            Log in →
          </Link>
        </div>
      )}

      {mode === 'empty' && (
        <main className="flex flex-1 items-center justify-center px-6 py-24">
          <section className="w-full max-w-[560px] rounded-[24px] border border-white/10 bg-white/[0.04] p-8 text-center shadow-[0_24px_70px_rgba(0,0,0,0.22)]">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#FFBE74]">
              Profile
            </p>
            <h1
              className="mt-4 text-4xl italic text-[#FFF7F1]"
              style={{ fontFamily: 'var(--font-instrument-serif)' }}
            >
              {hasDraft ? 'Finish your profile' : 'Make your profile'}
            </h1>
            <p className="mx-auto mt-4 max-w-[420px] text-sm leading-7 text-white/52">
              Your profile is what studios and developers see before they match with you.
              Set it up when you are ready, then review the card before publishing.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setMode('editing')}
                className="rounded-full border border-[#E84624]/45 bg-[#E84624]/14 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.13em] text-[#FF9B7F] transition hover:border-[#E84624]/70 hover:bg-[#E84624]/20 hover:text-[#FFD1C4]"
              >
                {hasDraft ? 'Continue profile' : 'Make profile'}
              </button>
              <Link
                href="/home"
                className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 font-mono text-[10px] uppercase tracking-[0.13em] text-white/55 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white/80"
              >
                Back home
              </Link>
            </div>
          </section>
        </main>
      )}

      {mode === 'published' && publishedProfile && (
        <PublishedProfileView
          profile={publishedProfile}
          onEdit={() => setMode('editing')}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
