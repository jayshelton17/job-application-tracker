import { useState } from 'react'
import { ArrowRight, BriefcaseBusiness } from 'lucide-react'
import { api } from './api.js'

export default function AuthForm({ mode, onLogin, onSwitch }) {
  const isSignup = mode === 'signup'
  const [form, setForm] = useState({ email: '', username: '', password: '' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function submit(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const result = await api(`/auth/${isSignup ? 'register' : 'login'}`, null, {
        method: 'POST', body: JSON.stringify(form),
      })
      onLogin(result.token)
    } catch (requestError) { setError(requestError.message) }
    finally { setBusy(false) }
  }

  return <>
    <div className="auth-mobile-brand"><span className="brand-mark"><BriefcaseBusiness size={18} /></span>daymark</div>
    <span className="eyebrow">YOUR CAREER, IN MOTION</span>
    <h2>{isSignup ? 'Create your account' : 'Welcome back'}</h2>
    <p className="auth-subtitle">{isSignup ? 'A fresh start for your job search.' : 'Pick up right where you left off.'}</p>
    <div className="auth-tabs">
      <button className={!isSignup ? 'auth-tab-active' : ''} onClick={() => isSignup && onSwitch()}>Sign in</button>
      <button className={isSignup ? 'auth-tab-active' : ''} onClick={() => !isSignup && onSwitch()}>Create account</button>
    </div>
    <form className="form-stack" onSubmit={submit}>
      {isSignup && <label>Username<input required autoComplete="username" value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} placeholder="How should we call you?" /></label>}
      <label>Email address<input required type="email" autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" /></label>
      <label>Password<input required type="password" autoComplete={isSignup ? 'new-password' : 'current-password'} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Enter your password" /></label>
      {error && <div className="inline-error" role="alert">{error}</div>}
      <button className="primary-button auth-submit" disabled={busy}>{busy ? 'One moment…' : isSignup ? 'Create account' : 'Sign in'}<ArrowRight size={17} /></button>
    </form>
    <p className="auth-privacy">Your job search, kept private and in your hands.</p>
  </>
}