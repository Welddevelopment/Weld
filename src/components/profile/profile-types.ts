import { PreviewProfile, PreviewProfileType, DevWork, TopGame } from '../matching-preview/preview-types'

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
  selectedSkills: Array<{ name: string; description: string }>
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
