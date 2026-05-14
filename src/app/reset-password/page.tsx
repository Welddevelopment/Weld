'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { FormEvent, Suspense, useEffect, useState } from 'react'

import { getBrowserSupabase, hasBrowserSupabaseConfig } from '@/lib/supabase/browser'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [ready, setReady] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!hasBrowserSupabaseConfig()) return

    const code = searchParams.get('code')
    if (!code) {
      setError('Invalid or expired reset link. Please request a new one.')
      return
    }

    getBrowserSupabase()
      .auth.exchangeCodeForSession(code)
      .then(({ error: exchangeError }) => {
        if (exchangeError) {
          setError('This reset link has expired or already been used. Please request a new one.')
        } else {
          setReady(true)
        }
      })
  }, [searchParams])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError('Use at least 8 characters for your password.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setBusy(true)
    try {
      const { error: updateError } = await getBrowserSupabase().auth.updateUser({ password })
      if (updateError) throw updateError
      setMessage('Password updated. You can now log in with your new password.')
      setTimeout(() => router.push('/login'), 2500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-panel">
        <Link href="/" className="auth-brand">weld</Link>

        <div className="auth-copy">
          <span className="auth-eyebrow">Account</span>
          <h1 className="auth-title">Set a new password</h1>
          <p className="auth-body">
            Choose a new password for your Weld account.
          </p>
        </div>

        {message ? (
          <div className="auth-card">
            <p className="auth-message">{message}</p>
          </div>
        ) : !ready && !error ? (
          <div className="auth-card">
            <p style={{ margin: 0, fontSize: 13, color: 'rgba(8,24,39,0.42)', fontFamily: 'var(--font-mono)' }}>
              Verifying link…
            </p>
          </div>
        ) : error ? (
          <div className="auth-card">
            <p className="auth-error" style={{ margin: 0 }}>{error}</p>
            <Link href="/forgot-password" className="auth-submit auth-submit--link" style={{ marginTop: 12 }}>
              Request new link
            </Link>
          </div>
        ) : (
          <form className="auth-card" onSubmit={handleSubmit}>
            <label className="auth-field">
              <span>New password</span>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
              />
            </label>

            <label className="auth-field">
              <span>Confirm new password</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
              />
            </label>

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" className="auth-submit" disabled={busy}>
              {busy ? 'Saving…' : 'Set new password'}
            </button>
          </form>
        )}

        <p className="auth-switch">
          <Link href="/login">Back to log in</Link>
        </p>
      </section>
    </main>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  )
}
