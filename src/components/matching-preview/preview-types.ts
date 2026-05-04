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
  skills?: string[]
  imageUrl?: string
  gameUrl?: string
}

export type WorkSummary = {
  totalProjects: string
  linesOfCode: string
  totalHours: string
  commitment: string
}

export type Skill = {
  name: string
  description: string
  categories?: Array<{ icon: string; name: string; description: string }>
  resources?: Array<{ label: string; url: string }>
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
  skills?: Skill[]
  portfolio?: { links: Array<{ name: string; url: string }> }
  bestWork?: DevWork[]
  workSummary?: WorkSummary
  socials?: Array<{ icon: string; label: string; url: string }>
  // Studio-only
  details?: string
  skillsNeeded?: Array<{ name: string; description: string }>
  topGames?: TopGame[]
}
