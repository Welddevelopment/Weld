import { NextRequest, NextResponse } from 'next/server'

import { getSupabaseUserFromRequest } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const auth = await getSupabaseUserFromRequest(request)
  if (!auth.ok) {
    return NextResponse.json({ ok: false, message: auth.message }, { status: auth.status })
  }

  const body = await request.json().catch(() => null)
  const { recipientId } = (body ?? {}) as Record<string, unknown>

  if (typeof recipientId !== 'string' || !recipientId) {
    return NextResponse.json({ ok: false, message: 'Missing recipientId.' }, { status: 400 })
  }

  if (recipientId === auth.user.id) {
    return NextResponse.json({ ok: false, message: 'Cannot message yourself.' }, { status: 400 })
  }

  // Allow if either party has liked the other
  const [{ data: callerLiked }, { data: recipientLiked }] = await Promise.all([
    auth.client.from('swipes').select('id').eq('swiper_id', auth.user.id).eq('target_id', recipientId).eq('action', 'like').maybeSingle(),
    auth.client.from('swipes').select('id').eq('swiper_id', recipientId).eq('target_id', auth.user.id).eq('action', 'like').maybeSingle(),
  ])

  if (!callerLiked && !recipientLiked) {
    return NextResponse.json(
      { ok: false, message: 'You can only message someone who has liked you or who you have liked.' },
      { status: 403 }
    )
  }

  // Check for existing conversation in both orderings (A→B or B→A)
  const [{ data: asInitiator }, { data: asRecipient }] = await Promise.all([
    auth.client
      .from('conversations')
      .select('id')
      .eq('initiator_id', auth.user.id)
      .eq('recipient_id', recipientId)
      .maybeSingle(),
    auth.client
      .from('conversations')
      .select('id')
      .eq('initiator_id', recipientId)
      .eq('recipient_id', auth.user.id)
      .maybeSingle(),
  ])

  const existing = asInitiator ?? asRecipient
  if (existing) {
    return NextResponse.json({ ok: true, conversationId: existing.id })
  }

  const { data: newConv, error } = await auth.client
    .from('conversations')
    .insert({ initiator_id: auth.user.id, recipient_id: recipientId })
    .select('id')
    .single()

  if (error || !newConv) {
    return NextResponse.json(
      { ok: false, message: `Could not create conversation: ${error?.message ?? 'unknown error'}` },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true, conversationId: newConv.id })
}
