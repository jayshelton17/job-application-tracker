import { useMemo, useState } from 'react'
import { ArrowDown, ChevronDown, Filter, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { formatDate, STATUSES } from '../api.js'

export default function AllApplications({ applications, onAdd, onEdit, onDelete, onStatusChange }) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All statuses')
  const [sort, setSort] = useState('newest')
  const filtered = useMemo(() => applications
    .filter((item) => `${item.company} ${item.position}`.toLowerCase().includes(query.toLowerCase()))
    .filter((item) => filter === 'All statuses' || item.status === filter)
    .sort((a, b) => sort === 'newest' ? Number(b.id) - Number(a.id) : String(a.company).localeCompare(String(b.company))),
  [applications, filter, query, sort])

  return <>
    <div className="page-heading heading-row"><div><span className="eyebrow">THE WHOLE PICTURE</span><h1>Applications</h1><p>Every opportunity, all in one place.</p></div><button className="primary-button" onClick={onAdd}><Plus size={17} />Add application</button></div>
    <section className="surface application-surface">
      <div className="table-toolbar"><div className="search-box"><Search size={17} /><input aria-label="Search applications" placeholder="Search companies or roles" value={query} onChange={(event) => setQuery(event.target.value)} /></div><div className="toolbar-filters"><label className="select-wrap"><Filter size={15} /><select aria-label="Filter by status" value={filter} onChange={(event) => setFilter(event.target.value)}><option>All statuses</option>{STATUSES.map((status) => <option key={status}>{status}</option>)}</select><ChevronDown size={14} /></label><label className="select-wrap sort-select"><ArrowDown size={15} /><select aria-label="Sort applications" value={sort} onChange={(event) => setSort(event.target.value)}><option value="newest">Most recent</option><option value="company">Company A–Z</option></select><ChevronDown size={14} /></label></div></div>
      {filtered.length ? <div className="table-scroll"><table className="application-table"><thead><tr><th>COMPANY / ROLE</th><th>DATE ADDED</th><th>STATUS</th><th className="action-heading">ACTIONS</th></tr></thead><tbody>{filtered.map((item) => <tr key={item.id}><td><div className="company-cell"><span className="company-avatar">{item.company?.slice(0, 1)?.toUpperCase()}</span><span><strong>{item.company}</strong><small>{item.position}</small></span></div></td><td className="date-cell">{formatDate(item.date_applied)}</td><td><StatusSelect value={item.status} onChange={(value) => onStatusChange(item, value)} /></td><td><div className="row-actions"><button className="icon-button" title="Edit application" aria-label={`Edit ${item.company}`} onClick={() => onEdit(item)}><Pencil size={15} /></button><button className="icon-button danger-hover" title="Delete application" aria-label={`Delete ${item.company}`} onClick={() => { if (window.confirm(`Remove ${item.company} from your tracker?`)) onDelete(item.id) }}><Trash2 size={15} /></button></div></td></tr>)}</tbody></table></div> : <EmptyState title={applications.length ? 'No matches found' : 'Your tracker is ready'} text={applications.length ? 'Try another search or status filter.' : 'Add your first opportunity and keep the details close.'} action={!applications.length ? onAdd : undefined} />}
      <div className="table-foot"><span>Showing <strong>{filtered.length}</strong> of <strong>{applications.length}</strong> opportunities</span><span className="table-foot-mark"><span />PRIVATE TO YOU</span></div>
    </section>
  </>
}

function StatusSelect({ value, onChange }) {
  const status = STATUSES.includes(value) ? value : 'Applied'
  return <label className={`status-pill status-${status.toLowerCase()}`}><span className="status-dot" /><select aria-label="Application status" value={status} onChange={(event) => onChange(event.target.value)}>{STATUSES.map((option) => <option key={option}>{option}</option>)}</select><ChevronDown size={12} /></label>
}

function EmptyState({ title, text, action }) {
  return <div className="empty-state"><span className="empty-icon"><Search size={20} /></span><h3>{title}</h3><p>{text}</p>{action && <button className="secondary-button" onClick={action}><Plus size={16} />Add your first application</button>}</div>
}