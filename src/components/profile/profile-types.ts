import { PreviewProfile, PreviewProfileType, DevWork, TopGame, Skill } from '../matching-preview/preview-types'

export type ProfileDraft = {
  type: PreviewProfileType
  robloxUserId: number | null
  bg: string
  badge: string
  name: string
  bio: string
  // Dev-specific
  experienceYears: number | null
  rateType: string | null
  rateAmount: string
  // Studio-specific
  teamSize: number | null
  status: string | null
  budgetType: string | null
  projectValue: string
  details: string
  // Shared
  selectedSkills: Skill[]
  portfolioLinks: Array<{ name: string; url: string }>
  socials: Array<{ icon: string; label: string; url: string }>
  bestWork: DevWork[]
  topGames: TopGame[]
}

export function createDraft(): ProfileDraft {
  return {
    type: 'dev',
    robloxUserId: null,
    bg: 'linear-gradient(135deg,#E84624,#FF8A5C)',
    badge: '',
    name: '',
    bio: '',
    experienceYears: null,
    rateType: null,
    rateAmount: '',
    teamSize: null,
    status: null,
    budgetType: null,
    projectValue: '',
    details: '',
    selectedSkills: [],
    portfolioLinks: [],
    socials: [],
    bestWork: [],
    topGames: [],
  }
}

export function draftToProfile(draft: ProfileDraft, id: string): PreviewProfile {
  const isDev = draft.type === 'dev'

  let role = ''
  let meta = ''
  let tags: string[] = []

  if (isDev) {
    const yr = draft.experienceYears ?? 1
    role = `Developer - ${yr}yr experience`
    const rate = draft.rateType
      ? `${draft.rateAmount ? draft.rateAmount + ' ' : ''}${draft.rateType}`
      : 'Rate negotiable'
    meta = rate
    tags = draft.selectedSkills.slice(0, 3).map(s => s.name)
  } else {
    const size = draft.teamSize ?? 1
    role = `Roblox Game Studio - ${size} members`
    const status = draft.status ?? 'Open to Offers'
    const budget = draft.budgetType ?? ''
    meta = [status, budget].filter(Boolean).join(' · ')
    tags = draft.selectedSkills.slice(0, 3).map(s => s.name)
  }

  const profile: PreviewProfile = {
    id,
    type: draft.type,
    robloxUserId: draft.robloxUserId ?? 1,
    bg: draft.bg,
    badge: draft.badge,
    name: draft.name || 'Your Name',
    role,
    bio: draft.bio,
    tags,
    meta,
  }

  if (isDev) {
    if (draft.selectedSkills.length > 0) profile.skills = draft.selectedSkills
    if (draft.portfolioLinks.length > 0) profile.portfolio = { links: draft.portfolioLinks }
    if (draft.bestWork.length > 0) profile.bestWork = draft.bestWork
    if (draft.socials.length > 0) profile.socials = draft.socials
  } else {
    if (draft.details) profile.details = draft.details
    if (draft.selectedSkills.length > 0) profile.skillsNeeded = draft.selectedSkills
    if (draft.topGames.length > 0) profile.topGames = draft.topGames
  }

  return profile
}

const RATE_TYPES = ['USD / hr', 'Robux / hr', 'Fixed USD', 'Fixed Robux']

export function profileToDraft(profile: PreviewProfile): ProfileDraft {
  const isDev = profile.type === 'dev'

  let experienceYears: number | null = null
  if (isDev) {
    const match = profile.role.match(/(\d+)yr/)
    if (match) experienceYears = parseInt(match[1])
  }

  let teamSize: number | null = null
  if (!isDev) {
    const match = profile.role.match(/(\d+) members/)
    if (match) teamSize = parseInt(match[1])
  }

  let rateType: string | null = null
  let rateAmount = ''
  if (isDev && profile.meta && profile.meta !== 'Rate negotiable') {
    for (const rt of RATE_TYPES) {
      if (profile.meta.includes(rt)) {
        rateType = rt
        rateAmount = profile.meta.replace(rt, '').trim()
        break
      }
    }
  }

  let status: string | null = null
  let budgetType: string | null = null
  if (!isDev && profile.meta) {
    const parts = profile.meta.split(' · ')
    status = parts[0] ?? null
    budgetType = parts[1] ?? null
  }

  return {
    type: profile.type,
    robloxUserId: profile.robloxUserId,
    bg: profile.bg,
    badge: profile.badge,
    name: profile.name,
    bio: profile.bio,
    experienceYears,
    rateType,
    rateAmount,
    teamSize,
    status,
    budgetType,
    projectValue: '',
    details: profile.details ?? '',
    selectedSkills: isDev ? (profile.skills ?? []) : (profile.skillsNeeded ?? []),
    portfolioLinks: profile.portfolio?.links ?? [],
    socials: profile.socials ?? [],
    bestWork: profile.bestWork ?? [],
    topGames: profile.topGames ?? [],
  }
}
