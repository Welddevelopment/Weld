export type PreviewProfileType = 'dev' | 'studio'

export type DevWork = {
  emoji: string
  title: string
  desc: string
  tools: string
  time: string
  amount: string
}

export type TopGame = {
  emoji: string
  title: string
  desc: string
  plays: string
  topCcu: string
  currentCcu: string
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
  skills?: Array<{ name: string; description: string }>
  portfolio?: { links: Array<{ name: string; url: string }> }
  bestWork?: DevWork[]
  socials?: Array<{ icon: string; label: string; url: string }>
  // Studio-only
  details?: string
  skillsNeeded?: Array<{ name: string; description: string }>
  topGames?: TopGame[]
}
