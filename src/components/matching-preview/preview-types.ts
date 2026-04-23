export type PreviewProfileType = 'dev' | 'studio'

export type PreviewProfile = {
  id: string
  type: PreviewProfileType
  name: string
  badge: string
  tagline: string
  bio: string
  tags: string[]
  status: string
  roleLine: string
  headerGradient: string
  stats: Array<{ label: string; value: string }>
  socials?: Array<{ label: string; url: string }>
  portfolioLinks?: Array<{ label: string; url: string }>
  bestWork?: Array<{
    emoji: string
    title: string
    description: string
    meta: Array<{ label: string; value: string }>
  }>
  hiringNeeds?: Array<{
    role: string
    description: string
  }>
}
