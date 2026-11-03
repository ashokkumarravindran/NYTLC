import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LayoutGrid, Settings, HelpCircle, Search, Bell, Check, ArrowLeft, Monitor, Building,
  Send, Clock, CornerUpLeft, RefreshCw, CheckCircle, CircleX,
} from 'lucide-react'
import { profiles } from './demoData'
import './demo.css'

const appIcons = { john: Monitor, sarah: Building }

// Avatar menu that moves the demo between John in TLC Connect and Sarah in TLC One
export function ProfileSwitcher({ current }) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const me = profiles[current]

  useEffect(() => {
    if (!open) return
    const onClick = (e) => { if (!ref.current?.contains(e.target)) setOpen(false) }
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const go = (path) => { setOpen(false); navigate(path) }

  return (
    <div className="dm-switcher" ref={ref}>
      <button
        className="slds-button slds-global-actions__avatar slds-global-actions__item-action dm-switcher-trigger"
        onClick={() => setOpen(o => !o)} aria-haspopup="menu" aria-expanded={open} aria-label={`${me.name}. Switch profile`}
      >
        <span className={`slds-avatar slds-avatar_circle slds-avatar_medium dm-avatar tone-${me.tone}`}>
          <abbr className="slds-avatar__initials" title={me.name}>{me.initials}</abbr>
        </span>
      </button>
      {open && (
        <div className="dm-switcher-menu" role="menu">
          <div className="dm-switcher-head">Switch profile</div>
          {Object.entries(profiles).map(([key, p]) => {
            const AppIcon = appIcons[key]
            const active = key === current
            return (
              <button
                key={key} role="menuitemradio" aria-checked={active}
                className={`dm-switcher-item${active ? ' active' : ''}`}
                onClick={() => (active ? setOpen(false) : go(p.path))}
              >
                <span className={`dm-sf-avatar tone-${p.tone}`}>{p.initials}</span>
                <span className="dm-switcher-body">
                  <strong>{p.name}</strong>
                  <span>{p.role}</span>
                  <span className="dm-switcher-app"><AppIcon size={11} /> {p.app}</span>
                </span>
                {active && <Check size={16} className="dm-switcher-check" />}
              </button>
            )
          })}
          <div className="dm-switcher-divider" />
          <button role="menuitem" className="dm-switcher-exit" onClick={() => go('/')}>
            <ArrowLeft size={14} /> Back to overview
          </button>
        </div>
      )}
    </div>
  )
}

const waffleDots = ['r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8', 'r9']

// Lightning global header and context bar (SLDS markup), shared by TLC Connect and TLC One
function TopNav({ who, appName, search, tabs, waffle }) {
  const navigate = useNavigate()
  const go = (path) => (e) => { e.preventDefault(); if (path) navigate(path) }
  const actions = [['Help', HelpCircle], ['Setup', Settings], ['Notifications', Bell]]

  return (
    <div className="dm-lx">
      <header className="slds-global-header_container">
        <div className="slds-global-header slds-grid slds-grid_align-spread">
          <div className="slds-global-header__item">
            <a href="/" className="dm-lx-brand" onClick={go('/')} aria-label="Back to overview" title="Back to overview">
              <span className="side-nav-logo-badge">NYC</span>
              <span className="dm-lx-brand-text">Taxi &amp; Limousine Commission</span>
            </a>
          </div>
          <div className="slds-global-header__item slds-global-header__item_search">
            <div className="slds-form-element">
              <div className="slds-form-element__control slds-input-has-icon slds-input-has-icon_left">
                <Search className="slds-icon slds-input__icon slds-input__icon_left slds-icon-text-default" size={14} />
                <input type="search" className="slds-input" placeholder={search} aria-label={search} />
              </div>
            </div>
          </div>
          <div className="slds-global-header__item">
            <ul className="slds-global-actions">
              {actions.map(([label, Icon]) => (
                <li key={label} className="slds-global-actions__item">
                  <button className="slds-button slds-button_icon slds-button_icon-container slds-global-actions__item-action" title={label}>
                    <Icon className="slds-button__icon slds-global-header__icon" size={18} />
                    <span className="slds-assistive-text">{label}</span>
                  </button>
                </li>
              ))}
              <li className="slds-global-actions__item">
                <ProfileSwitcher current={who} />
              </li>
            </ul>
          </div>
        </div>
      </header>

      <div className="slds-context-bar">
        <div className="slds-context-bar__primary">
          <div className="slds-context-bar__item slds-context-bar__dropdown-trigger slds-dropdown-trigger slds-dropdown-trigger_click slds-no-hover">
            {waffle && (
              <div className="slds-context-bar__icon-action">
                <button className="slds-button slds-icon-waffle_container slds-context-bar__button" title="App Launcher">
                  <span className="slds-icon-waffle">
                    {waffleDots.map(r => <span key={r} className={`slds-${r}`} />)}
                  </span>
                  <span className="slds-assistive-text">Open App Launcher</span>
                </button>
              </div>
            )}
            <span className="slds-context-bar__label-action slds-context-bar__app-name">
              <span className="slds-truncate" title={appName}>{appName}</span>
            </span>
          </div>
        </div>
        <nav className="slds-context-bar__secondary" aria-label={appName}>
          <ul className="slds-grid">
            {tabs.map(t => (
              <li key={t.label} className={`slds-context-bar__item${t.active ? ' slds-is-active' : ''}`}>
                <a
                  href={t.path ?? '#'} className="slds-context-bar__label-action" title={t.label}
                  aria-current={t.active ? 'page' : undefined} onClick={go(t.path)}
                >
                  <span className="slds-truncate">{t.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}

// John's frame in TLC Connect. active: 'home' | 'requests'
export function ConnectFrame({ active, children }) {
  return (
    <div className="dm-frame">
      <TopNav
        who="john" appName="TLC Connect" search="Search requests, documents and more…" waffle
        tabs={[
          { label: 'Home', path: '/home', active: active === 'home' },
          { label: 'Service Requests', path: '/requests', active: active === 'requests' },
        ]}
      />
      <div className="dm-portal">{children}</div>
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
    </header>
  )
}

// split: the page renders its own scrolling panes instead of one scroll area
export function PortalShell({ title, subtitle, split, children }) {
  return (
    <ConnectFrame active="requests">
      <div className="dm-portal-main">
        {split ? children : (
          <main className="dm-portal-scroll">
            <div className="dm-portal-content">
              <PageHeader title={title} subtitle={subtitle} />
              {children}
            </div>
          </main>
        )}
      </div>
    </ConnectFrame>
  )
}

export function StaffShell({ children }) {
  return (
    <div className="dm-frame">
      <div className="dm-staff">
        <TopNav
          who="sarah" appName="TLC One" search="Search Service Requests and more…" waffle
          tabs={[
            { label: 'Home' },
            { label: 'Service Requests', path: '/one/requests', active: true },
          ]}
        />
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
