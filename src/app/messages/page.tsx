'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

import AppNav from '@/components/AppNav'
import ChatPanel from '@/components/ChatPanel'
import { getBrowserSupabase, hasBrowserSupabaseConfig } from '@/lib/supabase/browser'

type OtherUser = {
  userId: string
  name: string
  role: string
  bg: string
  robloxUserId: number
}

type ConversationSummary = {
  id: string
  isInitiator: boolean
  isMatched: boolean
  createdAt: string
  otherUser: OtherUser
  lastMessage: { content: string; senderId: string; createdAt: string } | null
}

type PageMode = 'loading' | 'unauthed' | 'ready'

function formatTime(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000)
  if (diffDays === 0) return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return d.toLocaleDateString(undefined, { weekday: 'short' })
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function ConversationRow({
  conv,
  currentUserId,
  active,
  onClick,
}: {
  conv: ConversationSummary
  currentUserId: string
  active: boolean
  onClick: () => void
}) {
  const lastMsg = conv.lastMessage
  const isOwn = lastMsg?.senderId === currentUserId
  const preview = lastMsg
    ? `${isOwn ? 'You: ' : ''}${lastMsg.content}`
    : 'No messages yet'

  return (
    <button
      onClick={onClick}
      className={`w-full rounded-xl px-4 py-3.5 text-left transition ${
        active
          ? 'border border-white/15 bg-white/[0.08]'
          : 'border border-transparent hover:bg-white/[0.04]'
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 text-xs font-semibold text-white/80"
          style={{ background: conv.otherUser.bg }}
        >
          {conv.otherUser.name.slice(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <span className="truncate font-mono text-sm text-white/80">{conv.otherUser.name}</span>
            {lastMsg && (
              <span className="shrink-0 font-mono text-[10px] text-white/30">
                {formatTime(lastMsg.createdAt)}
              </span>
            )}
          </div>
          <p className="truncate font-mono text-xs text-white/35 mt-0.5">{preview}</p>
        </div>
      </div>
      {conv.isMatched && (
        <span className="mt-2 inline-block rounded-full border border-[#3DC77A]/25 bg-[#3DC77A]/8 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-[#85e3ad]">
          matched
        </span>
      )}
    </button>
  )
}

function MessagesPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeId = searchParams.get('c')

  const [mode, setMode] = useState<PageMode>('loading')
  const [token, setToken] = useState<string | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [conversations, setConversations] = useState<ConversationSummary[]>([])
  const [loadingConvs, setLoadingConvs] = useState(false)
  const [convsError, setConvsError] = useState<string | null>(null)

  useEffect(() => {
    if (!hasBrowserSupabaseConfig()) { setMode('unauthed'); return }

    getBrowserSupabase().auth.getSession().then(async ({ data }) => {
      if (!data.session) { setMode('unauthed'); return }

      const { access_token, user } = data.session
      setToken(access_token)
      setCurrentUserId(user.id)
      setMode('ready')
      setLoadingConvs(true)

      fetch('/api/messages', {
        headers: { Authorization: `Bearer ${access_token}` },
        cache: 'no-store',
      })
        .then(r => r.json())
        .then(json => {
          if (json.ok) setConversations(json.conversations)
          else setConvsError(json.message ?? 'Could not load conversations.')
        })
        .catch(() => setConvsError('Could not load conversations. Check your connection.'))
        .finally(() => setLoadingConvs(false))
    })
  }, [])

  const activeConv = conversations.find(c => c.id === activeId) ?? null

  const selectConversation = (id: string) => {
    router.push(`/messages?c=${id}`, { scroll: false })
  }

  // On mobile: show list when no conversation selected, chat when one is
  const showList = !activeId || typeof window === 'undefined' || window.innerWidth >= 768
  const showChat = Boolean(activeId)

  return (
    <div className="flex min-h-screen flex-col bg-[#0c0e0f]">
      <AppNav />

      {mode === 'loading' && (
        <div className="flex flex-1 items-center justify-center">
          <p className="font-mono text-sm text-white/40">Loading…</p>
        </div>
      )}

      {mode === 'unauthed' && (
        <div className="flex flex-1 flex-col items-center justify-center gap-5 py-32">
          <p className="font-mono text-sm text-white/50">You need to be logged in to view messages.</p>
          <Link
            href="/login"
            className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.13em] text-white/60 transition hover:border-white/20 hover:bg-white/[0.08]"
          >
            Log in →
          </Link>
        </div>
      )}

      {mode === 'ready' && (
        <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 73px)' }}>
          {/* Conversation list — hidden on mobile when chat is open */}
          <aside
            className={`flex flex-col border-r border-white/10 ${
              showChat ? 'hidden md:flex' : 'flex'
            } w-full md:w-[320px] lg:w-[360px]`}
          >
            <div className="border-b border-white/10 px-5 py-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#FFBE74]">Messages</p>
              <h1 className="mt-1 text-2xl italic text-[#FFF7F1]" style={{ fontFamily: 'var(--font-instrument-serif)' }}>
                Conversations
              </h1>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {loadingConvs ? (
                <p className="py-10 text-center font-mono text-sm text-white/30">Loading…</p>
              ) : convsError ? (
                <p className="px-4 py-10 text-center font-mono text-xs text-red-400/70">{convsError}</p>
              ) : conversations.length === 0 ? (
                <div className="px-4 py-10 text-center">
                  <p className="font-mono text-sm text-white/50">No conversations yet.</p>
                  <p className="mt-2 font-mono text-xs text-white/30">
                    Like someone and send them a message to start.
                  </p>
                </div>
              ) : (
                conversations.map(conv => (
                  <ConversationRow
                    key={conv.id}
                    conv={conv}
                    currentUserId={currentUserId ?? ''}
                    active={conv.id === activeId}
                    onClick={() => selectConversation(conv.id)}
                  />
                ))
              )}
            </div>
          </aside>

          {/* Chat panel */}
          <main className={`flex-1 ${showChat ? 'flex' : 'hidden md:flex'} flex-col`}>
            {activeConv && token && currentUserId ? (
              <ChatPanel
                key={activeConv.id}
                conversationId={activeConv.id}
                currentUserId={currentUserId}
                token={token}
                isInitiator={activeConv.isInitiator}
                isMatched={activeConv.isMatched}
                otherUser={activeConv.otherUser}
                onBack={() => router.push('/messages', { scroll: false })}
              />
            ) : (
              <div className="flex flex-1 items-center justify-center">
                <p className="font-mono text-sm text-white/25">Select a conversation</p>
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  )
}

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen flex-col bg-[#0c0e0f]">
        <div className="flex flex-1 items-center justify-center">
          <p className="font-mono text-sm text-white/40">Loading…</p>
        </div>
      </div>
    }>
      <MessagesPageInner />
    </Suspense>
  )
}
