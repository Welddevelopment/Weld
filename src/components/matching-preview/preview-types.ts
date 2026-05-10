export type PreviewProfileType = 'dev' | 'studio'

export type DevWork = {
  emoji: string
  title: string
  desc: string
  tools: string
  time: string
  amount: string
  plays: string
  imageUrl?: string
}

export type TopGame = {
  emoji: string
  title: string
  desc: string
  plays: string
  topCcu: string
  currentCcu: string
  imageUrl?: string
  gameUrl?: string
  skills?: string[]
  genre?: string
  likes?: string
  updatedAgo?: string
}

export type ProfileStats = {
  experience: string
  projects: string
  scriptsBuilt: string
  onTime: string
}

export type WorkSummary = {
  totalProjects: string
  linesOfCode: string
  totalHours: string
  commitment: string
}

export type PreviewProfile = {
  id: string
  type: PreviewProfileType
  robloxUserId: number
  bg: string
  badge: string
  name: string
  role: string
  bio: string
  tags: string[]
  meta: string
  // Dev-only
  skills?: Array<{ name: string; description: string; experienceMonths?: number; pastWorks?: number; categories?: Array<{ icon?: string; name: string; description: string; detail?: string; works?: number; avgPrice?: string; priceType?: 'hourly' | 'commission' }>; resources?: Array<{ label: string; url: string }> }>
  portfolio?: { links: Array<{ name: string; url: string }> }
  bestWork?: DevWork[]
  socials?: Array<{ icon: string; label: string; url: string }>
  stats?: ProfileStats
  workSummary?: WorkSummary
  // Studio-only
  details?: string
  skillsNeeded?: Array<{ name: string; description: string }>
  topGames?: TopGame[]
  hiring?: boolean
  rateMin?: number
  rateMax?: number
  rateType?: string
  rateNote?: string
  openRoles?: Array<{ skill: string; title: string; description?: string; payType?: string; payMin?: number | null; payMax?: number | null }>
  about?: string
  studioStats?: { yearsBuilding?: string; projectsShipped?: string; totalVisits?: string; onTimeDelivery?: string }
}
