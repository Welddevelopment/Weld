import type { PreviewProfile } from '@/components/matching-preview/preview-types'

export const EXPERIENCE_OPTIONS = ['<1', '1-2', '3-4', '5+']
export const TEAM_SIZE_OPTIONS = ['1-2', '3-4', '5-9', '10-19', '20+']
export const DEV_PLAY_OPTIONS = ['<50M', '50-74M', '75-99M', '100M+']
export const STUDIO_PLAY_OPTIONS = ['<30M', '30-49M', '50M+']
export const STUDIO_TOP_CCU_OPTIONS = ['<40K', '40-59K', '60K+']
export const STUDIO_CURRENT_CCU_OPTIONS = ['<10K', '10-19K', '20K+']
export const STUDIO_STATUS_OPTIONS = ['Hiring Now', 'Open to Offers']
export const BUDGET_OPTIONS = ['USD', 'Robux', 'Mixed', 'Fixed']
export const RATE_OPTIONS = ['USD', 'Robux', 'Fixed', 'Hourly']
export const CREATOR_LEVEL_OPTIONS = ['Verified', 'Pro Developer']
export const DEV_VALUE_OPTIONS = ['<$5K', '$5K-$9.9K', '$10K+']
export const DEV_MAX_VALUE_OPTIONS = ['<$2K', '$2K-$4.9K', '$5K+']

export type FilterState = {
  skillFilters: Set<string>
  rangeFilter: string | null
  playFilter: string | null
  topCcuFilter: string | null
  currentCcuFilter: string | null
  statusFilter: string | null
  budgetFilter: string | null
  rateFilter: string | null
  badgeFilter: string | null
  valueFilter: string | null
  maxValueFilter: string | null
}

export function createFilterState(): FilterState {
  return {
    skillFilters: new Set(),
    rangeFilter: null,
    playFilter: null,
    topCcuFilter: null,
    currentCcuFilter: null,
    statusFilter: null,
    budgetFilter: null,
    rateFilter: null,
    badgeFilter: null,
    valueFilter: null,
    maxValueFilter: null,
  }
}

export function countActiveFilters(filters: FilterState): number {
  return [
    filters.rangeFilter,
    filters.playFilter,
    filters.topCcuFilter,
    filters.currentCcuFilter,
    filters.statusFilter,
    filters.budgetFilter,
    filters.rateFilter,
    filters.badgeFilter,
    filters.valueFilter,
    filters.maxValueFilter,
  ].filter(Boolean).length + filters.skillFilters.size
}

export function getSkillFilterOptions(profiles: PreviewProfile[]): string[] {
  const opts = new Set<string>()
  profiles.forEach(p => {
    if (p.type === 'dev') p.skills?.forEach(s => opts.add(s.name))
    else p.skillsNeeded?.forEach(s => opts.add(s.name))
  })
  return Array.from(opts).sort()
}

function extractExperienceYears(profile: PreviewProfile) {
  if (/<\s*1\s*yr/i.test(profile.role)) return 0
  return Number(profile.role.match(/(\d+)\s*yr/i)?.[1] ?? NaN)
}

function extractTeamSize(profile: PreviewProfile) {
  return Number(profile.role.match(/(\d+)\s*members/i)?.[1] ?? NaN)
}

function parsePlayMillions(value: string) {
  const match = value.match(/([\d.]+)\s*([KMB])?/i)
  if (!match) return 0
  const amount = Number(match[1])
  if (Number.isNaN(amount)) return 0
  const unit = match[2]?.toUpperCase()
  if (unit === 'K') return amount / 1000
  if (unit === 'B') return amount * 1000
  return amount
}

function parseCompactCount(value: string) {
  const match = value.match(/([\d.]+)\s*([KMB])?/i)
  if (!match) return 0
  const amount = Number(match[1])
  if (Number.isNaN(amount)) return 0
  const unit = match[2]?.toUpperCase()
  if (unit === 'K') return amount * 1000
  if (unit === 'M') return amount * 1_000_000
  if (unit === 'B') return amount * 1_000_000_000
  return amount
}

function totalStudioCcu(profile: PreviewProfile, kind: 'top' | 'current') {
  if (profile.type !== 'studio') return 0
  return profile.topGames?.reduce((t, g) => t + parseCompactCount(kind === 'top' ? g.topCcu : g.currentCcu), 0) ?? 0
}

function totalProfilePlays(profile: PreviewProfile) {
  if (profile.type === 'dev') return profile.bestWork?.reduce((t, w) => t + parsePlayMillions(w.plays), 0) ?? 0
  return profile.topGames?.reduce((t, g) => t + parsePlayMillions(g.plays), 0) ?? 0
}

