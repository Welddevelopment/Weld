import { NextRequest, NextResponse } from 'next/server'

import type { PreviewProfile } from '@/components/matching-preview/preview-types'
import { getSupabaseUserFromRequest } from '@/lib/supabase/server'

type ConversationRow = {
  id: string
  initiator_id: string
  recipient_id: string
  created_at: string
}

type MessagePreview = {
  conversation_id: string
  content: string
  sender_id: string
  created_at: string
}

export async function GET(request: NextRequest) {
  const auth = await getSupabaseUserFromRequest(request)
  if (!auth.ok) {
    return NextResponse.json({ ok: false, message: auth.message }, { status: auth.status })
  }

  const { data: convRows, error: convError } = await auth.client
    .from('conversations')
    .select('id,initiator_id,recipient_id,created_at')
    .or(`initiator_id.eq.${auth.user.id},recipient_id.eq.${auth.user.id}`)
    .order('created_at', { ascending: false })

  if (convError) {
    return NextResponse.json({ ok: false, message: convError.message }, { status: 500 })
  }

  const conversations = (convRows ?? []) as ConversationRow[]
  if (conversations.length === 0) {
    return NextResponse.json({ ok: true, conversations: [] })
  }

  const otherUserIds = Array.from(new Set(
    conversations.map(c => c.initiator_id === auth.user.id ? c.recipient_id : c.initiator_id)
  ))
  const conversationIds = conversations.map(c => c.id)

  // Fetch profiles, last messages, and match status in parallel
  const [profilesRes, messagesRes, myLikesRes, theirLikesRes] = await Promise.all([
    auth.client
      .from('user_profiles')
      .select('user_id,published_profile')
      .in('user_id', otherUserIds),
    auth.client
      .from('messages')
      .select('conversation_id,content,sender_id,created_at')
      .in('conversation_id', conversationIds)
      .order('created_at', { ascending: false })
      .limit(conversationIds.length * 10),
    auth.client
      .from('swipes')
      .select('target_id')
      .eq('swiper_id', auth.user.id)
      .eq('action', 'like')
      .in('target_id', otherUserIds),
    auth.client
      .from('swipes')
      .select('swiper_id')
      .eq('target_id', auth.user.id)
      .eq('action', 'like')
      .in('swiper_id', otherUserIds),
  ])

  const profileMap = new Map<string, PreviewProfile | null>(
    (profilesRes.data ?? []).map((r: { user_id: string; published_profile: PreviewProfile | null }) => [r.user_id, r.published_profile])
  )

  // Keep only the last message per conversation
  const lastMessageMap = new Map<string, MessagePreview>()
  for (const msg of (messagesRes.data ?? []) as MessagePreview[]) {
    if (!lastMessageMap.has(msg.conversation_id)) {
      lastMessageMap.set(msg.conversation_id, msg)
    }
  }

  const myLikedIds = new Set((myLikesRes.data ?? []).map((r: { target_id: string }) => r.target_id))
  const theyLikedIds = new Set((theirLikesRes.data ?? []).map((r: { swiper_id: string }) => r.swiper_id))

  const result = conversations.map(c => {
    const isInitiator = c.initiator_id === auth.user.id
    const otherId = isInitiator ? c.recipient_id : c.initiator_id
    const profile = profileMap.get(otherId)
    const lastMsg = lastMessageMap.get(c.id) ?? null
    const isMatched = myLikedIds.has(otherId) && theyLikedIds.has(otherId)

    return {
      id: c.id,
      isInitiator,
      isMatched,
      createdAt: c.created_at,
      otherUser: {
        userId: otherId,
        name: profile?.name ?? 'Unknown',
        role: profile?.role ?? '',
        bg: profile?.bg ?? 'linear-gradient(135deg,#1E1B16,#0E0C09)',
        robloxUserId: profile?.robloxUserId ?? 1,
      },
      lastMessage: lastMsg
        ? { content: lastMsg.content, senderId: lastMsg.sender_id, createdAt: lastMsg.created_at }
        : null,
    }
  })

  // Sort by most recent activity
  result.sort((a, b) => {
    const aTime = a.lastMessage?.createdAt ?? a.createdAt
    const bTime = b.lastMessage?.createdAt ?? b.createdAt
    return bTime.localeCompare(aTime)
  })

  return NextResponse.json({ ok: true, conversations: result })
}
