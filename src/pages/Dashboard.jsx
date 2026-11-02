import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  RefreshCw, Scale, ChevronRight, X, CheckCircle, Shield, Car,
  MessageCircle, MessageSquareMore, Send, Sparkles, Headphones, HelpCircle,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import ActionCenter from '../components/ActionCenter'
import MiniCalendar from '../components/MiniCalendar'
import DocumentsWidget from '../components/DocumentsWidget'
import { user, summaryCards, actionCards } from '../data/mockData'

const cardIcons = { renew: RefreshCw, insurance: Shield, legal: Scale }
const summaryIcons = { license: Shield, vehicle: Car }

const ellieGreeting = "Hi John, I'm Ellie. I can help with your license renewal, fee payments, summons responses and more. What do you need today?"

const elliePrompts = [
  {
    q: "Where's my renewal?",
    a: 'Your renewal for license #TLC-5094821 is in progress. Your drug test, renewal course and sex trafficking awareness training are complete. The Defensive Driving Certificate is the last document needed before your Dec 13 deadline. Summons #TLC-2026-8821 is still pending — if it results in a fine, it must be paid before your renewal can be approved.',
  },
  {
    q: 'Pay a fee',
    a: 'Your only open fee is the $252.00 renewal processing fee. You pay it as the last step of your renewal application — start from the Renew Your License card.',
  },
  {
    q: 'Respond to a summons',
    a: 'Summons #TLC-2026-8821 needs a response by Nov 15. You can respond online from the Respond to Summons card on your home page.',
  },
  {
    q: 'Talk to my case manager',
    a: "Sarah Chen is your case manager. You have a renewal review call with her on Nov 10 at 2:00 PM. You can also message her from the Action Center.",
  },
]

function ChatPanel({ onClose }) {
  const [messages, setMessages] = useState([{ from: 'ellie', text: ellieGreeting }])

  const ask = (prompt) => {
    setMessages(m => [...m, { from: 'user', text: prompt.q }, { from: 'ellie', text: prompt.a }])
  }

  return (
    <div className="chat-panel">
      <div className="chat-panel-header">
        <div className="chat-panel-avatar"><MessageCircle size={16} color="#fff" /></div>
        <div style={{ flex: 1 }}>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>Ellie</div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>Your TLC Connect assistant</div>
        </div>
        <button onClick={onClose} className="chat-panel-close" title="Close"><X size={16} /></button>
      </div>

      <div className="chat-panel-body">
        {messages.map((m, i) => (
          <div key={i} className={`chat-bubble ${m.from}`}>{m.text}</div>
        ))}
        {messages.length === 1 && (
          <div className="chat-prompts">
            {elliePrompts.map(p => (
              <button key={p.q} className="chat-prompt" onClick={() => ask(p)}>{p.q}</button>
            ))}
          </div>
        )}
      </div>

      <div className="chat-panel-input">
        <input autoFocus placeholder="Ask Ellie a question..." />
        <button title="Send"><Send size={14} color="#fff" /></button>
      </div>
    </div>
  )
}

function SummaryCard({ card }) {
  const Icon = summaryIcons[card.id]
  return (
    <div className="summary-card">
      <div className="summary-card-label-row">
        <span className="summary-card-label">{card.label}</span>
        <span className={`summary-badge badge-${card.status}`}>{card.statusLabel}</span>
      </div>
      <div className="summary-identity">
        <div className="summary-tile"><Icon size={22} /></div>
        <div style={{ minWidth: 0 }}>
          <div className="summary-title">{card.title}</div>
          <div className="summary-sub">{card.sub}</div>
        </div>
      </div>
      <div className="summary-insight">
        <Sparkles size={15} className="summary-insight-icon" />
        <span>{card.insight}</span>
      </div>
    </div>
  )
}

function EllieCard({ onOpen }) {
  return (
    <button className="summary-card ellie-card" onClick={onOpen}>
      <div className="summary-card-label-row">
        <span className="summary-card-label">I Want To</span>
      </div>
      <div className="summary-identity">
        <MessageSquareMore size={44} strokeWidth={1.75} className="ellie-icon" />
        <div className="ellie-hero-text">Hi,<br />I'm Ellie</div>
      </div>
      <div className="summary-insight">
        <Sparkles size={15} className="summary-insight-icon" />
        <span>Your AI assistant for TLC Connect. How can I help you?</span>
      </div>
    </button>
  )
}