function totalDevProjectValue(profile: PreviewProfile) {
  if (profile.type !== 'dev') return 0
  return profile.bestWork?.reduce((t, w) => t + Number(w.amount), 0) ?? 0
}

function maxDevProjectValue(profile: PreviewProfile) {
  if (profile.type !== 'dev') return 0
  return profile.bestWork?.reduce((max, w) => Math.max(max, Number(w.amount)), 0) ?? 0
}

function extractMetaValue(profile: PreviewProfile, label: 'Budget' | 'Rate') {
  return profile.meta.match(new RegExp(`${label}:\\s*([^-]+)`))?.[1]?.trim() ?? null
}

function extractStatus(profile: PreviewProfile) {
  return profile.meta.split(' - ')[0] ?? null
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

function inPlayRange(totalMillions: number, range: string | null) {
  if (!range) return true
  if (range === '<50M') return totalMillions < 50
  if (range === '50-74M') return totalMillions >= 50 && totalMillions < 75
  if (range === '75-99M') return totalMillions >= 75 && totalMillions < 100
  if (range === '100M+') return totalMillions >= 100
  if (range === '<30M') return totalMillions < 30
  if (range === '30-49M') return totalMillions >= 30 && totalMillions < 50
  if (range === '50M+') return totalMillions >= 50
  return false
}

function inTopCcuRange(ccu: number, range: string | null) {
  if (!range) return true
  if (range === '<40K') return ccu < 40000
  if (range === '40-59K') return ccu >= 40000 && ccu < 60000
  if (range === '60K+') return ccu >= 60000
  return false
}

function inCurrentCcuRange(ccu: number, range: string | null) {
  if (!range) return true
  if (range === '<10K') return ccu < 10000
  if (range === '10-19K') return ccu >= 10000 && ccu < 20000
  if (range === '20K+') return ccu >= 20000
  return false
}

function inDevValueRange(value: number, range: string | null) {
  if (!range) return true
  if (range === '<$5K') return value < 5000
  if (range === '$5K-$9.9K') return value >= 5000 && value < 10000
  if (range === '$10K+') return value >= 10000
  return false
}

function inDevMaxValueRange(value: number, range: string | null) {
  if (!range) return true
  if (range === '<$2K') return value < 2000
  if (range === '$2K-$4.9K') return value >= 2000 && value < 5000
  if (range === '$5K+') return value >= 5000
  return false
}

export function applyFilters<T extends PreviewProfile>(profiles: T[], filters: FilterState): T[] {
  if (countActiveFilters(filters) === 0) return profiles
  const { skillFilters, rangeFilter, playFilter, topCcuFilter, currentCcuFilter, statusFilter, budgetFilter, rateFilter, badgeFilter, valueFilter, maxValueFilter } = filters

  return profiles.filter(p => {
    const matchesSkill = skillFilters.size === 0 ? true
      : p.type === 'dev'
        ? p.skills?.some(s => skillFilters.has(s.name)) ?? false
        : p.skillsNeeded?.some(s => skillFilters.has(s.name)) ?? false
    const matchesRange = p.type === 'dev'
      ? inExperienceRange(extractExperienceYears(p), rangeFilter)
      : inTeamSizeRange(extractTeamSize(p), rangeFilter)
    const matchesPlays = inPlayRange(totalProfilePlays(p), playFilter)
    const matchesStatus = p.type !== 'studio' || !statusFilter || extractStatus(p) === statusFilter
    const matchesBudget = p.type !== 'studio' || !budgetFilter || extractMetaValue(p, 'Budget') === budgetFilter
    const matchesTopCcu = p.type !== 'studio' || inTopCcuRange(totalStudioCcu(p, 'top'), topCcuFilter)
    const matchesCurrentCcu = p.type !== 'studio' || inCurrentCcuRange(totalStudioCcu(p, 'current'), currentCcuFilter)
    const matchesRate = p.type !== 'dev' || !rateFilter || extractMetaValue(p, 'Rate') === rateFilter
    const matchesBadge = p.type !== 'dev' || !badgeFilter || p.badge === badgeFilter
    const matchesValue = p.type !== 'dev' || inDevValueRange(totalDevProjectValue(p), valueFilter)
    const matchesMaxValue = p.type !== 'dev' || inDevMaxValueRange(maxDevProjectValue(p), maxValueFilter)
    return matchesSkill && matchesRange && matchesPlays && matchesStatus && matchesBudget
      && matchesTopCcu && matchesCurrentCcu && matchesRate && matchesBadge && matchesValue && matchesMaxValue
  })
}
