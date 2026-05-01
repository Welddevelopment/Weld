'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'

import AppNav from '@/components/AppNav'
import PreviewExpandedModal, { type LikeFeedback } from '@/components/matching-preview/PreviewExpandedModal'
import PreviewFilterModal from '@/components/matching-preview/PreviewFilterModal'
import SwipeStack, { SwipeProfile, SwipeStackHandle } from '@/components/SwipeStack'
import { getBrowserSupabase, hasBrowserSupabaseConfig } from '@/lib/supabase/browser'
import {
  applyFilters,
  countActiveFilters,
  createFilterState,
  getSkillFilterOptions,
  type FilterState,
  BUDGET_OPTIONS,
  CREATOR_LEVEL_OPTIONS,
  DEV_MAX_VALUE_OPTIONS,
  DEV_PLAY_OPTIONS,
  DEV_VALUE_OPTIONS,
  EXPERIENCE_OPTIONS,
  RATE_OPTIONS,
  STUDIO_CURRENT_CCU_OPTIONS,
  STUDIO_PLAY_OPTIONS,
  STUDIO_STATUS_OPTIONS,
  STUDIO_TOP_CCU_OPTIONS,
  TEAM_SIZE_OPTIONS,
} from '@/lib/profile-filters'

type PageMode = 'loading' | 'unauthed' | 'ready'
type SwipeApiResponse = { ok?: boolean; match?: boolean; message?: string; status?: LikeFeedback | 'passed' }
type ExistingLikeNotice = { profile: SwipeProfile; kind: 'already_liked' | 'already_matched' }

