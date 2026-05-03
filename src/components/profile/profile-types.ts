import { PreviewProfile, PreviewProfileType, DevWork, TopGame } from '../matching-preview/preview-types'

export type ProfileSkillDraft = {
  name: string
  description: string
  experienceMonths?: number
  pastWorks?: number
  categories?: Array<{ name: string; description: string; detail?: string; works?: number; avgPrice?: string; priceType?: 'hourly' | 'commission' }>
  resources?: Array<{ label: string; url: string }>
}

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
  availabilityStatus: string
  availabilityHours: string
  availabilityTimezone: string
  availabilityNote: string
  // Studio-specific
  teamSize: number | null
  status: string | null
  budgetType: string | null
  projectValue: string
  details: string
  hiring: boolean
  rateMin: number | null
  rateMax: number | null
  rateNote: string
  openRoles: Array<{ skill: string; title: string; description: string }>
  about: string
  studioStats: { yearsBuilding: string; projectsShipped: string; totalVisits: string; onTimeDelivery: string }
  // Shared
  selectedSkills: ProfileSkillDraft[]
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
    availabilityStatus: 'Available Now',
    availabilityHours: '',
    availabilityTimezone: '',
    availabilityNote: '',
    teamSize: null,
    status: null,
    budgetType: null,
    projectValue: '',
    details: '',
    hiring: false,
    rateMin: null,
    rateMax: null,
    rateNote: '',
    openRoles: [],
    about: '',
    studioStats: { yearsBuilding: '', projectsShipped: '', totalVisits: '', onTimeDelivery: '' },
    selectedSkills: [],
    portfolioLinks: [],
    socials: [],
    bestWork: [],
    topGames: [],
  }
}

function selectedSkillsFromProfile(profile: PreviewProfile) {
  const skills = profile.type === 'dev' ? profile.skills : profile.skillsNeeded
  if (skills && skills.length > 0) return skills
  return profile.tags.map(name => ({ name, description: '' }))
}

function stripSkillLevel(description: string) {
  return description.replace(/^\[(Beginner|Intermediate|Expert)\]\s*/i, '')
}

function profileSkillsFromDraft(skills: ProfileSkillDraft[]) {
  return skills.map(skill => ({
    ...skill,
    description: stripSkillLevel(skill.description),
    resources: skill.resources?.filter(resource => resource.url.trim()),
  }))
}

function parseExperienceYears(profile: PreviewProfile) {
  if (profile.role.includes('<1yr')) return 0
  const match = profile.role.match(/(\d+)yr/)
  return match ? Number(match[1]) : null
}

function parseTeamSize(profile: PreviewProfile) {
  const match = profile.role.match(/(\d+)\s+members/)
  return match ? Number(match[1]) : null
}

function metaValue(profile: PreviewProfile, label: string) {
  return profile.meta
    .split(' - ')
    .find(part => part.startsWith(`${label}: `))
    ?.replace(`${label}: `, '')
    .trim() ?? null
}

export function profileToDraft(profile: PreviewProfile): ProfileDraft {
  const draft = createDraft()
  const isDev = profile.type === 'dev'

  return {
    ...draft,
    type: profile.type,
    robloxUserId: profile.robloxUserId,
    bg: profile.bg,
    badge: profile.badge,
    name: profile.name,
    bio: profile.bio,
    experienceYears: isDev ? parseExperienceYears(profile) : null,
    rateType: isDev ? metaValue(profile, 'Rate') : null,
    availabilityStatus: isDev ? (profile.meta.split(' - ')[0] || 'Available Now') : 'Available Now',
    availabilityHours: '',
    availabilityTimezone: '',
    availabilityNote: '',
    teamSize: isDev ? null : parseTeamSize(profile),
    status: isDev ? null : profile.meta.split(' - ')[0] || null,
    budgetType: isDev ? null : metaValue(profile, 'Budget'),
    details: profile.details ?? '',
    hiring: profile.hiring ?? false,
    rateMin: profile.rateMin ?? null,
    rateMax: profile.rateMax ?? null,
    rateNote: profile.rateNote ?? '',
    openRoles: (profile.openRoles ?? []).map(r => ({ skill: r.skill ?? (r as any).icon ?? '', title: r.title, description: r.description ?? '' })),
    about: profile.about ?? '',
    studioStats: profile.studioStats
      ? { yearsBuilding: profile.studioStats.yearsBuilding ?? '', projectsShipped: profile.studioStats.projectsShipped ?? '', totalVisits: profile.studioStats.totalVisits ?? '', onTimeDelivery: profile.studioStats.onTimeDelivery ?? '' }
      : { yearsBuilding: '', projectsShipped: '', totalVisits: '', onTimeDelivery: '' },
    selectedSkills: selectedSkillsFromProfile(profile),
    portfolioLinks: profile.portfolio?.links ?? [],
    socials: profile.socials ?? [],
    bestWork: profile.bestWork ?? [],
    topGames: profile.topGames ?? [],
  }
}

