'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useEffect, useMemo, useState } from 'react'

import { getBrowserSupabase, hasBrowserSupabaseConfig } from '@/lib/supabase/browser'

type AuthMode = 'signup' | 'login'

type Props = {
  mode: AuthMode
}

export default function AuthForm({ mode }: Props) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [currentEmail, setCurrentEmail] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const configured = hasBrowserSupabaseConfig()

  const copy = useMemo(() => {
    if (mode === 'signup') {
      return {
        eyebrow: 'Create account',
        title: 'Start your Weld account',
        body: 'Use email and password for now. Your profile draft will save to this account once you log in.',
        button: 'Create account',
        switchText: 'Already have an account?',
        switchHref: '/login',
        switchLabel: 'Log in',
      }
    }

    return {
      eyebrow: 'Welcome back',
      title: 'Log in to Weld',
      body: 'Pick up your profile draft and keep your matching setup attached to your account.',
      button: 'Log in',
      switchText: 'Need an account?',
      switchHref: '/signup',
      switchLabel: 'Create one',
    }
  }, [mode])

  useEffect(() => {
    if (!configured) return

    const supabase = getBrowserSupabase()
    let alive = true

    supabase.auth.getSession().then(({ data }) => {
      if (!alive) return
      setCurrentEmail(data.session?.user.email ?? null)
    })

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentEmail(session?.user.email ?? null)
    })

    return () => {
      alive = false
      data.subscription.unsubscribe()
    }
  }, [configured])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setMessage(null)

    if (!configured) {
      setError('Supabase public environment variables are missing.')
      return
    }

    if (password.length < 8) {
      setError('Use at least 8 characters for your password.')
      return
    }

    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setBusy(true)

    try {
      const supabase = getBrowserSupabase()

      if (mode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/profile`,
          },
        })

        if (signUpError) throw signUpError

        if (data.session) {
          router.push('/home')
          router.refresh()
          return
        }

        setMessage('Account created. Check your email to confirm it, then log in.')
        return
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError

      router.push('/home')
      router.refresh()
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : 'Authentication failed.')
    } finally {
      setBusy(false)
    }
  }

  async function signOut() {
    if (!configured) return
    setBusy(true)
    await getBrowserSupabase().auth.signOut()
    setCurrentEmail(null)
    setBusy(false)
  }

  return (
    <main className="auth-shell">
      <section className="auth-panel">
        <Link href="/" className="auth-brand">weld</Link>

        <div className="auth-copy">
          <span className="auth-eyebrow">{copy.eyebrow}</span>
          <h1 className="auth-title">{copy.title}</h1>
          <p className="auth-body">{copy.body}</p>
        </div>

        {currentEmail ? (
          <div className="auth-card">
            <div>
              <span className="auth-signed-label">Signed in as</span>
              <p className="auth-signed-email">{currentEmail}</p>
            </div>
            <div className="auth-actions">
              <Link href="/profile" className="auth-submit auth-submit--link">Open profile</Link>
              <button type="button" className="auth-secondary-btn" onClick={signOut} disabled={busy}>
                Sign out
              </button>
            </div>
          </div>
        ) : (
          <form className="auth-card" onSubmit={handleSubmit}>
            <label className="auth-field">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={event => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </label>

            <label className="auth-field">
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={event => setPassword(event.target.value)}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                minLength={8}
                required
              />
            </label>

            {mode === 'signup' && (
              <label className="auth-field">
                <span>Confirm password</span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={event => setConfirmPassword(event.target.value)}
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </label>
            )}

            {error && <p className="auth-error">{error}</p>}
            {message && <p className="auth-message">{message}</p>}

            <button type="submit" className="auth-submit" disabled={busy}>
              {busy ? 'Working...' : copy.button}
            </button>
          </form>
        )}

        <p className="auth-switch">
          {copy.switchText}{' '}
          <Link href={copy.switchHref}>{copy.switchLabel}</Link>
        </p>
      </section>
    </main>
  )
}
