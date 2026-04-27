'use client'

import { useState, useMemo } from 'react'
import { PreviewProfile, PreviewProfileType } from './preview-types'
import { PREVIEW_DEVS, PREVIEW_STUDIOS } from './preview-data'
import PreviewStack from './PreviewStack'
import PreviewExpandedModal from './PreviewExpandedModal'
import PreviewFilterModal from './PreviewFilterModal'

const EXPERIENCE_OPTIONS = ['<1', '1-2', '3-4', '5+']
const TEAM_SIZE_OPTIONS = ['1-2', '3-4', '5-9', '10-19', '20+']

type PreviewFilterState = {
  skillFilters: Set<string>
  rangeFilter: string | null
}

interface Props {
  audience?: PreviewProfileType
}

function createFilterState(): PreviewFilterState {
  return { skillFilters: new Set(), rangeFilter: null }
}

function extractExperienceYears(profile: PreviewProfile) {
  if (/<\s*1\s*yr/i.test(profile.role)) return 0
  return Number(profile.role.match(/(\d+)\s*yr/i)?.[1] ?? NaN)
}

function extractTeamSize(profile: PreviewProfile) {
  return Number(profile.role.match(/(\d+)\s*members/i)?.[1] ?? NaN)
}

function inExperienceRange(years: number, range: string | null) {
  if (!range || Number.isNaN(years)) return !range
  if (range === '<1') return years < 1
  if (range === '1-2') return years >= 1 && years <= 2
  if (range === '3-4') return years >= 3 && years <= 4
  if (range === '5+') return years >= 5
  return false
}

function inTeamSizeRange(size: number, range: string | null) {
  if (!range || Number.isNaN(size)) return !range
  if (range === '1-2') return size >= 1 && size <= 2
  if (range === '3-4') return size >= 3 && size <= 4
  if (range === '5-9') return size >= 5 && size <= 9
  if (range === '10-19') return size >= 10 && size <= 19
  if (range === '20+') return size >= 20
  return false
}

