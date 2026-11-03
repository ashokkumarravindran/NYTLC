import { useNavigate } from 'react-router-dom'
import { ClipboardList, ChevronDown, Search, Timer, Zap, Hourglass, Inbox } from 'lucide-react'
import { StaffShell, StatusBadge, PriorityTag } from './shared'
import { otherQueueItems, queueStats, sarah, scenarioRequest, stage } from './demoData'

const statIcons = [Inbox, Zap, Hourglass, Timer]

const johnUpdated = {
  submitted: scenarioRequest.submitted,
  returned: scenarioRequest.returned,
  resubmitted: scenarioRequest.resubmitted,
  approved: scenarioRequest.decided,
}

export default function ReviewQueue() {
  const navigate = useNavigate()
  const current = stage.get()
  const nextDay = ['resubmitted', 'approved'].includes(current)

  // John's request appears once he has submitted it in TLC Connect
  const johnRow = current === 'new' ? null : {
    id: scenarioRequest.id,
    requester: scenarioRequest.name,
    type: scenarioRequest.type,
    priority: scenarioRequest.priority,
    status: current,
    updated: johnUpdated[current],
    waiting: ['returned', 'approved'].includes(current) ? '—' : 'Today',
  }
  const others = otherQueueItems.map(r => {
    const days = r.baseWaiting + (nextDay ? 1 : 0)
    return { ...r, waiting: `${days} ${days === 1 ? 'day' : 'days'}` }
  })
  const rows = johnRow ? [johnRow, ...others] : others

  const statValues = [
    String(rows.filter(r => ['submitted', 'resubmitted'].includes(r.status)).length),
    null,
    String(current === 'returned' ? 1 : 0),
  ]

  return (
    <StaffShell>
      <div className="dm-sf-stats">
        {queueStats.map((s, i) => {
          const Icon = statIcons[i]
          return (
            <div key={s.label} className="dm-sf-stat">
              <div className="dm-sf-stat-label"><Icon size={13} /> {s.label}</div>
              <div className="dm-sf-stat-value">
                {s.value ?? statValues[i]}{s.unit && <span>{s.unit}</span>}
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
            <div className="dm-sf-list-title">{sarah.role} · My Team's Requests <ChevronDown size={16} /></div>
          </div>
          <div className="dm-sf-list-search">
            <Search size={13} />
            <span>Search this list…</span>
          </div>
        </div>
        <div className="dm-sf-list-meta">
          {rows.length} items. Sorted by last updated, newest first. Any member of {sarah.role} can act on these requests.
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
                  onClick={() => isScenario && navigate(`/one/requests/${r.id}`)}
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
