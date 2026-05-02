'use client'

import Link from 'next/link'
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
    supabase.auth.getSession().then(({ data }) => {
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
    <div className="flex min-h-screen flex-col">
      <AppNav />
      <main className="acct-shell">
        {loaded && (
          <section className="acct-card">
            <header className="grid gap-2">
              <span className="acct-eyebrow">Account</span>
              <h1 className="acct-title">{email ? 'Your weld account' : 'Not signed in'}</h1>
            </header>

            {email ? (
              <>
                <div className="acct-row">
                  <span className="acct-label">Signed in as</span>
                  <p className="acct-value">{email}</p>
                </div>

                <div className="acct-row">
                  <span className="acct-label">Profile draft</span>
                  <p className="acct-value" style={{ color: 'rgba(255,247,241,0.62)' }}>
                    Auto-saved to this account. Open the builder to keep editing.
                  </p>
                </div>

                <div className="acct-actions">
                  <Link href="/profile" className="acct-btn acct-btn--primary">Open profile</Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={busy}
                    className="acct-btn acct-btn--ghost"
                  >
                    {busy ? 'Signing out…' : 'Sign out'}
                  </button>
                </div>
              </>
            ) : (
              <div className="acct-empty">
                <p>You aren&apos;t signed in. Create an account to save your draft and keep matches attached to you.</p>
                <div className="acct-actions">
                  <Link href="/signup" className="acct-btn acct-btn--primary">Create account</Link>
                  <Link href="/login" className="acct-btn acct-btn--ghost">Log in</Link>
                </div>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  )
}