function ActionableCard({ card, renewalStatus }) {
  const navigate = useNavigate()
  const Icon = cardIcons[card.type]

  const isRenewal = card.id === 'renew'
  const submitted = isRenewal && renewalStatus === 'submitted'
  const resubmitted = isRenewal && renewalStatus === 'resubmitted'
  const acted = submitted || resubmitted

  const state = resubmitted ? 'resubmitted' : submitted ? 'submitted' : card.urgency
  const doneLabel = submitted ? 'Pending Review' : 'Resubmitted'

  return (
    <div className={`action-card accent-${state}`}>
      <div className="action-card-top">
        <div className="action-card-header">
          <div className={`action-card-icon tint-${card.type}`}>
            <Icon size={18} />
          </div>
          <span className={`urgency-badge ${state}`}>
            {acted ? doneLabel : card.urgencyLabel}
          </span>
        </div>

        <div className="action-card-title">{card.title}</div>
        <div className="action-card-subtitle">{card.subtitle}</div>

        <div className="action-card-details">
          <div>
            <div className="detail-item-label">{card.detail1Label}</div>
            <div className="detail-item-value">{card.detail1Value}</div>
          </div>
          <div>
            <div className="detail-item-label">{card.detail2Label}</div>
            <div className="detail-item-value">{card.detail2Value}</div>
          </div>
        </div>

        <p className="action-card-hint">
          {acted ? (
            <><strong>Under review</strong> — Case TLC-2026-4422 is with your case manager.</>
          ) : (
            <><strong>{card.hintLead}</strong> — {card.contextHint}</>
          )}
        </p>
      </div>

      <div className="action-card-footer">
        {acted ? (
          <button className="action-card-btn disabled" disabled>
            <CheckCircle size={14} />
            {doneLabel}
          </button>
        ) : (
          <button className="action-card-btn primary" onClick={() => card.route && navigate(card.route)}>
            {card.ctaLabel}
            <ChevronRight size={14} />
          </button>
        )}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { renewalStatus, showSuccessBanner, setShowSuccessBanner, setSarahReuploadVisible } = useApp()
  const [chatOpen, setChatOpen] = useState(false)

  const handleGotIt = () => {
    setShowSuccessBanner(false)
    setSarahReuploadVisible(true)
  }

  return (
    <div className="app-body">
      <div className="main-scroll">

        <header className="page-header">
          <div className="page-greeting">
            <strong>Good morning, {user.firstName}</strong>
            <span>
              {' — '}
              {renewalStatus
                ? 'your renewal is under review. Here\'s your latest snapshot.'
                : `your license expires in ${user.daysUntilExpiry} days. Here's what needs your attention.`}
            </span>
          </div>
          <div className="page-header-utils">
            <button className="page-util-btn" title="Contact TLC Support"><Headphones size={20} /></button>
            <button className="page-util-btn" title="Help"><HelpCircle size={20} /></button>
          </div>
        </header>

        {showSuccessBanner && (
          <div className="success-banner">
            <CheckCircle size={16} color="#2E844A" style={{ flexShrink: 0 }} />
            <span className="success-banner-text">
              Your renewal application has been submitted. Case <strong>TLC-2026-4422</strong> is now under review.
            </span>
            <button className="success-banner-action" onClick={handleGotIt}>Got it</button>
            <button
              onClick={handleGotIt}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2E844A', display: 'flex', alignItems: 'center', marginLeft: 4 }}
            >
              <X size={14} />
            </button>
          </div>
        )}

        <div className="summary-cards">
          {summaryCards.map(card => <SummaryCard key={card.id} card={card} />)}
          <EllieCard onOpen={() => setChatOpen(true)} />
        </div>

        <div className="section-heading">
          <h2>Action Required</h2>
          <p>Complete these to stay licensed and on the road.</p>
        </div>
        <div className="action-cards-grid">
          {actionCards.map(card => (
            <ActionableCard key={card.id} card={card} renewalStatus={renewalStatus} />
          ))}
        </div>

        <div className="bottom-grid">
          <section className="bottom-block span-2">
            <div className="section-heading">
              <h2>My Schedule</h2>
              <p>Appointments, calls and sessions to plan around.</p>
            </div>
            <MiniCalendar />
          </section>
          <section className="bottom-block">
            <div className="section-heading with-action">
              <div>
                <h2>My Documents</h2>
                <p>Status of documents on file with TLC.</p>
              </div>
              <button className="section-link">View all <ChevronRight size={12} /></button>
            </div>
            <DocumentsWidget />
          </section>
        </div>

      </div>

      <ActionCenter />

      {chatOpen && <ChatPanel onClose={() => setChatOpen(false)} />}
    </div>
  )
}
