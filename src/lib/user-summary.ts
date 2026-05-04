export type UserSummary = {
  userId: string
  name: string
  role: string
  bg: string
  robloxUserId: number
}

export function buildUserSummary(userId: string): UserSummary {
  const shortId = userId.slice(0, 8)

  return {
    userId,
    name: `Member ${shortId}`,
    role: 'Weld member',
    bg: 'linear-gradient(135deg,#1E1B16,#0E0C09)',
    robloxUserId: 1,
  }
}

export function buildMatchPayload(userId: string) {
  const summary = buildUserSummary(userId)

  return {
    id: userId,
    ...summary,
    badge: 'Saved',
    meta: '',
    bio: 'This member is available through matching and messages.',
    tags: [],
  }
}