function MutualMatchScreen({
  profile,
  onKeepMatching,
  onReachOut,
}: {
  profile: SwipeProfile
  onKeepMatching: () => void
  onReachOut: () => void
}) {
  return (
    <div className="mp-modal-overlay" onClick={onKeepMatching}>
      <div
        className="mp-carousel-card pos-center"
        style={{ position: 'relative', overflow: 'hidden', width: 340, height: 520 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="mp-match-overlay mp-its-a-match">
          <div className="mp-iam-heading">⚡ It&apos;s a Spark!</div>
          <div className="mp-iam-sub">You and {profile.name} sparked — time to reach out.</div>
          <div className="mp-iam-actions">
            <button className="mp-iam-reach-btn" onClick={onReachOut}>
              <div className="mp-iam-reach-icon">
                <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
              <span className="mp-iam-btn-label">Reach out</span>
            </button>
            <button className="mp-iam-scroll-btn" onClick={onKeepMatching}>
              <div className="mp-iam-scroll-circle">
                <svg viewBox="0 0 24 24" className="mp-iam-scroll-arrow"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
              <span className="mp-iam-btn-label">Keep swiping</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function LikeScreen({
  profile,
  onKeepMatching,
  onMessageThem,
}: {
  profile: SwipeProfile
  onKeepMatching: () => void
  onMessageThem: () => void
}) {
  return (
    <div className="mp-modal-overlay" onClick={onKeepMatching}>
      <div
        className="mp-carousel-card pos-center"
        style={{ position: 'relative', overflow: 'hidden', width: 340, height: 520 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="mp-match-overlay" style={{ background: 'linear-gradient(160deg,rgba(14,12,9,0.97),rgba(30,27,22,0.97))' }}>
          <div className="mp-iam-heading" style={{ fontSize: '1.4rem' }}>👍 Liked!</div>
          <div className="mp-iam-sub">You liked {profile.name}. Send them a message or keep swiping.</div>
          <div className="mp-iam-actions">
            <button className="mp-iam-reach-btn" onClick={onMessageThem}>
              <div className="mp-iam-reach-icon">
                <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
              <span className="mp-iam-btn-label">Message them</span>
            </button>
            <button className="mp-iam-scroll-btn" onClick={onKeepMatching}>
              <div className="mp-iam-scroll-circle">
                <svg viewBox="0 0 24 24" className="mp-iam-scroll-arrow"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
              <span className="mp-iam-btn-label">Keep swiping</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ExistingLikeScreen({
  notice,
  onKeepMatching,
}: {
  notice: ExistingLikeNotice
  onKeepMatching: () => void
}) {
  const alreadyMatched = notice.kind === 'already_matched'
  return (
    <div className="mp-modal-overlay" onClick={onKeepMatching}>
      <div
        className="mp-carousel-card pos-center"
        style={{ position: 'relative', overflow: 'hidden', width: 340, height: 520 }}
        onClick={e => e.stopPropagation()}
      >
        <div className={`mp-match-overlay${alreadyMatched ? ' mp-its-a-match' : ''}`}>
          <div className={alreadyMatched ? 'mp-iam-heading' : 'mp-match-overlay-text'}>
            {alreadyMatched
              ? `You've already sparked with ${notice.profile.name}`
              : `You have liked ${notice.profile.name} already`}
          </div>
          <div className={alreadyMatched ? 'mp-iam-sub' : 'mp-match-overlay-sub'}>
            {alreadyMatched
              ? 'You can keep swiping or change your interaction by passing on this profile.'
              : 'They are saved on your home page. You can still pass later if your mind changes.'}
          </div>
          <button className={alreadyMatched ? 'mp-iam-scroll-btn' : 'mp-match-keep-btn'} onClick={onKeepMatching}>
            {alreadyMatched ? (
              <>
                <div className="mp-iam-scroll-circle">
                  <svg viewBox="0 0 24 24" className="mp-iam-scroll-arrow"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
                <span className="mp-iam-btn-label">Keep swiping</span>
              </>
            ) : (
              'Keep swiping'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function SwipePage() {
  const router = useRouter()
  const [mode, setMode] = useState<PageMode>('loading')
  const [token, setToken] = useState<string | null>(null)
  const [profiles, setProfiles] = useState<SwipeProfile[]>([])
  const [noProfile, setNoProfile] = useState(false)
  const [ownType, setOwnType] = useState<'dev' | 'studio' | null>(null)
  const [loadingProfiles, setLoadingProfiles] = useState(false)
  const [modalProfile, setModalProfile] = useState<SwipeProfile | null>(null)
  const [matchedProfile, setMatchedProfile] = useState<SwipeProfile | null>(null)
  const [likedProfile, setLikedProfile] = useState<SwipeProfile | null>(null)
  const [existingLikeNotice, setExistingLikeNotice] = useState<ExistingLikeNotice | null>(null)
  const [autoLikeModal, setAutoLikeModal] = useState(false)
  const [swipeError, setSwipeError] = useState<string | null>(null)
  const [filters, setFilters] = useState<FilterState>(createFilterState())
  const [showFilters, setShowFilters] = useState(false)
  const [filterKey, setFilterKey] = useState(0)
  const swipeRef = useRef<SwipeStackHandle>(null)

  // dev sees studios → 'hiring'; studio sees devs → 'skills'
  const filterType = ownType === 'studio' ? 'skills' : 'hiring'
  const activeFilterCount = useMemo(() => countActiveFilters(filters), [filters])
  const skillFilterOptions = useMemo(() => getSkillFilterOptions(profiles), [profiles])
  const rangeFilterOptions = filterType === 'skills' ? EXPERIENCE_OPTIONS : TEAM_SIZE_OPTIONS
  const playFilterOptions = filterType === 'skills' ? DEV_PLAY_OPTIONS : STUDIO_PLAY_OPTIONS
  const filteredProfiles = useMemo(() => applyFilters(profiles, filters), [profiles, filters])

  const updateFilters = (updater: (f: FilterState) => FilterState) => {
    setFilters(updater)
    setFilterKey(k => k + 1)
  }

  const toggleSkill = (skill: string) => {
    updateFilters(current => {
      const next = new Set(current.skillFilters)
      if (filterType === 'skills') {
        if (next.has(skill)) next.delete(skill)
        else next.add(skill)
      } else {
        if (next.has(skill)) next.clear()
        else { next.clear(); next.add(skill) }
      }
      return { ...current, skillFilters: next }
    })
  }

  const toggleRange = (range: string) => updateFilters(f => ({ ...f, rangeFilter: f.rangeFilter === range ? null : range }))
  const togglePlay = (range: string) => updateFilters(f => ({ ...f, playFilter: f.playFilter === range ? null : range }))
  const toggleSingle = (key: keyof Omit<FilterState, 'skillFilters'>, value: string) =>
    updateFilters(f => ({ ...f, [key]: f[key] === value ? null : value }))

  const clearSkill = () => updateFilters(f => ({ ...f, skillFilters: new Set() }))
  const clearRange = () => updateFilters(f => ({ ...f, rangeFilter: null }))
  const clearPlay = () => updateFilters(f => ({ ...f, playFilter: null }))
  const clearSingle = (key: keyof Omit<FilterState, 'skillFilters'>) => updateFilters(f => ({ ...f, [key]: null }))
  const clearAll = () => updateFilters(() => createFilterState())

  const extraSections = filterType === 'skills'
    ? [
      { label: 'Rate type', options: RATE_OPTIONS, active: filters.rateFilter, onToggle: (v: string) => toggleSingle('rateFilter', v), onClear: () => clearSingle('rateFilter') },
      { label: 'Creator level', options: CREATOR_LEVEL_OPTIONS, active: filters.badgeFilter, onToggle: (v: string) => toggleSingle('badgeFilter', v), onClear: () => clearSingle('badgeFilter') },
      { label: 'Total highlighted projects value', options: DEV_VALUE_OPTIONS, active: filters.valueFilter, onToggle: (v: string) => toggleSingle('valueFilter', v), onClear: () => clearSingle('valueFilter') },
      { label: 'Most valuable project', options: DEV_MAX_VALUE_OPTIONS, active: filters.maxValueFilter, onToggle: (v: string) => toggleSingle('maxValueFilter', v), onClear: () => clearSingle('maxValueFilter') },
    ]
    : [
      { label: 'Studio status', options: STUDIO_STATUS_OPTIONS, active: filters.statusFilter, onToggle: (v: string) => toggleSingle('statusFilter', v), onClear: () => clearSingle('statusFilter') },
      { label: 'Budget type', options: BUDGET_OPTIONS, active: filters.budgetFilter, onToggle: (v: string) => toggleSingle('budgetFilter', v), onClear: () => clearSingle('budgetFilter') },
      { label: 'Top CCU', options: STUDIO_TOP_CCU_OPTIONS, active: filters.topCcuFilter, onToggle: (v: string) => toggleSingle('topCcuFilter', v), onClear: () => clearSingle('topCcuFilter') },
      { label: 'Current CCU', options: STUDIO_CURRENT_CCU_OPTIONS, active: filters.currentCcuFilter, onToggle: (v: string) => toggleSingle('currentCcuFilter', v), onClear: () => clearSingle('currentCcuFilter') },
    ]

  const openConversation = async (profile: SwipeProfile) => {
    if (!token) return
    try {
      const res = await fetch('/api/messages/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ recipientId: profile.userId }),
      })
      const json = await res.json().catch(() => null)
      if (json?.ok) router.push(`/messages?c=${json.conversationId}`)
    } catch { /* navigation fails silently */ }
  }

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
      .then(json => {
        if (json.ok) {
          setProfiles(json.profiles)
          setNoProfile(Boolean(json.noProfile))
          if (json.ownType) setOwnType(json.ownType as 'dev' | 'studio')
        }
      })
      .catch(() => {})
      .finally(() => setLoadingProfiles(false))
  }, [mode, token])

  const recordSwipe = async (userId: string, direction: 'like' | 'pass') => {
    if (!token) {
      setSwipeError('No active login session. Please log in again.')
      return null
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
        return null
      }
      setSwipeError(null)
      return json.status === 'passed' ? null : json.status ?? (json.match ? 'matched' : 'liked')
    } catch {
      setSwipeError('Swipe request failed before reaching the server.')
      return null
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
          <p className="font-mono text-sm text-white/50">You need to be logged in to swipe.</p>
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
          ) : noProfile ? (
            <div className="flex flex-col items-center gap-5 px-6 text-center">
              <p className="font-mono text-sm text-white/50">
                Publish a profile before you start swiping.
              </p>
              <p className="max-w-xs font-mono text-xs text-white/30">
                Your profile tells studios or devs who you are — without it we don&apos;t know who to show you.
              </p>
              <div className="flex gap-3">
                <Link
                  href="/profile"
                  className="rounded-full border border-white/15 bg-white/[0.06] px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.13em] text-white/70 transition hover:border-white/25 hover:bg-white/[0.10] hover:text-white/90"
                >
                  Make my profile
                </Link>
                <Link
                  href="/preview"
                  className="rounded-full border border-white/10 bg-transparent px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.13em] text-white/40 transition hover:border-white/20 hover:text-white/60"
                >
                  Preview first
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <button
                className={`mp-filter-btn${activeFilterCount > 0 ? ' mp-filter-btn--active' : ''}`}
                onClick={() => setShowFilters(true)}
              >
                <svg className="mp-filter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                  <line x1="11" y1="18" x2="13" y2="18" />
                </svg>
                Filters
                {activeFilterCount > 0 && (
                  <span className="mp-filter-badge">{activeFilterCount}</span>
                )}
              </button>

              {activeFilterCount > 0 && filteredProfiles.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-8 text-center">
                  <p className="font-mono text-sm text-white/60">No profiles match your filters</p>
                  <button
                    onClick={clearAll}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.13em] text-white/50 transition hover:border-white/20 hover:text-white/80"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <SwipeStack
                  key={filterKey}
                  ref={swipeRef}
                  profiles={filteredProfiles}
                  onLike={p => {
                    void recordSwipe(p.userId, 'like').then(feedback => {
                      if (feedback === 'matched') setMatchedProfile(p)
                      else if (feedback === 'liked') setLikedProfile(p)
                      else if (feedback === 'already_liked' || feedback === 'already_matched') {
                        setExistingLikeNotice({ profile: p, kind: feedback })
                      }
                    })
                  }}
                  onPass={p => { void recordSwipe(p.userId, 'pass') }}
                  onCardClick={p => setModalProfile(p)}
                  onCardLike={p => { setAutoLikeModal(true); setModalProfile(p) }}
                />
              )}
            </div>
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
            const feedback = await recordSwipe(modalProfile.userId, 'like')
            setTimeout(() => swipeRef.current?.swipe('right', { notify: false }), 0)
            return feedback ?? 'liked'
          }}
        />
      )}

      {matchedProfile && (
        <MutualMatchScreen
          profile={matchedProfile}
          onKeepMatching={() => setMatchedProfile(null)}
          onReachOut={() => { void openConversation(matchedProfile); setMatchedProfile(null) }}
        />
      )}

      {likedProfile && (
        <LikeScreen
          profile={likedProfile}
          onKeepMatching={() => setLikedProfile(null)}
          onMessageThem={() => { void openConversation(likedProfile); setLikedProfile(null) }}
        />
      )}

      {existingLikeNotice && (
        <ExistingLikeScreen
          notice={existingLikeNotice}
          onKeepMatching={() => setExistingLikeNotice(null)}
        />
      )}

      {showFilters && (
        <PreviewFilterModal
          filterType={filterType}
          skillOptions={skillFilterOptions}
          rangeOptions={rangeFilterOptions}
          playOptions={playFilterOptions}
          extraSections={extraSections}
          activeSkills={filters.skillFilters}
          activeRange={filters.rangeFilter}
          activePlay={filters.playFilter}
          onToggleSkill={toggleSkill}
          onToggleRange={toggleRange}
          onTogglePlay={togglePlay}
          onClearSkill={clearSkill}
          onClearRange={clearRange}
          onClearPlay={clearPlay}
          onClearAll={clearAll}
          onStartMatching={() => setShowFilters(false)}
          canStartMatching={filteredProfiles.length > 0}
          onClose={() => setShowFilters(false)}
        />
      )}
    </div>
  )
}
