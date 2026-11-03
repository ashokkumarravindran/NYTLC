import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronRight, CornerUpLeft, RefreshCw, Building, Mail, MessageSquareText, FileText, Upload, Send, Lock, CircleAlert,
} from 'lucide-react'
import { PortalShell, StatusBadge, FieldList, PriorityTag } from './shared'
import { RequestHistory } from './parts'
import { scenarioState, DESCRIPTION_LIMIT, john, progress } from './demoData'

export default function FixRequest() {
  const navigate = useNavigate()
  const [description, setDescription] = useState(scenarioState('returned').description)
  const [replaced, setReplaced] = useState(progress.done(3))
  const [resubmitted, setResubmitted] = useState(progress.done(3))

  const req = scenarioState(resubmitted ? 'resubmitted' : 'returned')
  const home = '/demo/fix'

  const resubmit = () => {
    progress.mark(3)
    setResubmitted(true)
  }

  return (
    <PortalShell step={3} complete={resubmitted} title={`Request ${req.id}`} subtitle={req.summary}>
      <div className="dm-breadcrumb">
        <button onClick={() => navigate(home)}>My Requests</button>
        <ChevronRight size={12} />
        <span>{req.id}</span>
      </div>

      {resubmitted ? (
        <div className="dm-card dm-decision-hero tone-blue">
          <div className="dm-decision-hero-icon"><RefreshCw size={26} /></div>
          <div className="dm-decision-hero-body">
            <div className="dm-eyebrow">Resubmitted</div>
            <div className="dm-decision-hero-title">Thanks, your update was sent</div>
            <div className="dm-decision-hero-meta">
              <span><Building size={13} /> {req.unit} will review it</span>
              <span>{req.resubmitted}</span>
              <span><Mail size={13} /> Confirmation sent to {john.email}</span>
            </div>
          </div>
          <StatusBadge status="resubmitted" large />
        </div>
      ) : (
        <div className="dm-card dm-decision-hero tone-amber">
          <div className="dm-decision-hero-icon"><CornerUpLeft size={26} /></div>
          <div className="dm-decision-hero-body">
            <div className="dm-eyebrow">Action needed</div>
            <div className="dm-decision-hero-title">{req.unit} needs more information</div>
            <div className="dm-decision-hero-meta">
              <span><Building size={13} /> {req.unit}</span>
              <span>Returned {req.returned}</span>
            </div>
            <div className="dm-decision-hero-note">
              <MessageSquareText size={15} />
              <span>“{req.returnNote}”</span>
            </div>
          </div>
          <StatusBadge status="returned" large />
        </div>
      )}

      <div className="dm-detail-layout wide-left">
        <div className="dm-card dm-detail-card">
          <div className="dm-card-title">{resubmitted ? 'Your updated request' : 'Update your request'}</div>
          {!resubmitted && (
            <p className="dm-card-intro">Update anything that has changed, replace the document {req.unit} flagged, then resubmit.</p>
          )}

          <div className="dm-form-field">
            <label htmlFor="fix-description" className="dm-label">Description</label>
            {resubmitted ? (
              <p className="dm-readonly-text">{description}</p>
            ) : (
              <>
                <textarea
                  id="fix-description" className="dm-input" rows={4} maxLength={DESCRIPTION_LIMIT}
                  value={description} onChange={(e) => setDescription(e.target.value)}
                  aria-describedby="fix-description-count"
                />
                <div className="dm-field-foot">
                  <span className="dm-counter" id="fix-description-count">{description.length} / {DESCRIPTION_LIMIT}</span>
                </div>
              </>
            )}
          </div>

          <div className="dm-form-field">
            <span className="dm-label">Supporting document</span>
            {replaced ? (
              <ul className="dm-attachments compact">
                <li>
                  <FileText size={15} />
                  <div>
                    <div className="dm-attach-name">{req.secondFile.name}</div>
                    <div className="dm-attach-meta">{req.secondFile.size} · Added {req.secondFile.added}</div>
                  </div>
                  <span className="dm-attach-tag current">{resubmitted ? 'Current' : 'New'}</span>
                </li>
                <li className="replaced">
                  <FileText size={15} />
                  <div>
                    <div className="dm-attach-name">{req.firstFile.name}</div>
                    <div className="dm-attach-meta">{req.firstFile.size} · Added {req.firstFile.added}</div>
                  </div>
                  <span className="dm-attach-tag">Replaced</span>
                </li>
              </ul>
            ) : (
              <>
                <div className="dm-flagged-file">
                  <FileText size={16} />
                  <div>
                    <div className="dm-attach-name">{req.firstFile.name}</div>
                    <div className="dm-flagged-reason"><CircleAlert size={12} /> Flagged by {req.unit}: unreadable</div>
                  </div>
                </div>
                <button type="button" className="dm-dropzone flagged" onClick={() => setReplaced(true)}>
                  <Upload size={20} />
                  <span className="dm-dropzone-title">Upload a clearer copy</span>
                  <span className="dm-dropzone-sub">PDF, JPG or PNG, up to 10 MB</span>
                </button>
              </>
            )}
          </div>

          {!resubmitted && (
            <div className="dm-form-actions">
              {!replaced && (
                <span className="dm-actions-hint"><Lock size={12} /> Replace the flagged document to resubmit</span>
              )}
              <button className="dm-btn secondary" onClick={() => navigate('/demo/fix')}>Cancel</button>
              <button className="dm-btn primary" disabled={!replaced} onClick={resubmit}>
                <Send size={14} /> Resubmit request
              </button>
            </div>
          )}
        </div>

        <div className="dm-detail-side">
          <div className="dm-card dm-detail-card">
            <div className="dm-card-title">Request history</div>
            <RequestHistory timeline={req.timeline} />
          </div>
          <div className="dm-card dm-detail-card">
            <div className="dm-card-title">Request details</div>
            <FieldList items={[
              ['Request ID', req.id],
              ['Request type', req.type],
              ['Priority', <PriorityTag key="p" priority={req.priority} />],
              ['Reviewed by', req.unit],
              ['Date submitted', req.submitted],
              ['Status', resubmitted ? 'Resubmitted' : 'Needs your action'],
            ]} />
          </div>
        </div>
      </div>
    </PortalShell>
  )
}
