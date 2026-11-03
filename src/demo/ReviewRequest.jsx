import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ClipboardList, ChevronRight, CheckCircle, CornerUpLeft, CircleX, FileText, Eye, Download,
  ListChecks, X, Lock, ShieldCheck, CircleAlert,
} from 'lucide-react'
import { StaffShell, StatusBadge, PriorityTag, FieldList } from './shared'
import { scenarioState, staffHistory, sarah } from './demoData'

function CertificatePreview() {
  return (
    <div className="dm-cert" aria-label="Preview of Defensive Driving Certificate">
      <div className="dm-cert-inner">
        <div className="dm-cert-top">
          <span>New York State</span>
          <span>Point &amp; Insurance Reduction Program</span>
        </div>
        <div className="dm-cert-title">Certificate of Completion</div>
        <div className="dm-cert-sub">Defensive Driving Course</div>
        <div className="dm-cert-text">This certifies that</div>
        <div className="dm-cert-name">John Martinez</div>
        <div className="dm-cert-text">completed the approved 6-hour defensive driving course</div>
        <div className="dm-cert-meta">
          <div><span>Completed</span>Sep 14, 2026</div>
          <div><span>Course ID</span>PIRP-0042817</div>
          <div><span>Provider</span>Empire Safety Driving School</div>
        </div>
        <div className="dm-cert-seal"><ShieldCheck size={22} /></div>
      </div>
    </div>
  )
}

function UnreadableScan() {
  return (
    <div className="dm-cert dm-cert-blurred" aria-label="Preview of an unreadable certificate scan">
      <div className="dm-cert-inner">
        <div className="dm-cert-title">Certificate of Completion</div>
        <div className="dm-cert-name">John Martinez</div>
        <div className="dm-cert-meta">
          <div><span>Completed</span>Sep 14, 2026</div>
          <div><span>Course ID</span>PIRP-0042817</div>
        </div>
      </div>
      <div className="dm-cert-blur-label"><CircleAlert size={14} /> Low-resolution photo · text not legible</div>
    </div>
  )
}

const decisions = [
  { key: 'approve', label: 'Approve', icon: CheckCircle },
  { key: 'return', label: 'Return', icon: CornerUpLeft },
  { key: 'reject', label: 'Reject', icon: CircleX },
]

