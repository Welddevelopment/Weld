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

  const swipeAction = direction === 'like' ? 'like' : 'pass'
  const { data: existingSwipe, error: existingSwipeError } = await auth.client
    .from('swipes')
    .select('id')
    .eq('swiper_id', auth.user.id)
    .eq('target_id', swipedUserId)
    .maybeSingle()

  if (existingSwipeError) {
    return NextResponse.json({
      ok: false,
      message: `Could not check existing swipe: ${existingSwipeError.message}`,
    }, { status: 500 })
  }

  const writeQuery = existingSwipe
    ? auth.client.from('swipes').update({ action: swipeAction }).eq('id', existingSwipe.id)
    : auth.client.from('swipes').insert({
        swiper_id: auth.user.id,
        target_id: swipedUserId,
        action: swipeAction,
      })

  const { error } = await writeQuery

  if (error) {
    return NextResponse.json({
      ok: false,
      message: `Could not record swipe: ${error.message}`,
    }, { status: 500 })
  }

  if (direction !== 'like') {
    return NextResponse.json({ ok: true, match: false })
  }

  const { data: reciprocalSwipe, error: reciprocalError } = await auth.client
    .from('swipes')
    .select('swiper_id')
    .eq('swiper_id', swipedUserId)
    .eq('target_id', auth.user.id)
    .eq('action', 'like')
    .maybeSingle()

  if (reciprocalError) {
    return NextResponse.json({
      ok: false,
      message: `Could not check for a match: ${reciprocalError.message}`,
    }, { status: 500 })
  }

  return NextResponse.json({ ok: true, match: Boolean(reciprocalSwipe) })
}
