import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Monitor, Building, CircleCheck, Info } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { stage } from '../demo/demoData'
import '../demo/demo.css'

const cast = [
  {
    initials: 'JM', avatar: 'navy', name: 'John Martinez', role: 'Full-time driver',
    channel: 'TLC Connect', icon: Monitor,
    persona: 'Drives more than 40 hours a week, and it is his only income. This is his first renewal and the process is new to him. With several requirements to track, unclear instructions on a rejected document could delay it.',
    text: 'Took a defensive driving course and needs TLC to accept his certificate before his license renewal.',
  },
  {
    initials: 'SC', avatar: 'green', name: 'Sarah Chen', role: 'Case manager, Licensing Support',
    channel: 'TLC One', icon: Building,
    persona: 'Handles many requests at once. Needs each driver’s full history and next action in one place, without switching between systems.',
    text: 'Finds the scan unreadable and returns it. Approves once John sends a clearer copy.',
  },
]

const covers = [
  'Ten-field request, routed by request type',
  'One review stage to approve, return or reject',
  'Resubmit with a shared request history',
]

function LivePreview({ src }) {
  const ref = useRef(null)
  const [scale, setScale] = useState(0.4)

  useEffect(() => {
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setScale(Math.min(width / 1440, (height - 28) / 900))
    })
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])

  return (
    <div className="ix-preview-area" ref={ref}>
      <div className="ix-preview-frame" style={{ width: 1440 * scale, height: 900 * scale + 28 }}>
        <div className="ix-preview-chrome">
          <span /><span /><span />
          <div className="ix-preview-label">TLC Connect home page, concept</div>
        </div>
        <div className="ix-preview-viewport" style={{ height: 900 * scale }}>
          <iframe
            src={src} title="Preview of the TLC Connect home page" tabIndex={-1} aria-hidden="true"
            style={{ transform: `scale(${scale})` }}
          />
        </div>
      </div>
    </div>
  )
}

export default function IndexPage() {
  const navigate = useNavigate()
  const { resetHome } = useApp()

  // Both entry points start a fresh run of the scenario
  const launch = (path) => () => {
    stage.reset()
    resetHome()
    navigate(path)
  }

  return (
    <div className="ix-page">
      <header className="ix-header">
        <span className="side-nav-logo-badge">NYC</span>
        <span className="ix-header-brand">TLC Connect</span>
        <span className="ix-header-divider" />
        <span className="ix-header-sub">Prototype</span>
        <span className="ix-header-right">November 2026</span>
      </header>

      <main className="ix-panes">
        <section className="ix-story-pane" aria-labelledby="ix-title">
          <div className="ix-story-inner">
            <div className="ix-eyebrow">Vendor Demonstration Scenario</div>
            <h1 id="ix-title" className="ix-title">Service Requests in TLC Connect and TLC One</h1>

            <ol className="ix-cast">
              {cast.map(p => {
                const ChannelIcon = p.icon
                return (
                  <li key={p.name}>
                    <span className={`ix-avatar ${p.avatar}`}>{p.initials}</span>
                    <div className="ix-cast-body">
                      <div className="ix-cast-head">
                        <strong>{p.name}</strong>
                        <span className="ix-cast-role">{p.role}</span>
                        <span className="ix-channel"><ChannelIcon size={12} /> {p.channel}</span>
                      </div>
                      <p className="ix-cast-persona">{p.persona}</p>
                      <p className="ix-cast-story">{p.text}</p>
                    </div>
                  </li>
                )
              })}
            </ol>

            <h2 className="ix-section-label">What you will see</h2>
            <ul className="ix-covers">
              {covers.map(c => <li key={c}><CircleCheck size={16} /> {c}</li>)}
            </ul>
            <p className="ix-bounds">Scoped to Section 2 of TLC’s Vendor Demonstration Criteria.</p>
          </div>
        </section>

        <section className="ix-launch" aria-label="Start the demo">
          <button className="ix-preview-button" onClick={launch('/home')} aria-label="Preview the home page concept">
            <LivePreview src="/home" />
          </button>

          <div className="ix-foot">
            <button className="ix-cta" onClick={launch('/requests')}>
              Open John’s Service Requests <ArrowRight size={16} />
            </button>
            <button className="ix-link" onClick={launch('/home')}>
              or preview the home page <span className="ix-tag">Concept</span>
            </button>
          </div>

          <p className="ix-disclaimer">
            <Info size={14} />
            <span>Clickable mock-up with sample data. A build on standard Lightning components may look slightly different.</span>
          </p>
        </section>
      </main>
    </div>
  )
}
