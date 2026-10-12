import { useState } from 'react'
import { Check, LogOut, UserRound } from 'lucide-react'

export default function Settings({ user, onSave, onLogout }) {
  const [form, setForm] = useState({ username: user?.username || '', email: user?.email || '' })
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  async function submit(event) {
    event.preventDefault()
    setBusy(true)
    setMessage('')
    try { await onSave(form); setMessage('Your account details are up to date.') }
    catch (error) { setMessage(error.message) }
    finally { setBusy(false) }
  }

  return <>
    <div className="page-heading"><span className="eyebrow">YOUR SPACE</span><h1>Account settings</h1><p>Manage the details connected to your workspace.</p></div>
    <div className="settings-layout"><form className="surface settings-form" onSubmit={submit}><div className="settings-section-title"><span className="settings-avatar"><UserRound size={20} /></span><span><strong>Personal details</strong><small>These details belong to your account.</small></span></div><label>Username<input required value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} /></label><label>Email address<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>{message && <p className={message.includes('up to date') ? 'success-message' : 'inline-error'} role="status">{message}</p>}<div className="settings-actions"><button className="primary-button" disabled={busy}>{busy ? 'Saving…' : 'Save changes'}<Check size={16} /></button></div></form><section className="surface settings-session"><span className="eyebrow">SESSION</span><h2>Taking a break?</h2><p>Sign out of this device. Your applications will be waiting when you return.</p><button className="secondary-button" onClick={onLogout}><LogOut size={16} />Sign out</button></section></div>
  </>
}