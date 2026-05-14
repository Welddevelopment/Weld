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
type EditStart = 'editor' | 'onboarding'

function hasSavedDraft(value: unknown) {
  return Boolean(
    value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.keys(value).length > 0
  )
}

export default function ProfilePage() {
  const router = useRouter()
  const [mode, setMode] = useState<PageMode>('loading')
  const [publishedProfile, setPublishedProfile] = useState<PreviewProfile | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [builderKey, setBuilderKey] = useState(0)
  const [hasDraft, setHasDraft] = useState(false)
  const [editStart, setEditStart] = useState<EditStart>('editor')

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
          setHasDraft(hasSavedDraft(json.profile?.draft))
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

  function startPublishedEdit(start: EditStart) {
    setEditStart(start)
    setMode('editing')
  }

  // Full-screen editor — hides the nav
  if (mode === 'editing') {
    const publishedStartPhase = editStart === 'onboarding' ? 'identity' : 'editor'

    return (
      <ProfileBuilder
        key={builderKey}
        onPublished={handlePublished}
        onDelete={handleDelete}
        initialPhase={publishedProfile ? publishedStartPhase : 'type'}
        onCancel={publishedProfile ? () => setMode('published') : undefined}
      />
    )
  }

  return (
    <div className="flex min-h-screen flex-col" style={{ background: 'radial-gradient(circle at 12% 10%, rgba(85,199,236,0.14) 0%, transparent 28rem), radial-gradient(circle at 88% 18%, rgba(111,93,242,0.10) 0%, transparent 24rem), linear-gradient(180deg,#fbfcff 0%,#eef3f8 54%,#f8fbff 100%)' }}>
      <AppNav />

      {mode === 'loading' && (
        <div className="flex flex-1 items-center justify-center">
          <p className="font-mono text-sm text-[rgba(8,24,39,0.35)]">Loading…</p>
        </div>
      )}

      {mode === 'unauthed' && (
        <div className="flex flex-col items-center justify-center gap-5 py-32">
          <p className="font-mono text-sm text-[rgba(8,24,39,0.5)]">
            You need to be logged in to view this page.
          </p>
          <Link
            href="/login"
            className="rounded-full border border-[rgba(8,24,39,0.12)] bg-white/80 px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.13em] text-[rgba(8,24,39,0.6)] transition hover:border-[rgba(18,103,216,0.3)] hover:text-[#1267d8]"
          >
            Log in →
          </Link>
        </div>
      )}

      {mode === 'empty' && (
        <main className="flex flex-1 items-center justify-center px-6 py-24">
          <section className="w-full max-w-[560px] rounded-[24px] border border-[rgba(8,24,39,0.08)] bg-[rgba(255,255,255,0.82)] p-8 text-center shadow-[0_30px_90px_rgba(8,24,39,0.10)]">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#1267d8]">
              Profile
            </p>
            <h1
              className="mt-4 text-4xl italic text-[#081827]"
              style={{ fontFamily: 'var(--font-instrument-serif)' }}
            >
              {hasDraft ? 'Finish your profile' : 'Make your profile'}
            </h1>
            <p className="mx-auto mt-4 max-w-[420px] text-sm leading-7 text-[rgba(8,24,39,0.52)]">
              Your profile is what studios and developers see before they match with you.
              Set it up when you are ready, then review the card before publishing.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setMode('editing')}
                className="rounded-full border border-[rgba(18,103,216,0.35)] bg-[rgba(18,103,216,0.08)] px-5 py-3 font-mono text-[10px] uppercase tracking-[0.13em] text-[#1267d8] transition hover:border-[rgba(18,103,216,0.55)] hover:bg-[rgba(18,103,216,0.14)]"
              >
                {hasDraft ? 'Continue profile' : 'Make profile'}
              </button>
              <Link
                href="/home"
                className="rounded-full border border-[rgba(8,24,39,0.10)] bg-[rgba(8,24,39,0.03)] px-5 py-3 font-mono text-[10px] uppercase tracking-[0.13em] text-[rgba(8,24,39,0.55)] transition hover:border-[rgba(8,24,39,0.18)] hover:text-[#081827]"
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
          onEdit={startPublishedEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