export default function ReviewRequest({ step }) {
  const navigate = useNavigate()
  const action = step === 2 ? 'return' : 'approve'
  const startState = step === 2 ? 'submitted' : 'resubmitted'
  const doneState = step === 2 ? 'returned' : 'approved'

  const [done, setDone] = useState(false)
  const [toast, setToast] = useState(false)
  const [noteError, setNoteError] = useState(false)

  const req = scenarioState(done ? doneState : startState)
  const [note, setNote] = useState(action === 'return' ? req.returnNote : req.approveNote)
  const history = staffHistory(done ? doneState : startState)
  const showSecondFile = step === 4
  const base = step === 2 ? '/demo/review' : '/demo/approve'

  const confirm = () => {
    if (action === 'return' && !note.trim()) {
      setNoteError(true)
      return
    }
    setDone(true)
    setToast(true)
    setTimeout(() => setToast(false), 6000)
  }

  const lastField = done
    ? [action === 'return' ? 'Returned' : 'Decision date', action === 'return' ? req.returned : req.decided]
    : step === 4 ? ['Resubmitted', req.resubmitted] : ['Waiting', 'Today']

  return (
    <StaffShell step={step} complete={done}>
      {toast && (
        <div className={`dm-toast ${action}`} role="status">
          {action === 'return' ? <CornerUpLeft size={18} /> : <CheckCircle size={18} />}
          <span>
            <strong>{req.id}</strong>{' '}
            {action === 'return' ? `was returned to ${req.name}.` : 'was approved.'}{' '}
            {req.name} has been notified by email.
          </span>
          <button onClick={() => setToast(false)} aria-label="Dismiss"><X size={14} /></button>
        </div>
      )}

      <div className="dm-sf-breadcrumb">
        <button onClick={() => navigate(base)}>{sarah.role} · Pending review</button>
        <ChevronRight size={12} />
        <span>{req.id}</span>
      </div>

      <div className="dm-sf-card dm-sf-highlights">
        <div className="dm-sf-highlights-top">
          <div className="dm-sf-object-icon"><ClipboardList size={18} /></div>
          <div>
            <div className="dm-sf-eyebrow">Service Request</div>
            <div className="dm-sf-record-title">{req.id} · {req.type}</div>
          </div>
          <StatusBadge status={req.status} large staff />
        </div>
        <div className="dm-sf-highlights-fields">
          <div><span>Requester</span>{req.name}</div>
          <div><span>Priority</span><PriorityTag priority={req.priority} /></div>
          <div><span>Assigned unit</span>{req.unit}</div>
          <div><span>Date submitted</span>{req.submitted}</div>
          <div><span>{lastField[0]}</span>{lastField[1]}</div>
        </div>
      </div>

      <div className="dm-sf-record">
        <div className="dm-sf-main">
          <div className="dm-sf-card">
            <div className="dm-sf-card-title">Request details</div>
            <FieldList items={[
              ['Request ID', req.id],
              ['Requester name', req.name],
              ['Requester email', req.email],
              ['Request type', req.type],
              ['Priority', req.priority],
              ['Assigned unit', `${req.unit} (set by routing rule)`],
              ['Date submitted', req.submitted],
              ['Status', <StatusBadge key="s" status={req.status} staff />],
            ]} />
            <div className="dm-description">
              <div className="dm-subhead">Description</div>
              <p>{req.description}</p>
            </div>
          </div>

          <div className="dm-sf-card">
            <div className="dm-sf-card-title">Supporting document</div>
            <div className="dm-doc-review">
              {showSecondFile ? <CertificatePreview /> : <UnreadableScan />}
              <ul className="dm-attachments">
                {(showSecondFile ? [req.secondFile, req.firstFile] : [req.firstFile]).map((a, i) => (
                  <li key={a.name} className={showSecondFile && i === 1 ? 'replaced' : ''}>
                    <FileText size={16} />
                    <div>
                      <div className="dm-attach-name">{a.name}</div>
                      <div className="dm-attach-meta">{a.size} · Added {a.added}</div>
                    </div>
                    {showSecondFile && i === 1
                      ? <span className="dm-attach-tag">Replaced</span>
                      : <span className="dm-attach-tag current">Current</span>}
                  </li>
                ))}
                <li className="dm-attach-actions">
                  <button className="dm-btn secondary small"><Eye size={13} /> Open</button>
                  <button className="dm-btn secondary small"><Download size={13} /> Download</button>
                </li>
              </ul>
            </div>
          </div>

          <div className="dm-sf-card">
            <div className="dm-sf-card-title"><ListChecks size={15} /> History</div>
            <ol className="dm-audit">
              {history.map(h => (
                <li key={h.key} className={`tone-${h.tone}`}>
                  <span className="dm-audit-dot" />
                  <div>
                    <div className="dm-audit-head"><strong>{h.actor}</strong> {h.action}</div>
                    <div className="dm-audit-detail">{h.detail}</div>
                  </div>
                  <span className="dm-audit-date">{h.date}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <aside className="dm-sf-side">
          <div className="dm-sf-card dm-decision">
            <div className="dm-sf-card-title">Decision</div>
            {done ? (
              <div className={`dm-decision-done ${action}`}>
                {action === 'return' ? <CornerUpLeft size={22} /> : <CheckCircle size={22} />}
                <div>
                  <strong>{action === 'return' ? 'Returned' : 'Approved'} by {sarah.name}</strong>
                  <span>{action === 'return' ? req.returned : req.decided}</span>
                  <p>“{note}”</p>
                </div>
              </div>
            ) : (
              <>
                <label className="dm-decision-label" htmlFor="decision-note">
                  {action === 'return' ? <>Note to requester <span className="dm-req">*</span></> : 'Note to requester (optional)'}
                </label>
                <textarea
                  id="decision-note" className={`dm-input${noteError ? ' invalid' : ''}`} rows={4} value={note}
                  onChange={(e) => { setNote(e.target.value); setNoteError(false) }}
                  placeholder="Explain what the requester needs to add or fix."
                />
                {noteError
                  ? <div className="dm-field-error"><CircleAlert size={13} /> Tell the requester what they need to add or fix.</div>
                  : <div className="dm-hint">The requester sees this note in the portal and in their email.</div>}
                <div className="dm-decision-options" role="group" aria-label="Decision">
                  {decisions.map(d => {
                    const Icon = d.icon
                    const enabled = d.key === action
                    return (
                      <button
                        key={d.key} disabled={!enabled} onClick={enabled ? confirm : undefined}
                        className={`dm-decision-option ${d.key}${enabled ? ' selected' : ''}`}
                      >
                        <Icon size={15} /> {d.label}
                      </button>
                    )
                  })}
                </div>
                <div className="dm-decision-disabled">
                  <Lock size={12} /> {action === 'return' ? 'Return' : 'Approve'} is the action for this step of the walkthrough
                </div>
              </>
            )}
          </div>
        </aside>
      </div>
    </StaffShell>
  )
}
