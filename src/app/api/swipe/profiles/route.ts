import { NextRequest, NextResponse } from 'next/server'

import { getSupabaseUserFromRequest } from '@/lib/supabase/server'
import type { PreviewProfile } from '@/components/matching-preview/preview-types'

export async function GET(request: NextRequest) {
  const auth = await getSupabaseUserFromRequest(request)
  if (!auth.ok) {
    return NextResponse.json({ ok: false, message: auth.message }, { status: auth.status })
  }

  const { data: ownRow } = await auth.client
    .from('user_profiles')
    .select('published_profile')
    .eq('user_id', auth.user.id)
    .maybeSingle()

  const ownType = (ownRow?.published_profile as PreviewProfile | null)?.type
  if (!ownType) {
    return NextResponse.json({ ok: true, profiles: [], noProfile: true })
  }

  const oppositeType = ownType === 'dev' ? 'studio' : 'dev'
  const { data: rows, error } = await auth.client
    .from('user_profiles')
    .select('user_id, published_profile')
    .not('published_profile', 'is', null)
    .eq('published_profile->>type', oppositeType)
    .neq('user_id', auth.user.id)

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
