import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Compass, Zap, UserRound, ArrowRight, Monitor, Building } from 'lucide-react'
import { progress } from '../demo/demoData'
import '../demo/demo.css'

const principles = [
  { icon: Compass, title: 'Context-aware', text: 'Surfaces what matters right now' },
  { icon: Zap, title: 'Action-first', text: 'Every card leads to a next step' },
  { icon: UserRound, title: 'Personalized', text: "Built around John's licenses and dates" },
]

const people = {
  john: { initials: 'JM', avatar: 'navy', name: 'John Martinez', channel: 'TLC Connect', icon: Monitor },
  sarah: { initials: 'SC', avatar: 'green', name: 'Sarah Chen', channel: 'TLC One', icon: Building },
}

const journey = [
  { step: 1, path: '/demo/submit', who: 'john', title: 'Submits a service request', text: 'Sends his Defensive Driving Certificate and asks whether it will be accepted.' },
  { step: 2, path: '/demo/review', who: 'sarah', title: 'Returns it for more information', text: 'The certificate scan is unreadable, so she asks John for a clearer copy.' },
  { step: 3, path: '/demo/fix', who: 'john', title: 'Updates and resubmits', text: 'Sees exactly what Licensing Support needs, uploads a clear copy and resubmits.' },
  { step: 4, path: '/demo/approve', who: 'sarah', title: 'Approves the request', text: 'Reviews the new certificate with the full history and approves.' },
  { step: 5, path: '/demo/decision', who: 'john', title: 'Sees the decision', text: 'Finds Approved with the decision date and the reviewer’s note.' },
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
          <div className="ix-preview-label">TLC Connect</div>
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

  return (
    <div className="ix-page">
      <header className="ix-header">
        <span className="side-nav-logo-badge">NYC</span>
        <span className="ix-header-brand">TLC Connect</span>
        <span className="ix-header-divider" />
        <span className="ix-header-sub">Prototypes</span>
        <span className="ix-header-right">November 2026</span>
      </header>

      <main className="ix-panes">
        <section className="ix-vision" aria-labelledby="ix-vision-title">
          <div className="ix-eyebrow">Design Vision</div>
          <h1 id="ix-vision-title" className="ix-title">What TLC Connect could be</h1>
          <p className="ix-lede">A TLC Connect experience that knows what John needs before he asks. A future-state concept, beyond the demonstration scope.</p>

          <ul className="ix-principles">
            {principles.map(p => {
              const Icon = p.icon
              return (
                <li key={p.title}>
                  <span className="ix-principle-icon"><Icon size={16} /></span>
                  <div><strong>{p.title}</strong><span>{p.text}</span></div>
                </li>
              )
            })}
          </ul>

          <button className="ix-preview-button" onClick={() => navigate('/vision')} aria-label="Explore the design vision">
            <LivePreview src="/vision" />
          </button>

          <div className="ix-foot">
            <button className="ix-cta" onClick={() => navigate('/vision')}>
              Explore the vision <ArrowRight size={16} />
            </button>
            <span className="ix-foot-meta">Includes the home dashboard, the license renewal flow and Ellie, the TLC assistant.</span>
          </div>
        </section>

        <section className="ix-demo" aria-labelledby="ix-demo-title">
          <div className="ix-eyebrow">Vendor Demonstration Scenario</div>
          <h1 id="ix-demo-title" className="ix-title">A Generic Service Request</h1>
          <p className="ix-lede">Built to TLC's Vendor Demonstration Criteria. Submitted in TLC Connect, reviewed in Salesforce, decided in a single review stage.</p>

          <div className="ix-story">
            <span className="ix-story-label">The story</span>
            <p>John Martinez completed a defensive driving course and asks TLC whether his certificate will be accepted for his license renewal.</p>
          </div>

          <ol className="ix-journey">
            {journey.map(j => {
              const person = people[j.who]
              const ChannelIcon = person.icon
              return (
                <li key={j.step}>
                  <span className="ix-journey-num">{j.step}</span>
                  <button className="ix-journey-card" onClick={() => { progress.clear(j.step); navigate(j.path) }}>
                    <span className={`ix-avatar ${person.avatar}`}>{person.initials}</span>
                    <span className="ix-journey-body">
                      <span className="ix-journey-who">
                        <strong>{person.name}</strong>
                        <span className="ix-channel"><ChannelIcon size={12} /> {person.channel}</span>
                      </span>
                      <span className="ix-journey-title">{j.title}</span>
                      <span className="ix-journey-text">{j.text}</span>
                    </span>
                    <ArrowRight size={18} className="ix-journey-arrow" />
                  </button>
                </li>
              )
            })}
          </ol>

          <p className="ix-scope">
            Scope follows Section 2 of TLC's criteria: ten fields, routing by request type, and one review stage with return and resubmit.
          </p>
        </section>
      </main>
    </div>
  )
}
