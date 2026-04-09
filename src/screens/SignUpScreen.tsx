import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const MountainIcon = () => (
  <svg width="40" height="28" viewBox="0 0 40 28" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 27 14 6 22 18 28 10 39 27" />
  </svg>
)

export default function SignUpScreen() {
  const navigate = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: err } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    if (err) { setError(err.message); return }
    setConfirmed(true)
  }

  if (confirmed) {
    return (
      <div className="auth-screen">
        <div className="auth-bg" />
        <div className="auth-card auth-card-confirm">
          <div className="auth-logo"><MountainIcon /></div>
          <h1 className="auth-title">Check your email</h1>
          <p className="auth-sub">We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.</p>
          <button className="auth-cta" style={{ marginTop: 24 }} onClick={() => navigate('/login')}>
            Back to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-screen">
      <div className="auth-bg" />

      <div className="auth-card">
        <div className="auth-logo"><MountainIcon /></div>

        <div className="auth-headline">
          <h1 className="auth-title">Start your journey</h1>
          <p className="auth-sub">Create an account to log your adventures.</p>
        </div>

        <form className="auth-form" onSubmit={handleSignUp}>
          <div className="auth-field">
            <label className="auth-label">Email address</label>
            <input
              className="auth-input"
              type="email"
              placeholder="explorer@trail.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Password</label>
            <input
              className="auth-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button className="auth-cta" type="submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Begin the Adventure →'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{' '}
          <button className="auth-switch-btn" onClick={() => navigate('/login')}>Log In</button>
        </p>
      </div>

      <div className="auth-footer">
        <button className="auth-footer-link">PRIVACY</button>
        <span className="auth-footer-dot">·</span>
        <button className="auth-footer-link">TERMS</button>
        <span className="auth-footer-dot">·</span>
        <button className="auth-footer-link">HELP</button>
      </div>
    </div>
  )
}
