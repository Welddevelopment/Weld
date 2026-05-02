'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import AppNav from '@/components/AppNav'
import type { PreviewProfile } from '@/components/matching-preview/preview-types'
import ProfileBuilder from '@/components/profile/ProfileBuilder'
import PublishedProfileView from '@/components/profile/PublishedProfileView'
import { getBrowserSupabase, hasBrowserSupabaseConfig } from '@/lib/supabase/browser'

type PageMode = 'loading' | 'unauthed' | 'published' | 'editing'

export default function ProfilePage() {
  const [mode, setMode] = useState<PageMode>('loading')
  const [publishedProfile, setPublishedProfile] = useState<PreviewProfile | null>(null)

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
        }
      } catch {}

      setMode('editing')
    })
  }, [])

  function handlePublished(profile: PreviewProfile) {
    setPublishedProfile(profile)
    setMode('published')
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a]">
      <AppNav />

      {mode === 'unauthed' && (
        <main className="acct-shell">
          <section className="acct-card">
            <span className="acct-eyebrow">Profile</span>
            <h1 className="acct-title">Sign in to build your profile</h1>
            <div className="acct-empty">
              <p>Your draft saves to your account so it follows you across devices and matches.</p>
              <div className="acct-actions">
                <Link href="/login" className="acct-btn acct-btn--primary">Log in</Link>
                <Link href="/signup" className="acct-btn acct-btn--ghost">Create account</Link>
              </div>
            </div>
          </section>
        </main>
      )}

      {mode === 'published' && publishedProfile && (
        <PublishedProfileView
          profile={publishedProfile}
          onEdit={() => setMode('editing')}
        />
      )}

      {mode === 'editing' && (
        <ProfileBuilder onPublished={handlePublished} />
      )}
    </div>
  )
}
