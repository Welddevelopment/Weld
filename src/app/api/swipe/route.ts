import { NextRequest, NextResponse } from 'next/server'

import { getSupabaseUserFromRequest } from '@/lib/supabase/server'

function isRecord(v: unknown): v is Record<string, unknown> {
  return Boolean(v && typeof v === 'object' && !Array.isArray(v))
}

export async function POST(request: NextRequest) {
  const auth = await getSupabaseUserFromRequest(request)
  if (!auth.ok) {
    return NextResponse.json({ ok: false, message: auth.message }, { status: auth.status })
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  if (!isRecord(body)) {
    return NextResponse.json({ ok: false, message: 'Invalid body.' }, { status: 400 })
  }

  const { swipedUserId, direction } = body
  if (typeof swipedUserId !== 'string' || (direction !== 'like' && direction !== 'pass')) {
    return NextResponse.json({ ok: false, message: 'Missing swipedUserId or direction.' }, { status: 400 })
  }

  const { error } = await auth.client.from('swipes').upsert({
    swiper_id: auth.user.id,
    swiped_id: swipedUserId,
    direction,
  }, { onConflict: 'swiper_id,swiped_id' })

  if (error) {
    return NextResponse.json({ ok: false, message: 'Could not record swipe.' }, { status: 500 })
  }

  if (direction !== 'like') {
    return NextResponse.json({ ok: true, match: false })
  }

  const { data: reciprocalSwipe, error: reciprocalError } = await auth.client
    .from('swipes')
    .select('swiper_id')
    .eq('swiper_id', swipedUserId)
    .eq('swiped_id', auth.user.id)
    .eq('direction', 'like')
    .maybeSingle()

  if (reciprocalError) {
    return NextResponse.json({ ok: false, message: 'Could not check for a match.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, match: Boolean(reciprocalSwipe) })
}
