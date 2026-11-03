import { useNavigate, useParams } from 'react-router-dom'
import { ChevronRight, CheckCircle, CircleX, Clock, Building, Mail, MessageSquareText } from 'lucide-react'
import { PortalShell, StatusBadge, FieldList, PriorityTag } from './shared'
import { RequestHistory, FileList } from './parts'
import { scenarioRequest, scenarioState, johnPriorRequests, priorTimeline, john } from './demoData'
import FixRequest from './FixRequest'

const homes = { 1: '/demo/submit', 3: '/demo/fix', 5: '/demo/decision' }
const scenarioStates = { 1: 'submitted', 5: 'approved' }

const statusLabels = {
  submitted: 'Submitted', 'in-review': 'In review', resubmitted: 'Resubmitted',
  approved: 'Approved', rejected: 'Not approved', returned: 'Needs your action',
}

function DecisionHero({ req }) {
  if (req.status === 'approved' || req.status === 'rejected') {
    const approved = req.status === 'approved'
    const Icon = approved ? CheckCircle : CircleX
    return (
      <div className={`dm-card dm-decision-hero ${approved ? 'tone-green' : 'tone-red'}`}>
        <div className="dm-decision-hero-icon"><Icon size={30} /></div>
        <div className="dm-decision-hero-body">
          <div className="dm-eyebrow">Decision</div>
          <div className="dm-decision-hero-title">{approved ? 'Your request was approved' : 'Your request was not approved'}</div>
          <div className="dm-decision-hero-meta">
            <span><Building size={13} /> {req.unit}</span>
            <span>Decided {req.decidedOn ?? req.decided}</span>
            <span><Mail size={13} /> Email sent to {john.email}</span>
          </div>
          <div className="dm-decision-hero-note">
            <MessageSquareText size={15} />
            <span>“{req.decisionNote}”</span>
          </div>
        </div>
        <StatusBadge status={req.status} large />
      </div>
    )
  }

  return (
    <div className="dm-card dm-decision-hero tone-blue">
      <div className="dm-decision-hero-icon"><Clock size={28} /></div>
      <div className="dm-decision-hero-body">
        <div className="dm-eyebrow">Status</div>
        <div className="dm-decision-hero-title">Your request is being reviewed</div>
        <div className="dm-decision-hero-meta">
          <span><Building size={13} /> {req.unit}</span>
          <span>Usually within 3 to 5 business days</span>
          <span><Mail size={13} /> We will email you when there is an update</span>
        </div>
      </div>
      <StatusBadge status={req.status} large />
    </div>
  )
}

export default function RequestDetail({ step }) {
  const navigate = useNavigate()
  const { id } = useParams()

  if (step === 3 && id === scenarioRequest.id) return <FixRequest />

  const isScenario = id === scenarioRequest.id
  const prior = johnPriorRequests.find(r => r.id === id)
  const req = isScenario ? scenarioState(scenarioStates[step]) : prior
  if (!req) return null

  const timeline = isScenario ? req.timeline : priorTimeline(req)

  return (
    <PortalShell step={step} title={`Request ${req.id}`} subtitle={req.summary}>
      <div className="dm-breadcrumb">
        <button onClick={() => navigate(homes[step])}>My Requests</button>
        <ChevronRight size={12} />
        <span>{req.id}</span>
      </div>

      <DecisionHero req={req} />

      <div className="dm-detail-side dm-detail-stack">
        <div className="dm-card dm-detail-card">
          <div className="dm-card-title">Your request</div>
          <FieldList items={[
            ['Request ID', req.id],
            ['Request type', req.type],
            ['Priority', <PriorityTag key="p" priority={req.priority} />],
            ['Reviewed by', req.unit],
            ['Date submitted', req.submitted],
            ['Status', statusLabels[req.status]],
            ['Your name', john.name],
            ['Email', john.email],
          ]} />
          <div className="dm-description">
            <div className="dm-subhead">Description</div>
            <p>{req.description}</p>
          </div>
          <div className="dm-subhead" style={{ marginTop: 16 }}>Documents</div>
          <FileList files={req.files} />
        </div>

        <div className="dm-card dm-detail-card">
          <div className="dm-card-title">Request history</div>
          <RequestHistory timeline={timeline} />
        </div>
      </div>
    </PortalShell>
  )
}
