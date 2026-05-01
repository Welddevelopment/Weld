'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import AppNav from '@/components/AppNav'
import type { PreviewProfile } from '@/components/matching-preview/preview-types'
import EditProfileModal from '@/components/profile/EditProfileModal'
import ProfileBuilder from '@/components/profile/ProfileBuilder'
import PublishedProfileView from '@/components/profile/PublishedProfileView'
import type { ProfileDraft } from '@/components/profile/profile-types'
import { getBrowserSupabase, hasBrowserSupabaseConfig } from '@/lib/supabase/browser'

const DRAFT_KEY = 'weld_profile_draft'

type PageMode = 'loading' | 'unauthed' | 'published' | 'editing'

export default function ProfilePage() {
  const [mode, setMode] = useState<PageMode>('loading')
  const [publishedProfile, setPublishedProfile] = useState<PreviewProfile | null>(null)
  const [profileDraft, setProfileDraft] = useState<ProfileDraft | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [builderKey, setBuilderKey] = useState(0)

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
          if (json.profile?.draft) {
            setProfileDraft(json.profile.draft as ProfileDraft)
          }
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
    setEditModalOpen(false)
    setMode('published')
  }

  function handleEditSaved(profile: PreviewProfile, draft: ProfileDraft) {
    setPublishedProfile(profile)
    setProfileDraft(draft)
    setEditModalOpen(false)
    setMode('published')
  }

  async function handleDelete() {
    try {
      localStorage.removeItem(DRAFT_KEY)
    } catch {}

    if (token) {
      try {
        await fetch('/api/account/profile', {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        })
      } catch {}
    }

    setPublishedProfile(null)
    setProfileDraft(null)
    setEditModalOpen(false)
    setMode('editing')
    setBuilderKey(k => k + 1)
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a]">
      <AppNav />

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

      {mode === 'published' && publishedProfile && (
        <PublishedProfileView
          profile={publishedProfile}
          onEdit={() => {
            if (token) {
              setEditModalOpen(true)
            } else {
              setMode('editing')
            }
          }}
          onDelete={handleDelete}
        />
      )}

      {mode === 'published' && publishedProfile && token && editModalOpen && (
        <EditProfileModal
          token={token}
          initialDraft={profileDraft}
          initialProfile={publishedProfile}
          onSaved={handleEditSaved}
          onClose={() => setEditModalOpen(false)}
        />
      )}

      {mode === 'editing' && (
        <ProfileBuilder
          key={builderKey}
          onPublished={handlePublished}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
