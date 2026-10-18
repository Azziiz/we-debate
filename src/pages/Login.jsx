import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { firebaseReady } from '../firebase'
import FirebaseNotice from '../components/FirebaseNotice'

const ERRORS = {
  'auth/invalid-credential': 'Wrong email or password.',
  'auth/email-already-in-use': 'An account with this email already exists. Log in instead.',
  'auth/weak-password': 'Password should be at least 6 characters.',
  'auth/popup-closed-by-user': 'The sign-in window was closed.',
  'auth/too-many-requests': 'Too many attempts. Try again in a few minutes.',
}

function Login() {
  const { user, signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/profile'

  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (user) navigate(from, { replace: true })
  }, [user, from, navigate])

  const run = async (fn) => {
    setBusy(true)
    setError('')
    try {
      await fn()
    } catch (e) {
      setError(ERRORS[e.code] || 'Something went wrong. Please try again.')
      setBusy(false)
    }
  }

  const submit = (e) => {
    e.preventDefault()
    run(() =>
      mode === 'login'
        ? signInWithEmail(form.email, form.password)
        : signUpWithEmail(form.name.trim(), form.email, form.password)
    )
  }

  if (!firebaseReady)
    return (
      <div className="container page">
        <FirebaseNotice />
      </div>
    )

  return (
    <div className="container page" style={{ maxWidth: 440 }}>
      <div className="page-head center">
        <h1>{mode === 'login' ? 'Welcome back' : 'Create account'}</h1>
      </div>

      <div className="card stack">
        <button className="btn btn-ghost" onClick={() => run(signInWithGoogle)} disabled={busy}>
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" width="18" height="18" />
          Continue with Google
        </button>

        <p className="center muted small">or with email</p>

        <form className="form" onSubmit={submit}>
          {mode === 'signup' && (
            <div className="field">
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                required
                autoComplete="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
          )}
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          {error && <p className="notice notice-error">{error}</p>}
          <button className="btn btn-primary" disabled={busy}>
            {mode === 'login' ? 'Log in' : 'Create account'}
          </button>
        </form>

        <p className="center small">
          {mode === 'login' ? 'New here? ' : 'Already have an account? '}
          <button
            className="link-btn"
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login')
              setError('')
            }}
          >
            {mode === 'login' ? 'Create an account' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  )
}

export default Login
