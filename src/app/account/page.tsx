'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import AppNav from '@/components/AppNav'
import { getBrowserSupabase, hasBrowserSupabaseConfig } from '@/lib/supabase/browser'

export default function AccountPage() {
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!hasBrowserSupabaseConfig()) {
      setLoaded(true)
      return
    }
    const supabase = getBrowserSupabase()
    void supabase.auth.getSession().then(({ data }) => {
      setEmail(data.session?.user.email ?? null)
      setLoaded(true)
    })
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user.email ?? null)
    })
    return () => data.subscription.unsubscribe()
  }, [])

  async function handleSignOut() {
    setBusy(true)
    await getBrowserSupabase().auth.signOut()
    router.push('/login')
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0c0e0f]">
      <AppNav />
      <main className="flex flex-1 flex-col items-center justify-center px-4">
        {loaded && (
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.03] p-8">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
              Account
            </span>

            {email ? (
              <div className="mt-4 flex flex-col gap-6">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-white/40">
                    Signed in as
                  </p>
                  <p className="mt-1 font-mono text-sm text-white/80">{email}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  disabled={busy}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.13em] text-white/60 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white/90 disabled:opacity-40"
                >
                  {busy ? 'Signing out...' : 'Sign out'}
                </button>
              </div>
            ) : (
              <div className="mt-4 flex flex-col gap-4">
                <p className="font-mono text-sm text-white/50">You are not signed in.</p>
                <a
                  href="/login"
                  className="inline-flex items-center font-mono text-[10px] uppercase tracking-[0.13em] text-white/60 underline underline-offset-4 hover:text-white/90"
                >
                  Log in →
                </a>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
