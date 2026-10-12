import { ArrowRight, BriefcaseBusiness, Check, CircleHelp, Plus, TrendingUp } from 'lucide-react'
import { formatDate } from '../api.js'

const WEEKDAY = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()

export default function Dashboard({ applications, onNavigate, onEdit, onStatusChange }) {
  const active = applications.filter((item) => !['Rejected', 'Offer'].includes(item.status)).length
  const interviews = applications.filter((item) => item.status === 'Interview').length
  const offers = applications.filter((item) => item.status === 'Offer').length
  const recent = [...applications].sort((a, b) => Number(b.id) - Number(a.id)).slice(0, 5)

  return <>
    <section className="welcome-band">
      <div className="welcome-copy"><span className="eyebrow">{WEEKDAY}, YOUR SEARCH IS YOURS</span><h1>Make your next move<br /><em>with intention.</em></h1><p>A little progress is still progress. Keep your opportunities moving.</p><button className="welcome-link" onClick={() => onNavigate('applications')}>See all applications <ArrowRight size={16} /></button></div>
      <div className="welcome-art" aria-hidden="true"><div className="sun-disc" /><div className="art-window"><span /><span /><span /></div><div className="art-paper"><i /><i /><i /><b /></div><div className="art-plant"><span /><span /><span /><i /></div><div className="art-shadow" /></div>
      <div className="welcome-index">YOUR SEARCH, IN GOOD COMPANY <span>01 — 04</span></div>
    </section>
    <div className="section-heading"><div><span className="eyebrow">AT A GLANCE</span><h2>Your momentum</h2></div><span className="updated-label"><span />LIVE OVERVIEW</span></div>
    <section className="metric-grid" aria-label="Application statistics">
      <article className="metric-card metric-blue"><div className="metric-top"><span>Total applications</span><span className="metric-icon"><BriefcaseBusiness size={17} /></span></div><div className="metric-number">{applications.length}</div><div className="metric-foot">opportunities tracked</div><span className="metric-decoration decoration-lines" /></article>
      <article className="metric-card metric-cream"><div className="metric-top"><span>In progress</span><span className="metric-icon"><TrendingUp size={17} /></span></div><div className="metric-number">{active}</div><div className="metric-foot">still moving forward</div><span className="metric-decoration decoration-arc" /></article>
      <article className="metric-card metric-white"><div className="metric-top"><span>Interviews</span><span className="metric-icon"><CircleHelp size={17} /></span></div><div className="metric-number">{interviews}</div><div className="metric-foot">conversations started</div><span className="metric-decoration decoration-dot" /></article>
      <article className="metric-card metric-sage"><div className="metric-top"><span>Offers</span><span className="metric-icon"><Check size={17} /></span></div><div className="metric-number">{offers}</div><div className="metric-foot">new possibilities</div><span className="metric-decoration decoration-check"><Check size={32} /></span></article>
    </section>
    <section className="recent-section">
      <div className="section-heading recent-heading"><div><span className="eyebrow">FRESH ON YOUR MIND</span><h2>Recently added</h2></div><button className="subtle-link" onClick={() => onNavigate('applications')}>View all <ArrowRight size={15} /></button></div>
      {recent.length ? <div className="surface recent-list"><div className="recent-list-head"><span>COMPANY / ROLE</span><span>DATE ADDED</span><span>STATUS</span><span /></div>{recent.map((item) => <div className="recent-row" key={item.id}><button className="recent-company" onClick={() => onEdit(item)}><span className="company-avatar">{item.company?.slice(0, 1)?.toUpperCase()}</span><span><strong>{item.company}</strong><small>{item.position}</small></span></button><span className="recent-date">{formatDate(item.date_applied)}</span><label className={`status-pill status-${(item.status || 'applied').toLowerCase()}`}><span className="status-dot" /><select aria-label={`Change ${item.company} status`} value={item.status || 'Applied'} onChange={(event) => onStatusChange(item, event.target.value)}>{['Saved', 'Applied', 'Interview', 'Offer', 'Rejected'].map((status) => <option key={status}>{status}</option>)}</select></label><button className="recent-edit" aria-label={`Edit ${item.company}`} onClick={() => onEdit(item)}><ArrowRight size={16} /></button></div>)}</div> : <div className="surface dashboard-empty"><span className="empty-icon"><BriefcaseBusiness size={20} /></span><div><strong>A clear page is a good place to start.</strong><p>Add an opportunity and your progress will show up here.</p></div><button className="secondary-button" onClick={() => onNavigate('add')}><Plus size={16} />Add an application</button></div>}
    </section>
    <div className="dashboard-bottom-note"><span className="note-mark">D.</span><span>One step, then the next. <strong>You've got this.</strong></span><span className="bottom-note-line" /></div>
  </>
}