import { useNavigate } from 'react-router-dom'
import { ClipboardList, ChevronDown, Search, Timer, Zap, Hourglass, Inbox } from 'lucide-react'
import { StaffShell, StatusBadge, PriorityTag } from './shared'
import { otherQueueItems, queueStats, sarah, scenarioRequest } from './demoData'

const statIcons = [Inbox, Zap, Hourglass, Timer]

export default function ReviewQueue({ step }) {
  const navigate = useNavigate()
  const base = step === 2 ? '/demo/review' : '/demo/approve'

  const johnRow = {
    id: scenarioRequest.id,
    requester: scenarioRequest.name,
    type: scenarioRequest.type,
    priority: scenarioRequest.priority,
    status: step === 2 ? 'submitted' : 'resubmitted',
    updated: step === 2 ? scenarioRequest.submitted : scenarioRequest.resubmitted,
    waiting: 'Today',
  }
  const rows = [
    johnRow,
    ...otherQueueItems.map(r => {
      const days = r.baseWaiting + (step === 4 ? 1 : 0)
      return { ...r, waiting: `${days} ${days === 1 ? 'day' : 'days'}` }
    }),
  ]

  return (
    <StaffShell step={step}>
      <div className="dm-sf-stats">
        {queueStats.map((s, i) => {
          const Icon = statIcons[i]
          return (
            <div key={s.label} className="dm-sf-stat">
              <div className="dm-sf-stat-label"><Icon size={13} /> {s.label}</div>
              <div className="dm-sf-stat-value">
                {s.value}{s.unit && <span>{s.unit}</span>}
              </div>
            </div>
          )
        })}
      </div>

      <div className="dm-sf-card">
        <div className="dm-sf-list-header">
          <div className="dm-sf-object-icon"><ClipboardList size={18} /></div>
          <div>
            <div className="dm-sf-eyebrow">Service Requests</div>
            <div className="dm-sf-list-title">{sarah.role} · Pending review <ChevronDown size={16} /></div>
          </div>
          <div className="dm-sf-list-search">
            <Search size={13} />
            <span>Search this list…</span>
          </div>
        </div>
        <div className="dm-sf-list-meta">
          {rows.length} items · Sorted by last updated, newest first · Any member of {sarah.role} can act on these requests
        </div>

        <table className="dm-table dm-sf-table">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Requester</th>
              <th>Request type</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Last updated</th>
              <th>Waiting</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => {
              const isScenario = r.id === scenarioRequest.id
              return (
                <tr
                  key={r.id}
                  className={isScenario ? 'clickable highlight' : ''}
                  onClick={() => isScenario && navigate(`${base}/${r.id}`)}
                >
                  <td><span className={isScenario ? 'dm-link' : 'dm-sf-id'}>{r.id}</span></td>
                  <td>{r.requester}</td>
                  <td>{r.type}</td>
                  <td><PriorityTag priority={r.priority} /></td>
                  <td><StatusBadge status={r.status} staff /></td>
                  <td>{r.updated}</td>
                  <td>{r.waiting}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </StaffShell>
  )
}
