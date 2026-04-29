import { NextRequest, NextResponse } from 'next/server'

import type { PreviewProfile } from '@/components/matching-preview/preview-types'
import { getSupabaseUserFromRequest } from '@/lib/supabase/server'

type SwipeRow = {
  swiper_id?: string
  target_id?: string
  created_at?: string
}

type ProfileRow = {
  user_id: string
  published_profile: PreviewProfile | null
}

function profilePayload(userId: string, profile: PreviewProfile | null | undefined) {
  return profile
    ? {
        ...profile,
        id: userId,
        userId,
      }
    : {
        id: userId,
        userId,
        name: 'Unknown profile',
        badge: 'Saved',
        role: userId,
        meta: '',
        type: 'dev',
        robloxUserId: 1,
        bg: 'linear-gradient(135deg,#1E1B16,#0E0C09)',
        bio: 'This saved profile could not be loaded yet.',
        tags: [],
      }
}

export async function GET(request: NextRequest) {
  const auth = await getSupabaseUserFromRequest(request)
  if (!auth.ok) {
    return NextResponse.json({ ok: false, message: auth.message }, { status: auth.status })
  }

  const { data: sentLikes, error: sentLikesError } = await auth.client
    .from('swipes')
    .select('target_id,created_at')
    .eq('swiper_id', auth.user.id)
    .eq('action', 'like')
    .order('created_at', { ascending: false })

  if (sentLikesError) {
    return NextResponse.json({
      ok: false,
      message: `Could not load saved likes: ${sentLikesError.message}`,
    }, { status: 500 })
  }

  const { data: receivedLikes, error: receivedLikesError } = await auth.client
    .from('swipes')
    .select('swiper_id,created_at')
    .eq('target_id', auth.user.id)
    .eq('action', 'like')
    .order('created_at', { ascending: false })

  if (receivedLikesError) {
    return NextResponse.json({
      ok: false,
      message: `Could not load matches: ${receivedLikesError.message}`,
    }, { status: 500 })
  }

  const likedRows = (sentLikes ?? []) as SwipeRow[]
  const receivedRows = (receivedLikes ?? []) as SwipeRow[]
  const receivedIds = new Set(receivedRows.map(row => row.swiper_id).filter(Boolean))
  const likedOutIds = new Set(likedRows.map(row => row.target_id).filter(Boolean))
  const matchedIds = new Set(
    likedRows
      .map(row => row.target_id)
      .filter((id): id is string => Boolean(id && receivedIds.has(id)))
  )

  // Inbound likes: someone liked you but you haven't liked them back (not a mutual match yet)
  const inboundRows = receivedRows.filter(
    (row): row is SwipeRow & { swiper_id: string } =>
      Boolean(row.swiper_id && !likedOutIds.has(row.swiper_id))
  )

  const outboundProfileIds = Array.from(new Set(likedRows.map(row => row.target_id).filter(Boolean))) as string[]
  const inboundProfileIds = inboundRows.map(row => row.swiper_id)
  const allProfileIds = Array.from(new Set([...outboundProfileIds, ...inboundProfileIds]))

  let profileRows: ProfileRow[] = []
  if (allProfileIds.length > 0) {
    const { data, error } = await auth.client
      .from('user_profiles')
      .select('user_id,published_profile')
      .in('user_id', allProfileIds)

    if (error) {
      return NextResponse.json({
        ok: false,
        message: `Could not load saved profiles: ${error.message}`,
      }, { status: 500 })
    }

    profileRows = (data ?? []) as ProfileRow[]
  }

  const profilesByUserId = new Map(
    profileRows.map(row => [row.user_id, row.published_profile])
  )

  const likes = likedRows
    .filter((row): row is SwipeRow & { target_id: string } => Boolean(row.target_id))
    .map(row => ({
      profile: profilePayload(row.target_id, profilesByUserId.get(row.target_id)),
      likedAt: row.created_at ?? null,
      matched: matchedIds.has(row.target_id),
    }))

  const matches = likes.filter(item => item.matched)

  const inboundLikes = inboundRows.map(row => ({
    profile: profilePayload(row.swiper_id, profilesByUserId.get(row.swiper_id)),
    likedAt: row.created_at ?? null,
    matched: false,
  }))

  return NextResponse.json({
    ok: true,
    likes,
    matches,
    inboundLikes,
  })
}
