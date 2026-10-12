import { useState } from 'react'
import { ArrowRight, Sparkles } from 'lucide-react'
import { STATUSES, TODAY_ISO } from '../api.js'

export default function AddApplication({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({ company: initial?.company || '', position: initial?.position || '', status: initial?.status || 'Applied', date_applied: initial?.date_applied ? String(initial.date_applied).slice(0, 10) : TODAY_ISO })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function submit(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try { await onSave(form, initial?.id) }
    catch (requestError) { setError(requestError.message) }
    finally { setBusy(false) }
  }

  return <>
    <div className="page-heading"><span className="eyebrow">{initial ? 'KEEP IT UP TO DATE' : 'SAVE THE DETAILS'}</span><h1>{initial ? 'Edit application' : 'Add an application'}</h1><p>{initial ? 'A quick update keeps your search in focus.' : 'Capture the essentials now. You can update the rest as you go.'}</p></div>
    <div className="form-layout"><form className="surface application-form" onSubmit={submit}><div className="form-section-heading"><span className="section-number">01</span><div><h2>Opportunity details</h2><p>The basics about the role.</p></div></div><div className="form-fields"><label>Company name <span className="required-mark">*</span><input required autoFocus placeholder="e.g. Northstar Studio" value={form.company} onChange={(event) => setForm({ ...form, company: event.target.value })} /></label><label>Job title <span className="required-mark">*</span><input required placeholder="e.g. Product Designer" value={form.position} onChange={(event) => setForm({ ...form, position: event.target.value })} /></label><div className="form-field-row"><label>Current status<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>{STATUSES.map((status) => <option key={status}>{status}</option>)}</select></label><label>Date applied<input type="date" value={form.date_applied} onChange={(event) => setForm({ ...form, date_applied: event.target.value })} /></label></div></div>{error && <div className="inline-error" role="alert">{error}</div>}<div className="form-actions"><button className="text-button" type="button" onClick={onCancel}>Cancel</button><button className="primary-button" disabled={busy}>{busy ? 'Saving…' : initial ? 'Save changes' : 'Save application'}<ArrowRight size={16} /></button></div></form><aside className="form-aside"><div className="aside-icon"><Sparkles size={17} /></div><span className="eyebrow">A NOTE TO YOU</span><h3>One application at a time.</h3><p>You don't need to have it all figured out. Just keep a note of where you are and what comes next.</p><div className="aside-rule" /><span className="aside-footer">YOU'RE MAKING PROGRESS</span></aside></div>
  </>
}