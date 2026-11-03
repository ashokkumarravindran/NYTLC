import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle, Mail, FileText } from 'lucide-react'
import { PortalShell, StatusBadge, FieldList, PriorityTag } from './shared'
import { john, scenarioRequest, progress } from './demoData'

export default function RequestConfirmation() {
  const navigate = useNavigate()
  const { state } = useLocation()
  useEffect(() => progress.mark(1), [])
  const req = {
    type: state?.type ?? scenarioRequest.type,
    unit: state?.unit ?? scenarioRequest.unit,
    priority: state?.priority ?? scenarioRequest.priority,
    file: state?.file ?? null,
  }

  return (
    <PortalShell step={1} complete title="Request submitted" subtitle="we have it from here.">
      <div className="dm-narrow">
        <div className="dm-card dm-confirm">
          <div className="dm-confirm-hero">
            <div className="dm-confirm-icon"><CheckCircle size={28} /></div>
            <div>
              <div className="dm-eyebrow">Your request ID</div>
              <div className="dm-confirm-id">{scenarioRequest.id}</div>
              <div className="dm-confirm-sub"><Mail size={13} /> Confirmation sent to {john.email}</div>
            </div>
            <StatusBadge status="submitted" large />
          </div>

          <div className="dm-confirm-body">
            <div>
              <div className="dm-subhead">Request details</div>
              <FieldList items={[
                ['Request type', req.type],
                ['Priority', <PriorityTag key="p" priority={req.priority} />],
                ['Reviewed by', req.unit],
                ['Date submitted', scenarioRequest.submitted],
                ['Status', 'Submitted'],
                ['Document', req.file
                  ? <span key="f" className="dm-inline-file"><FileText size={13} /> {req.file.name}</span>
                  : 'None attached'],
              ]} />
            </div>

            <div>
              <div className="dm-subhead">What happens next</div>
              <ol className="dm-timeline">
                <li className="done">
                  <span className="dm-tl-dot" />
                  <div><strong>Submitted</strong><span>{scenarioRequest.submitted}</span></div>
                </li>
                <li className="current">
                  <span className="dm-tl-dot" />
                  <div><strong>Reviewed by {req.unit}</strong><span>Usually within 3 to 5 business days</span></div>
                </li>
                <li>
                  <span className="dm-tl-dot" />
                  <div><strong>Decision</strong><span>Approved, not approved, or returned if more information is needed. We will email you either way.</span></div>
                </li>
              </ol>
            </div>
          </div>

          <div className="dm-form-actions">
            <button className="dm-btn primary" onClick={() => navigate('/demo/submit')}>Back to My Requests</button>
          </div>
        </div>
      </div>
    </PortalShell>
  )
}
