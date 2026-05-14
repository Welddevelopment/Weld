'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'

import { getBrowserSupabase, hasBrowserSupabaseConfig } from '@/lib/supabase/browser'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const configured = hasBrowserSupabaseConfig()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setMessage(null)

    if (!configured) {
      setError('Supabase public environment variables are missing.')
      return
    }

    setBusy(true)
    try {
      const { error: resetError } = await getBrowserSupabase().auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (resetError) throw resetError
      setMessage('Check your email for a password reset link.')
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
          <h1 className="auth-title">Reset your password</h1>
          <p className="auth-body">
            Enter the email you signed up with and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        {message ? (
          <div className="auth-card">
            <p className="auth-message">{message}</p>
            <Link href="/login" className="auth-submit auth-submit--link" style={{ marginTop: 8 }}>
              Back to log in
            </Link>
          </div>
        ) : (
          <form className="auth-card" onSubmit={handleSubmit}>
            <label className="auth-field">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </label>

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" className="auth-submit" disabled={busy}>
              {busy ? 'Sending…' : 'Send reset link'}
            </button>
          </form>
        )}

        <p className="auth-switch">
          Remembered it?{' '}
          <Link href="/login">Log in</Link>
        </p>
      </section>
    </main>
  )
}
