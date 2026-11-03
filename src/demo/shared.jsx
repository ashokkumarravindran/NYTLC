import { useNavigate } from 'react-router-dom'
import {
  ArrowRight, LayoutGrid, ClipboardList, Settings, Headphones, HelpCircle, Search, Bell,
  Send, Clock, CornerUpLeft, RefreshCw, CheckCircle, CircleX,
} from 'lucide-react'
import { john, sarah, scenarios, progress } from './demoData'
import './demo.css'

export function DemoBar({ step, complete }) {
  const navigate = useNavigate()
  const current = scenarios.find(s => s.step === step)
  const next = scenarios.find(s => s.step === step + 1)

  return (
    <div className="dm-bar">
      <div className="dm-bar-left">
        <span className="dm-bar-eyebrow">Vendor Demonstration Scenario</span>
        <span className="dm-bar-divider" />
        <span className="dm-bar-step">Step {step} of {scenarios.length}</span>
        <span className="dm-bar-title">{current.title}</span>
      </div>
      <div className="dm-bar-right">
        {next && (
          <button className={`dm-bar-next${complete ? ' ready' : ''}`} onClick={() => { progress.clear(next.step); navigate(next.path) }}>
            Next: {current.next} <ArrowRight size={13} />
          </button>
        )}
        <button className="dm-bar-link" onClick={() => navigate('/')}>
          <LayoutGrid size={13} /> All scenarios
        </button>
      </div>
    </div>
  )
}

const statusMap = {
  submitted:   { label: 'Submitted', icon: Send, tone: 'blue' },
  'in-review': { label: 'In review', icon: Clock, tone: 'blue' },
  returned:    { label: 'Needs your action', staffLabel: 'Returned for information', icon: CornerUpLeft, tone: 'amber' },
  resubmitted: { label: 'Resubmitted', icon: RefreshCw, tone: 'blue' },
  approved:    { label: 'Approved', icon: CheckCircle, tone: 'green' },
  rejected:    { label: 'Not approved', staffLabel: 'Rejected', icon: CircleX, tone: 'red' },
}

export function StatusBadge({ status, large, staff }) {
  const s = statusMap[status]
  const Icon = s.icon
  return (
    <span className={`dm-status tone-${s.tone}${large ? ' large' : ''}`}>
      <Icon size={large ? 14 : 11} />
      {staff && s.staffLabel ? s.staffLabel : s.label}
    </span>
  )
}

export function isOpen(status) {
  return ['submitted', 'in-review', 'resubmitted'].includes(status)
}

export function PriorityTag({ priority }) {
  return <span className={`dm-priority${priority === 'Expedited' ? ' expedited' : ''}`}>{priority}</span>
}

export function PageHeader({ title, subtitle }) {
  return (
    <header className="page-header dm-page-header">
      <div className="page-greeting">
        <strong>{title}</strong>
        {subtitle && <span> — {subtitle}</span>}
      </div>
      <div className="page-header-utils">
        <button className="page-util-btn" title="Contact TLC Support"><Headphones size={20} /></button>
        <button className="page-util-btn" title="Help"><HelpCircle size={20} /></button>
      </div>
    </header>
  )
}

const homePaths = { 1: '/demo/submit', 3: '/demo/fix', 5: '/demo/decision' }

// split: the page renders its own scrolling panes instead of one scroll area
export function PortalShell({ step, complete, title, subtitle, split, children }) {
  const navigate = useNavigate()

  return (
    <div className="dm-frame">
      <DemoBar step={step} complete={complete} />
      <div className="dm-portal">
        <nav className="side-nav dm-side-nav">
          <div className="side-nav-logo" onClick={() => navigate('/')} title="All prototypes">
            <span className="side-nav-logo-badge">NYC</span>
            <span className="side-nav-logo-text">TLC</span>
          </div>
          <button className="side-nav-avatar" title={john.name}>{john.initials}</button>
          <div className="side-nav-divider" />
          <button className="side-nav-item active" title="My Requests" onClick={() => navigate(homePaths[step])}>
            <ClipboardList size={20} />
          </button>
          <div style={{ flex: 1 }} />
          <div className="side-nav-divider" />
          <button className="side-nav-item" title="Settings"><Settings size={20} /></button>
        </nav>

        <div className="dm-portal-main">
          <div className="dm-mobile-header">
            <span className="side-nav-logo-badge">NYC</span>
            <span className="dm-mobile-brand">TLC Connect</span>
            <span className="dm-mobile-avatar">{john.initials}</span>
          </div>

          {split ? children : (
            <main className="dm-portal-scroll">
              <div className="dm-portal-content">
                <PageHeader title={title} subtitle={subtitle} />
                {children}
              </div>
            </main>
          )}
        </div>
      </div>
    </div>
  )
}

const queuePaths = { 2: '/demo/review', 4: '/demo/approve' }

export function StaffShell({ step, complete, children }) {
  const navigate = useNavigate()
  return (
    <div className="dm-frame">
      <DemoBar step={step} complete={complete} />
      <div className="dm-staff">
        <header className="dm-sf-global">
          <div className="dm-sf-brand" onClick={() => navigate('/')} title="All prototypes">
            <span className="side-nav-logo-badge">NYC</span>
            <span className="dm-sf-brand-text">TLC</span>
          </div>
          <div className="dm-sf-search">
            <Search size={14} />
            <span>Search Service Requests and more…</span>
          </div>
          <div className="dm-sf-icons">
            <HelpCircle size={18} />
            <Settings size={18} />
            <Bell size={18} />
            <span className="dm-sf-avatar" title={`${sarah.name} · ${sarah.role}`}>{sarah.initials}</span>
          </div>
        </header>
        <div className="dm-sf-nav">
          <LayoutGrid size={18} className="dm-sf-waffle" />
          <span className="dm-sf-app">TLC One</span>
          <span className="dm-sf-tab">Home</span>
          <span className="dm-sf-tab active" onClick={() => navigate(queuePaths[step])}>Service Requests</span>
          <span className="dm-sf-tab">Reports</span>
        </div>
        <div className="dm-sf-body">
          <div className="dm-sf-band" />
          <div className="dm-sf-content">{children}</div>
        </div>
      </div>
    </div>
  )
}

export function FieldList({ items }) {
  return (
    <dl className="dm-fields">
      {items.map(([label, value]) => (
        <div key={label} className="dm-field">
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  )
}
