import { NextRequest, NextResponse } from 'next/server'
import type { SupabaseClient } from '@supabase/supabase-js'

import { getSupabaseUserFromRequest } from '@/lib/supabase/server'

export const maxDuration = 10

function isRecord(v: unknown): v is Record<string, unknown> {
  return Boolean(v && typeof v === 'object' && !Array.isArray(v))
}

async function hasReciprocalLike(client: SupabaseClient, swiperId: string, targetId: string) {
  const { data, error } = await client
    .from('swipes')
    .select('swiper_id')
    .eq('swiper_id', targetId)
    .eq('target_id', swiperId)
    .eq('action', 'like')
    .maybeSingle()

  return { matched: Boolean(data), error }
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
    .select('id,action')
    .eq('swiper_id', auth.user.id)
    .eq('target_id', swipedUserId)
    .maybeSingle()

  if (existingSwipeError) {
    return NextResponse.json({
      ok: false,
      message: `Could not check existing swipe: ${existingSwipeError.message}`,
    }, { status: 500 })
  }

  if (direction === 'like' && existingSwipe?.action === 'like') {
    const { matched, error } = await hasReciprocalLike(auth.client, auth.user.id, swipedUserId)
    if (error) {
      return NextResponse.json({
        ok: false,
        message: `Could not check for a match: ${error.message}`,
      }, { status: 500 })
    }

    return NextResponse.json({
      ok: true,
      match: matched,
      status: matched ? 'already_matched' : 'already_liked',
    })
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
    return NextResponse.json({ ok: true, match: false, status: 'passed' })
  }

  const { matched, error: reciprocalError } = await hasReciprocalLike(auth.client, auth.user.id, swipedUserId)
  if (reciprocalError) {
    return NextResponse.json({
      ok: false,
      message: `Could not check for a match: ${reciprocalError.message}`,
    }, { status: 500 })
  }

  return NextResponse.json({ ok: true, match: matched, status: matched ? 'matched' : 'liked' })
}
