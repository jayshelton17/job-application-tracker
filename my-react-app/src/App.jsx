import { useEffect, useState } from 'react'
import { CalendarDays, Check, CircleHelp, Menu, X } from 'lucide-react'
import { api, TODAY_LABEL } from './api.js'
import AddApplication from './pages/AddApplication.jsx'
import AllApplications from './pages/AllApplications.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Login from './pages/Login.jsx'
import Pipeline from './pages/Pipeline.jsx'
import Settings from './pages/Settings.jsx'
import Signup from './pages/Signup.jsx'
import Navbar from './Navbar.jsx'

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('tracker-token'))
  const [user, setUser] = useState(null)
  const [applications, setApplications] = useState([])
  const [page, setPage] = useState('overview')
  const [authPage, setAuthPage] = useState('login')
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('tracker-token')))
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  useEffect(() => {
    if (!token) return
    Promise.all([api('/auth/me', token), api('/applications', token)])
      .then(([profile, records]) => {
        setUser(profile)
        setApplications(records)
      })
      .catch((requestError) => {
        if (requestError.message.includes('token') || requestError.message.includes('Authentication')) {
          localStorage.removeItem('tracker-token')
          setToken(null)
          setUser(null)
          setApplications([])
        } else setError(requestError.message)
      })
      .finally(() => setLoading(false))
  }, [token])

  useEffect(() => {
    if (!notice) return undefined
    const timer = window.setTimeout(() => setNotice(''), 3200)
    return () => window.clearTimeout(timer)
  }, [notice])

  function logout() {
    localStorage.removeItem('tracker-token')
    setToken(null)
    setUser(null)
    setApplications([])
    setPage('overview')
  }

  async function saveApplication(values, id) {
    const record = await api(id ? `/applications/${id}` : '/applications', token, {
      method: id ? 'PATCH' : 'POST', body: JSON.stringify(values),
    })
    setApplications((items) => id
      ? items.map((item) => item.id === record.id ? record : item)
      : [record, ...items])
    setEditing(null)
    setPage('applications')
    setNotice(id ? 'Application updated' : 'Application added to your tracker')
  }

  async function deleteApplication(id) {
    try {
      await api(`/applications/${id}`, token, { method: 'DELETE' })
      setApplications((items) => items.filter((item) => item.id !== id))
      setNotice('Application removed')
    } catch (requestError) { setError(requestError.message) }
  }

  async function updateStatus(application, status) {
    try {
      const record = await api(`/applications/${application.id}`, token, {
        method: 'PATCH', body: JSON.stringify({ status }),
      })
      setApplications((items) => items.map((item) => item.id === record.id ? record : item))
      setNotice(`Moved to ${status}`)
    } catch (requestError) { setError(requestError.message) }
  }

  async function updateProfile(values) {
    const profile = await api('/users/me', token, { method: 'PATCH', body: JSON.stringify(values) })
    setUser(profile)
    setNotice('Account details saved')
  }

  function onLogin(authToken) {
    localStorage.setItem('tracker-token', authToken)
    setError('')
    setLoading(true)
    setToken(authToken)
  }

  if (!token) {
    const switchAuthPage = () => setAuthPage(authPage === 'login' ? 'signup' : 'login')
    return authPage === 'signup'
      ? <Signup onLogin={onLogin} onSwitch={switchAuthPage} />
      : <Login onLogin={onLogin} onSwitch={switchAuthPage} />
  }

  const pageTitle = ({ overview: 'Overview', applications: 'Applications', pipeline: 'Your pipeline', add: 'Add an application', settings: 'Account settings' })[page]

  return (
    <div className="app-shell">
      <Navbar
        page={page}
        applications={applications}
        user={user}
        mobileNavOpen={mobileNavOpen}
        onNavigate={(nextPage) => { setPage(nextPage); setMobileNavOpen(false) }}
        onAdd={() => { setEditing(null); setPage('add'); setMobileNavOpen(false) }}
      />

      {mobileNavOpen && <button aria-label="Close navigation" className="mobile-scrim" onClick={() => setMobileNavOpen(false)} />}
      <main className="main-panel">
        <header className="topbar">
          <button className="icon-button mobile-menu" aria-label="Open navigation" onClick={() => setMobileNavOpen(true)}><Menu size={20} /></button>
          <div className="breadcrumbs"><span>Workspace</span><span className="crumb-slash">/</span><strong>{pageTitle}</strong></div>
          <div className="topbar-actions"><span className="today-label"><CalendarDays size={15} />{TODAY_LABEL}</span><button className="help-button" aria-label="Help" title="Help"><CircleHelp size={18} /></button></div>
        </header>

        <div className="page-content">
          {error && <div className="alert alert-error" role="alert"><span>{error}</span><button aria-label="Dismiss" onClick={() => setError('')}><X size={16} /></button></div>}
          {notice && <div className="toast" role="status"><Check size={16} />{notice}</div>}
          {loading ? <div className="loading-state"><span className="loader" />Loading your workspace</div> : <>
            {page === 'overview' && <Dashboard applications={applications} onNavigate={setPage} onEdit={(item) => { setEditing(item); setPage('add') }} onStatusChange={updateStatus} />}
            {page === 'applications' && <AllApplications applications={applications} onAdd={() => { setEditing(null); setPage('add') }} onEdit={(item) => { setEditing(item); setPage('add') }} onDelete={deleteApplication} onStatusChange={updateStatus} />}
            {page === 'pipeline' && <Pipeline applications={applications} onAdd={() => { setEditing(null); setPage('add') }} onStatusChange={updateStatus} />}
            {page === 'add' && <AddApplication key={editing?.id || 'new'} initial={editing} onSave={saveApplication} onCancel={() => { setEditing(null); setPage('applications') }} />}
            {page === 'settings' && <Settings user={user} onSave={updateProfile} onLogout={logout} />}
          </>}
        </div>
        <footer className="app-footer"><span>daymark <span className="footer-dot">·</span> your next chapter, organized</span><span>Made for the in-between</span></footer>
      </main>
    </div>
  )
}

export default App
