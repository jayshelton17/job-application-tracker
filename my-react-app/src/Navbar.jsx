import {
  BriefcaseBusiness, FilePlus2, LayoutDashboard, MoreHorizontal, Plus,
  Settings2, Sparkles, TrendingUp,
} from 'lucide-react'

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'applications', label: 'Applications', icon: BriefcaseBusiness },
  { id: 'pipeline', label: 'Pipeline', icon: TrendingUp },
]

export default function Navbar({ page, applications, user, mobileNavOpen, onNavigate, onAdd }) {
  return (
    <aside className={`sidebar ${mobileNavOpen ? 'sidebar-open' : ''}`}>
      <div className="brand-lockup"><span className="brand-mark"><BriefcaseBusiness size={19} strokeWidth={2.3} /></span><span>daymark</span></div>
      <div className="workspace-label">WORKSPACE</div>
      <nav className="primary-nav" aria-label="Main navigation">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button key={id} className={`nav-link ${page === id ? 'nav-link-active' : ''}`} onClick={() => onNavigate(id)}>
            <Icon size={18} strokeWidth={1.9} /><span>{label}</span>
            {id === 'applications' && <span className="nav-count">{applications.length}</span>}
          </button>
        ))}
      </nav>
      <button className="nav-link nav-add" onClick={onAdd}>
        <FilePlus2 size={18} strokeWidth={1.9} /><span>Add application</span><Plus className="nav-plus" size={16} />
      </button>
      <div className="sidebar-bottom">
        <div className="sidebar-note"><span className="note-sparkle"><Sparkles size={15} /></span><p>Small steps add up.<br /><strong>Keep showing up.</strong></p></div>
        <button className={`nav-link ${page === 'settings' ? 'nav-link-active' : ''}`} onClick={() => onNavigate('settings')}><Settings2 size={18} /><span>Settings</span></button>
        <button className="profile-row" onClick={() => onNavigate('settings')}>
          <span className="avatar">{user?.username?.slice(0, 1)?.toUpperCase() || 'Y'}</span>
          <span className="profile-meta"><strong>{user?.username || 'Your account'}</strong><small>{user?.email || ''}</small></span>
          <MoreHorizontal size={19} />
        </button>
      </div>
    </aside>
  )
}