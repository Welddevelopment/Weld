import { NextRequest, NextResponse } from 'next/server'
import type { SupabaseClient } from '@supabase/supabase-js'

import { getSupabaseUserFromRequest } from '@/lib/supabase/server'

type ConvRow = { id: string; initiator_id: string; recipient_id: string }

async function getConversation(
  client: SupabaseClient,
  conversationId: string,
  userId: string
): Promise<{ conv: ConvRow | null; error: string | null }> {
  const { data, error } = await client
    .from('conversations')
    .select('id,initiator_id,recipient_id')
    .eq('id', conversationId)
    .maybeSingle()

  if (error || !data) return { conv: null, error: 'Conversation not found.' }

  const isParticipant = data.initiator_id === userId || data.recipient_id === userId
  if (!isParticipant) return { conv: null, error: 'Not a participant in this conversation.' }

  return { conv: data as ConvRow, error: null }
}

async function checkMatched(client: SupabaseClient, userA: string, userB: string) {
  const [{ data: aLikedB }, { data: bLikedA }] = await Promise.all([
    client.from('swipes').select('id').eq('swiper_id', userA).eq('target_id', userB).eq('action', 'like').maybeSingle(),
    client.from('swipes').select('id').eq('swiper_id', userB).eq('target_id', userA).eq('action', 'like').maybeSingle(),
  ])
  return Boolean(aLikedB && bLikedA)
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await getSupabaseUserFromRequest(request)
  if (!auth.ok) {
    return NextResponse.json({ ok: false, message: auth.message }, { status: auth.status })
  }

  const { conv, error } = await getConversation(auth.client, params.id, auth.user.id)
  if (!conv) {
    return NextResponse.json({ ok: false, message: error }, { status: 404 })
  }

  const { data: messages, error: msgError } = await auth.client
    .from('messages')
    .select('id,sender_id,content,created_at')
    .eq('conversation_id', params.id)
    .order('created_at', { ascending: true })
    .limit(100)

  if (msgError) {
    return NextResponse.json({ ok: false, message: msgError.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, messages: messages ?? [] })
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await getSupabaseUserFromRequest(request)
  if (!auth.ok) {
    return NextResponse.json({ ok: false, message: auth.message }, { status: auth.status })
  }

  const body = await request.json().catch(() => null)
  const { content } = (body ?? {}) as Record<string, unknown>

  if (typeof content !== 'string' || !content.trim()) {
    return NextResponse.json({ ok: false, message: 'Message content is required.' }, { status: 400 })
  }

  const { conv, error } = await getConversation(auth.client, params.id, auth.user.id)
  if (!conv) {
    return NextResponse.json({ ok: false, message: error }, { status: 404 })
  }

  const isInitiator = conv.initiator_id === auth.user.id
  const otherId = isInitiator ? conv.recipient_id : conv.initiator_id

  // Enforce 1-message limit: only applies to the initiator before a mutual match
  if (isInitiator) {
    const matched = await checkMatched(auth.client, auth.user.id, otherId)
    if (!matched) {
      const { count } = await auth.client
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .eq('conversation_id', params.id)
        .eq('sender_id', auth.user.id)

      if ((count ?? 0) >= 1) {
        return NextResponse.json(
          { ok: false, limitReached: true, message: 'You can only send one message until they match with you.' },
          { status: 403 }
        )
      }
    }
  }

  const { data: msg, error: insertError } = await auth.client
    .from('messages')
    .insert({ conversation_id: params.id, sender_id: auth.user.id, content: content.trim() })
    .select('id,sender_id,content,created_at')
    .single()

  if (insertError || !msg) {
    return NextResponse.json(
      { ok: false, message: `Could not send message: ${insertError?.message ?? 'unknown error'}` },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true, message: msg })
}