export function draftToProfile(draft: ProfileDraft, id: string): PreviewProfile {
  const isDev = draft.type === 'dev'

  let role = ''
  let meta = ''
  let tags: string[] = []

  if (isDev) {
    const yr = draft.experienceYears ?? 0
    role = yr === 0 ? 'Developer - <1yr experience' : `Developer - ${yr}yr experience`
    const rateStr = draft.rateType
      ? (draft.rateAmount ? `${draft.rateAmount} ${draft.rateType}` : draft.rateType)
      : ''
    meta = [draft.availabilityStatus || 'Available Now', rateStr ? `Rate: ${rateStr}` : '', 'Remote'].filter(Boolean).join(' - ')
    tags = draft.selectedSkills.slice(0, 3).map(s => s.name)
  } else {
    const size = draft.teamSize ?? 0
    role = `Roblox Game Studio - ${size} members`
    const status = draft.status ?? ''
    const budget = draft.budgetType ?? ''
    meta = [status, budget ? `Budget: ${budget}` : '', 'Remote'].filter(Boolean).join(' - ')
    tags = draft.selectedSkills.slice(0, 3).map(s => s.name)
  }

  const profile: PreviewProfile = {
    id,
    type: draft.type,
    robloxUserId: draft.robloxUserId ?? 1,
    bg: draft.bg,
    badge: isDev ? draft.badge : (draft.badge || 'Studio'),
    name: draft.name || 'Your Name',
    role,
    bio: draft.bio,
    tags,
    meta,
  }

  if (isDev) {
    if (draft.selectedSkills.length > 0) profile.skills = profileSkillsFromDraft(draft.selectedSkills)
    if (draft.portfolioLinks.length > 0) profile.portfolio = { links: draft.portfolioLinks }
    if (draft.bestWork.length > 0) profile.bestWork = draft.bestWork
    if (draft.topGames.length > 0) profile.topGames = draft.topGames
    if (draft.socials.length > 0) profile.socials = draft.socials
  } else {
    if (draft.details) profile.details = draft.details
    const uniqueSkills = [...new Set(draft.openRoles.map(r => r.skill).filter(Boolean))]
    if (uniqueSkills.length > 0) profile.skillsNeeded = uniqueSkills.map(name => ({ name, description: '' }))
    if (draft.topGames.length > 0) profile.topGames = draft.topGames
    profile.hiring = draft.hiring
    if (draft.rateMin !== null) profile.rateMin = draft.rateMin
    if (draft.rateMax !== null) profile.rateMax = draft.rateMax
    if (draft.rateNote) profile.rateNote = draft.rateNote
    if (draft.rateType) profile.rateType = draft.rateType
    if (draft.openRoles.length > 0) profile.openRoles = draft.openRoles
    if (draft.about) profile.about = draft.about
    const ss = draft.studioStats
    if (ss.yearsBuilding || ss.projectsShipped || ss.totalVisits || ss.onTimeDelivery) profile.studioStats = ss
  }

  return profile
}
