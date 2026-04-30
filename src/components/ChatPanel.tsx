'use client'

import { useEffect, useRef, useState } from 'react'

import { getBrowserSupabase } from '@/lib/supabase/browser'

type Message = {
  id: string
  sender_id: string
  content: string
  created_at: string
}

type OtherUser = {
  userId: string
  name: string
  bg: string
  robloxUserId: number
}

interface Props {
  conversationId: string
  currentUserId: string
  token: string
  isInitiator: boolean
  isMatched: boolean
  otherUser: OtherUser
  onBack?: () => void
}

export default function ChatPanel({
  conversationId,
  currentUserId,
  token,
  isInitiator,
  isMatched,
  otherUser,
  onBack,
}: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [limitReached, setLimitReached] = useState(false)
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Fetch messages and detect limit on load
  useEffect(() => {
    setLoading(true)
    setMessages([])
    fetch(`/api/messages/${conversationId}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
      .then(r => r.json())
      .then(json => {
        if (!json.ok) return
        setMessages(json.messages)
        setLimitReached(Boolean(json.limitActive))
      })
      .finally(() => setLoading(false))
  }, [conversationId, token])

  // Realtime subscription
  useEffect(() => {
    const supabase = getBrowserSupabase()
    // Use token in channel name so a new session always creates a fresh subscription
    const channel = supabase
      .channel(`chat:${conversationId}:${token.slice(-8)}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` },
        payload => {
          const incoming = payload.new as Message
          setMessages(prev => {
            if (prev.some(m => m.id === incoming.id)) return prev
            return [...prev, incoming]
          })
        }
      )
      .subscribe()

    return () => { void supabase.removeChannel(channel) }
  }, [conversationId, token])

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const inputBlocked = isInitiator && !isMatched && limitReached

  const sendMessage = async () => {
    const content = input.trim()
    if (!content || inputBlocked || sending) return

    setSending(true)
    setInput('')

    const tempId = `temp-${Date.now()}`
    const tempMsg: Message = {
      id: tempId,
      sender_id: currentUserId,
      content,
      created_at: new Date().toISOString(),
    }
    setMessages(prev => [...prev, tempMsg])

    try {
      const res = await fetch(`/api/messages/${conversationId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content }),
      })
      const json = await res.json().catch(() => null)

      if (!res.ok && json?.limitReached) {
        setLimitReached(true)
        setMessages(prev => prev.filter(m => m.id !== tempId))
        setInput(content)
      } else if (json?.ok) {
        const real = json.message as Message
        // Remove temp + any realtime-delivered copy, then add canonical once
        setMessages(prev => [
          ...prev.filter(m => m.id !== tempId && m.id !== real.id),
          real,
        ])
      } else {
        setMessages(prev => prev.filter(m => m.id !== tempId))
        setInput(content)
      }
    } catch {
      setMessages(prev => prev.filter(m => m.id !== tempId))
      setInput(content)
    } finally {
      setSending(false)
      textareaRef.current?.focus()
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
        {onBack && (
          <button
            onClick={onBack}
            className="mr-1 font-mono text-xs text-white/40 transition hover:text-white/70"
          >
            ← Back
          </button>
        )}
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-xs font-semibold text-white/80"
          style={{ background: otherUser.bg }}
        >
          {otherUser.name.slice(0, 2).toUpperCase()}
        </div>
        <span className="font-mono text-sm text-white/80">{otherUser.name}</span>
        {isMatched && (
          <span className="ml-auto rounded-full border border-[#3DC77A]/30 bg-[#3DC77A]/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-[#85e3ad]">
            matched
          </span>
        )}
      </div>

      {/* Messages */}
      <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto px-5 py-4">
        {loading ? (
          <p className="py-10 text-center font-mono text-sm text-white/30">Loading…</p>
        ) : messages.length === 0 ? (
          <p className="py-10 text-center font-mono text-sm text-white/30">No messages yet. Say hello!</p>
        ) : (
          messages.map(msg => {
            const isOwn = msg.sender_id === currentUserId
            return (
              <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[72%] rounded-2xl px-4 py-2.5 text-sm leading-6 ${
                    isOwn
                      ? 'rounded-br-sm bg-white/[0.12] text-white/90'
                      : 'rounded-bl-sm bg-white/[0.06] text-white/70'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      {inputBlocked ? (
        <div className="border-t border-white/10 px-5 py-4">
          <p className="text-center font-mono text-xs text-white/35">
            You can only send one message until {otherUser.name} matches with you.
          </p>
        </div>
      ) : (
        <div className="flex items-end gap-3 border-t border-white/10 px-4 py-3">
          <textarea
            ref={textareaRef}
            className="flex-1 resize-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 font-mono text-sm text-white/80 placeholder-white/25 focus:border-white/20 focus:outline-none"
            placeholder="Type a message…"
            rows={1}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                void sendMessage()
              }
            }}
          />
          <button
            onClick={() => void sendMessage()}
            disabled={!input.trim() || sending}
            className="rounded-xl border border-white/10 bg-white/[0.08] px-4 py-3 font-mono text-xs uppercase tracking-[0.12em] text-white/70 transition hover:bg-white/[0.12] hover:text-white/90 disabled:opacity-30"
          >
            Send
          </button>
        </div>
      )}
    </div>
  )
}
