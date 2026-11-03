import { FileText, Check } from 'lucide-react'

// Stages for the Lightning path, built from where the request has been and where it goes next
function pathStages(status, wasReturned) {
  const reviewed = [['Submitted', 'complete'], ['In review', 'complete']]
  const returned = wasReturned ? [['Returned to you', 'complete'], ['Reviewing your update', 'complete']] : []
  switch (status) {
    case 'returned': return [...reviewed, ['Returned to you', 'current'], ['Decision', 'incomplete']]
    case 'resubmitted': return [...reviewed, ['Returned to you', 'complete'], ['Reviewing your update', 'current'], ['Decision', 'incomplete']]
    case 'approved': return [...reviewed, ...returned, ['Approved', 'won']]
    case 'rejected': return [...reviewed, ...returned, ['Not approved', 'lost']]
    default: return [['Submitted', 'complete'], ['In review', 'current'], ['Decision', 'incomplete']]
  }
}

const stageClass = {
  complete: 'slds-is-complete',
  current: 'slds-is-current slds-is-active',
  incomplete: 'slds-is-incomplete',
  won: 'slds-is-current slds-is-active slds-is-won',
  lost: 'slds-is-current slds-is-active slds-is-lost',
}

function guidance(req) {
  switch (req.status) {
    case 'returned': return `Replace the flagged document and resubmit. ${req.unit} reviews your update as soon as you send it.`
    case 'resubmitted': return `${req.unit} is reviewing your update. We will email you when there is a decision.`
    case 'approved': return 'This request is closed. No further action is needed.'
    case 'rejected': return 'This request is closed. You can start a new request if anything changes.'
    default: return `${req.unit} reviews your request, usually within 3 to 5 business days. If they need more information, it comes back to you with a note. We email you at every step.`
  }
}

export function RequestPath({ req, wasReturned }) {
  const stages = pathStages(req.status, wasReturned)
  const [currentLabel] = stages.find(([, st]) => st !== 'complete' && st !== 'incomplete')
  const closed = ['approved', 'rejected'].includes(req.status)

  return (
    <div className="dm-card dm-detail-card">
      <div className="dm-card-title">{closed ? 'Progress' : 'What happens next'}</div>
      <div className="slds-path dm-path">
        <div className="slds-grid slds-path__track">
          <div className="slds-grid slds-path__scroller-container">
            <div className="slds-path__scroller">
              <div className="slds-path__scroller_inner">
                <ol className="slds-path__nav" aria-label="Request progress">
                  {stages.map(([label, st]) => (
                    <li key={label} className={`slds-path__item ${stageClass[st]}`} aria-current={st === 'complete' || st === 'incomplete' ? undefined : 'step'}>
                      <span className="slds-path__link">
                        <span className="slds-path__stage">
                          <Check size={14} />
                          {st !== 'incomplete' && <span className="slds-assistive-text">{st === 'complete' ? 'Stage complete' : 'Current stage'}</span>}
                        </span>
                        <span className="slds-path__title">{label}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="dm-path-guidance">
        <span className="dm-path-status">Status: <strong>{currentLabel}</strong></span>
        <p>{guidance(req)}</p>
      </div>
    </div>
  )
}

export function RequestHistory({ timeline }) {
  return (
    <ol className="dm-journey">
      {timeline.map((t, i) => (
        <li key={i} className={`status-${t.status}`}>
          <span className="dm-journey-dot" />
          <div className="dm-journey-body">
            <div className="dm-journey-head">
              <strong>{t.title}</strong>
              <span>{t.date}</span>
            </div>
            <div className="dm-journey-text">{t.text}</div>
            {t.note && <div className="dm-journey-note">“{t.note}”</div>}
          </div>
        </li>
      ))}
    </ol>
  )
}

export function FileList({ files }) {
  if (!files?.length) return <div className="dm-empty-note">No documents attached</div>
  return (
    <ul className="dm-attachments compact">
      {files.map(a => (
        <li key={a.name} className={`${a.current ? '' : 'replaced'}${a.flagged ? ' flagged' : ''}`}>
          <FileText size={15} />
          <div>
            <div className="dm-attach-name">{a.name}</div>
            <div className="dm-attach-meta">{a.size} · Added {a.added}</div>
          </div>
          {a.flagged
            ? <span className="dm-attach-tag flagged">Unreadable</span>
            : a.current ? <span className="dm-attach-tag current">Current</span> : <span className="dm-attach-tag">Replaced</span>}
        </li>
      ))}
    </ul>
  )
}
