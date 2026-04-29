import { NextRequest, NextResponse } from 'next/server'

import { getSupabaseUserFromRequest } from '@/lib/supabase/server'
import type { PreviewProfile } from '@/components/matching-preview/preview-types'

export async function GET(request: NextRequest) {
  const auth = await getSupabaseUserFromRequest(request)
  if (!auth.ok) {
    return NextResponse.json({ ok: false, message: auth.message }, { status: auth.status })
  }

  const { data: swipes } = await auth.client
    .from('swipes')
    .select('target_id')
    .eq('swiper_id', auth.user.id)

  const swipedIds: string[] = (swipes ?? []).map((s: { target_id: string }) => s.target_id)
  const excludeIds = [auth.user.id, ...swipedIds]

  let query = auth.client
    .from('user_profiles')
    .select('user_id, published_profile')
    .not('published_profile', 'is', null)

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

  return NextResponse.json({ ok: true, profiles })
}
