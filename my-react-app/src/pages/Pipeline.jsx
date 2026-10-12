import { ChevronDown, Plus, TrendingUp } from 'lucide-react'
import { formatDate, STATUSES } from '../api.js'

export default function Pipeline({ applications, onAdd, onStatusChange }) {
  return <>
    <div className="page-heading heading-row"><div><span className="eyebrow">ONE STEP AT A TIME</span><h1>Your pipeline</h1><p>See where every opportunity stands today.</p></div><button className="primary-button" onClick={onAdd}><Plus size={17} />Add application</button></div>
    <div className="pipeline-intro"><span className="pipeline-icon"><TrendingUp size={18} /></span><span><strong>{applications.length} opportunities in motion</strong><small>Update a status as your search moves forward.</small></span></div>
    <div className="pipeline-board">{STATUSES.map((status) => {
      const items = applications.filter((item) => item.status === status)
      return <section className="pipeline-column" key={status}><header><span className={`column-indicator indicator-${status.toLowerCase()}`} /><h2>{status}</h2><span className="column-count">{items.length}</span></header><div className="pipeline-items">{items.map((item) => <article className="pipeline-card" key={item.id}><div className="pipeline-card-top"><span className="company-avatar">{item.company?.slice(0, 1)?.toUpperCase()}</span><span className="pipeline-card-date">{formatDate(item.date_applied)}</span></div><h3>{item.company}</h3><p>{item.position}</p><div className="pipeline-card-bottom"><span>MOVE TO</span><select value={status} aria-label={`Move ${item.company} to another status`} onChange={(event) => onStatusChange(item, event.target.value)}>{STATUSES.map((option) => <option key={option}>{option}</option>)}</select><ChevronDown size={13} /></div></article>)}{!items.length && <div className="column-empty">Nothing here yet</div>}</div></section>
    })}</div>
  </>
}