export default function MatchingPreview({ audience: initialAudience = 'dev' }: Props) {
  const [audience, setAudience] = useState<PreviewProfileType>(initialAudience)
  const [passed, setPassed] = useState<Set<string>>(new Set())
  const [liked, setLiked] = useState<Set<string>>(new Set())
  const [openProfileId, setOpenProfileId] = useState<string | null>(null)
  const [filtersByAudience, setFiltersByAudience] = useState<Record<PreviewProfileType, PreviewFilterState>>({
    dev: createFilterState(),
    studio: createFilterState(),
  })
  const [showFilters, setShowFilters] = useState(false)

  // When browsing as a dev you see studios; as a studio you see devs
  const allProfiles: PreviewProfile[] = audience === 'dev' ? PREVIEW_STUDIOS : PREVIEW_DEVS
  const filterType: 'skills' | 'hiring' = audience === 'studio' ? 'skills' : 'hiring'
  const activeFilters = filtersByAudience[audience]
  const activeSkillFilters = activeFilters.skillFilters
  const activeRangeFilter = activeFilters.rangeFilter

  const availableProfiles = useMemo(
    () => allProfiles.filter(p => !passed.has(p.id) && !liked.has(p.id)),
    [allProfiles, passed, liked]
  )

  // Filter options derived from the full dataset (not just available) so pills don't vanish as you swipe
  const skillFilterOptions = useMemo(() => {
    const opts = new Set<string>()
    allProfiles.forEach(p => {
      if (p.type === 'dev') {
        p.skills?.forEach(s => opts.add(s.name))
      } else {
        p.skillsNeeded?.forEach(s => opts.add(s.name))
      }
    })
    return Array.from(opts).sort()
  }, [allProfiles])
  const rangeFilterOptions = filterType === 'skills' ? EXPERIENCE_OPTIONS : TEAM_SIZE_OPTIONS
  const activeFilterCount = activeSkillFilters.size + (activeRangeFilter ? 1 : 0)

  // Profiles visible in the stack — available AND passing active filters
  const displayProfiles = useMemo(() => {
    if (activeFilterCount === 0) return availableProfiles
    return availableProfiles.filter(p => {
      const matchesSkill = activeSkillFilters.size > 0
        ? p.type === 'dev'
          ? p.skills?.some(s => activeSkillFilters.has(s.name)) ?? false
          : p.skillsNeeded?.some(s => activeSkillFilters.has(s.name)) ?? false
        : true
      const matchesRange = p.type === 'dev'
        ? inExperienceRange(extractExperienceYears(p), activeRangeFilter)
        : inTeamSizeRange(extractTeamSize(p), activeRangeFilter)
      return matchesSkill && matchesRange
    })
  }, [availableProfiles, activeFilterCount, activeSkillFilters, activeRangeFilter])

  const handleOpen = (id: string) => setOpenProfileId(id)
  const handleClose = () => setOpenProfileId(null)

  const handlePassed = (id: string) => {
    setPassed(prev => new Set(prev).add(id))
    const remaining = displayProfiles.filter(p => p.id !== id)
    if (remaining.length === 0) {
      setOpenProfileId(null)
    } else {
      const currentIdx = displayProfiles.findIndex(p => p.id === id)
      const next = remaining[currentIdx % remaining.length]
      setOpenProfileId(next.id)
    }
  }

  const handleLiked = (id: string) => {
    setLiked(prev => new Set(prev).add(id))
    const remaining = displayProfiles.filter(p => p.id !== id)
    if (remaining.length === 0) {
      setOpenProfileId(null)
    } else {
      const currentIdx = displayProfiles.findIndex(p => p.id === id)
      const next = remaining[currentIdx % remaining.length]
      setOpenProfileId(next.id)
    }
  }

  const updateActiveFilters = (updater: (current: PreviewFilterState) => PreviewFilterState) => {
    setFiltersByAudience(prev => ({
      ...prev,
      [audience]: updater(prev[audience]),
    }))
  }

  const toggleSkillFilter = (skill: string) => {
    updateActiveFilters(current => {
      const nextSkills = new Set(current.skillFilters)
      if (filterType === 'skills') {
        if (nextSkills.has(skill)) nextSkills.delete(skill)
        else nextSkills.add(skill)
      } else if (nextSkills.has(skill)) {
        nextSkills.clear()
      } else {
        nextSkills.clear()
        nextSkills.add(skill)
      }
      return { ...current, skillFilters: nextSkills }
    })
    setOpenProfileId(null)
  }

  const toggleRangeFilter = (range: string) => {
    updateActiveFilters(current => ({
      ...current,
      rangeFilter: current.rangeFilter === range ? null : range,
    }))
    setOpenProfileId(null)
  }

  const clearFilters = () => {
    updateActiveFilters(() => createFilterState())
    setOpenProfileId(null)
  }

  const clearSkillFilter = () => {
    updateActiveFilters(current => ({ ...current, skillFilters: new Set() }))
    setOpenProfileId(null)
  }

  const clearRangeFilter = () => {
    updateActiveFilters(current => ({ ...current, rangeFilter: null }))
    setOpenProfileId(null)
  }

  const startMatching = () => {
    const visibleProfiles = displayProfiles.slice(0, 8)
    const targetProfile = visibleProfiles[visibleProfiles.length - 1]
    if (!targetProfile) return
    setShowFilters(false)
    setOpenProfileId(targetProfile.id)
  }

  const switchAudience = (type: PreviewProfileType) => {
    setAudience(type)
    setPassed(new Set())
    setLiked(new Set())
    setOpenProfileId(null)
    setShowFilters(false)
  }

  const noMatchesFromFilter = availableProfiles.length > 0 && displayProfiles.length === 0

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Audience toggle */}
      <div className="mp-audience-toggle">
        <div
          className="mp-audience-pill"
          style={{ transform: audience === 'studio' ? 'translateX(100%)' : 'translateX(0)' }}
        />
        <button
          className={`mp-audience-btn${audience === 'dev' ? ' active' : ''}`}
          onClick={() => switchAudience('dev')}
        >
          I&apos;m a developer
        </button>
        <button
          className={`mp-audience-btn${audience === 'studio' ? ' active' : ''}`}
          onClick={() => switchAudience('studio')}
        >
          I&apos;m a studio
        </button>
      </div>

      {/* Filter button */}
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

      {/* Profile stack or empty states */}
      {noMatchesFromFilter ? (
        <div className="text-center py-8">
          <p className="text-white font-semibold mb-1">No profiles match</p>
          <p className="text-gray-600 text-sm mb-4">Try adjusting or clearing your filters</p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 rounded-full text-sm font-semibold transition-all hover:opacity-80"
            style={{ border: '1px solid rgba(232,70,36,.4)', color: '#E84624' }}
          >
            Clear filters
          </button>
        </div>
      ) : availableProfiles.length > 0 ? (
        <PreviewStack profiles={displayProfiles} onOpen={handleOpen} />
      ) : (
        <div className="text-center py-8">
          <p className="text-white font-semibold mb-1">You&apos;ve seen everyone</p>
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

      {openProfileId && displayProfiles.length > 0 && (
        <PreviewExpandedModal
          profiles={displayProfiles}
          initialId={openProfileId}
          onClose={handleClose}
          onPassed={handlePassed}
          onLiked={handleLiked}
        />
      )}

      {showFilters && (
        <PreviewFilterModal
          filterType={filterType}
          skillOptions={skillFilterOptions}
          rangeOptions={rangeFilterOptions}
          activeSkills={activeSkillFilters}
          activeRange={activeRangeFilter}
          onToggleSkill={toggleSkillFilter}
          onToggleRange={toggleRangeFilter}
          onClearSkill={clearSkillFilter}
          onClearRange={clearRangeFilter}
          onClearAll={clearFilters}
          onStartMatching={startMatching}
          canStartMatching={displayProfiles.length > 0}
          onClose={() => setShowFilters(false)}
        />
      )}
    </div>
  )
}
