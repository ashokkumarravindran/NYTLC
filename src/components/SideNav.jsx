import { useNavigate, useLocation } from 'react-router-dom'
import { Home, FolderOpen, FileText, CreditCard, Settings } from 'lucide-react'
import { user } from '../data/mockData'

const navItems = [
  { label: 'Home', icon: Home, path: '/vision' },
  { label: 'My Cases', icon: FolderOpen, path: '/cases' },
  { label: 'Documents', icon: FileText, path: '/documents' },
  { label: 'Payments', icon: CreditCard, path: '/payments' },
]

export default function SideNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const activePath = pathname === '/renewal' ? '/vision' : pathname

  return (
    <nav className="side-nav">
      <div className="side-nav-logo" onClick={() => navigate('/')} title="All prototypes">
        <span className="side-nav-logo-badge">NYC</span>
        <span className="side-nav-logo-text">TLC</span>
      </div>

      <button className="side-nav-avatar" title={`${user.name} · Notifications`}>
        {user.initials}
        <span className="side-nav-avatar-dot" />
      </button>

      <div className="side-nav-divider" />

      {navItems.map(({ label, icon: Icon, path }) => (
        <button
          key={label}
          className={`side-nav-item${activePath === path ? ' active' : ''}`}
          title={label}
          onClick={() => path === '/vision' && navigate('/vision')}
        >
          <Icon size={20} />
        </button>
      ))}

      <div style={{ flex: 1 }} />
      <div className="side-nav-divider" />

      <button className="side-nav-item" title="Settings">
        <Settings size={20} />
      </button>
    </nav>
  )
}
