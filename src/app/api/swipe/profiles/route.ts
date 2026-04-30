import { NextRequest, NextResponse } from 'next/server'

import { getSupabaseUserFromRequest } from '@/lib/supabase/server'
import type { PreviewProfile } from '@/components/matching-preview/preview-types'

export async function GET(request: NextRequest) {
  const auth = await getSupabaseUserFromRequest(request)
  if (!auth.ok) {
    return NextResponse.json({ ok: false, message: auth.message }, { status: auth.status })
  }

  // Fetch own profile type and already-swiped IDs in parallel
  const [{ data: ownRow }, { data: swipes }] = await Promise.all([
    auth.client
      .from('user_profiles')
      .select('published_profile')
      .eq('user_id', auth.user.id)
      .maybeSingle(),
    auth.client
      .from('swipes')
      .select('target_id')
      .eq('swiper_id', auth.user.id),
  ])

  const ownType = (ownRow?.published_profile as PreviewProfile | null)?.type
  if (!ownType) {
    return NextResponse.json({ ok: true, profiles: [], noProfile: true })
  }

  const oppositeType = ownType === 'dev' ? 'studio' : 'dev'
  const swipedIds: string[] = (swipes ?? []).map((s: { target_id: string }) => s.target_id)
  const excludeIds = [auth.user.id, ...swipedIds]

  let query = auth.client
    .from('user_profiles')
    .select('user_id, published_profile')
    .not('published_profile', 'is', null)
    .eq('published_profile->>type', oppositeType)

  if (excludeIds.length > 0) {
    query = query.not('user_id', 'in', `(${excludeIds.join(',')})`)
  }

  const { data: rows, error } = await query

  if (error) {
    return NextResponse.json({ ok: false, message: 'Could not load profiles.' }, { status: 500 })
  }

  const profiles = (rows ?? [])
    .filter((row: { user_id: string; published_profile: unknown }) => row.published_profile)
    .map((row: { user_id: string; published_profile: PreviewProfile }) => ({
      ...row.published_profile,
      id: row.user_id,
      userId: row.user_id,
    }))

  return NextResponse.json({ ok: true, profiles, noProfile: false, ownType })
}
