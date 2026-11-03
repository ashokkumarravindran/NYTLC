import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Clock, CircleAlert, CheckCircle, Info, ChevronRight, ChevronLeft, FileUp, IdCard, Car, Scale,
  MessageCircle, CornerUpLeft, Phone,
} from 'lucide-react'
import { PortalShell, PageHeader, StatusBadge, isOpen } from './shared'
import { johnPriorRequests, scenarioState, requestTypes, john, stage } from './demoData'

const typeIcons = { document: FileUp, licensing: IdCard, vehicle: Car, summons: Scale }
const PAGE_SIZE = 8

export default function MyRequests() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)

  const current = stage.get()
  const state = current === 'new' ? null : current
  const scenario = state ? scenarioState(state) : null
  const rows = scenario ? [scenario, ...johnPriorRequests] : johnPriorRequests
  const pageCount = Math.ceil(rows.length / PAGE_SIZE)
  const pageRows = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const openCount = rows.filter(r => isOpen(r.status)).length
  const actionCount = rows.filter(r => r.status === 'returned').length
  const closedCount = rows.filter(r => ['approved', 'rejected'].includes(r.status)).length

  const stats = [
    { label: 'Open', value: openCount, caption: 'Being reviewed by TLC', icon: Clock, tint: 'blue' },
    { label: 'Needs your action', value: actionCount, caption: actionCount ? 'TLC needs something from you' : 'Nothing waiting on you', icon: CircleAlert, tint: actionCount ? 'amber' : 'gray' },
    { label: 'Closed', value: closedCount, caption: 'Decided by TLC', icon: CheckCircle, tint: 'green' },
  ]

  const subtitle = {
    returned: 'one of your requests needs your attention.',
    approved: 'you have an update on one of your requests.',
  }[state] ?? 'here are your requests with TLC.'

  const open = (row) => navigate(`/requests/${row.id}`)

  return (
    <PortalShell split>
      <div className="dm-split">
        <main className="dm-split-main">
          <div className="dm-portal-content">
            <PageHeader title={`Good morning, ${john.firstName}`} subtitle={subtitle} />

            {state === 'submitted' && (
              <div className="dm-banner tone-blue">
                <Info size={18} />
                <span>Request <strong>{scenario.id}</strong> was submitted. {scenario.unit} will review it.</span>
              </div>
            )}
            {state === 'returned' && (
              <div className="dm-banner tone-amber">
                <CornerUpLeft size={18} />
                <span>{scenario.unit} needs more information on <strong>{scenario.id}</strong>.</span>
                <button className="dm-banner-action amber" onClick={() => open(scenario)}>
                  Review and update <ChevronRight size={14} />
                </button>
              </div>
            )}
            {state === 'resubmitted' && (
              <div className="dm-banner tone-blue">
                <Info size={18} />
                <span>You resubmitted <strong>{scenario.id}</strong>. {scenario.unit} will review your update.</span>
              </div>
            )}
            {state === 'approved' && (
              <div className="dm-banner tone-green">
                <CheckCircle size={18} />
                <span>Your request <strong>{scenario.id}</strong> was approved on {scenario.decidedDate}.</span>
                <button className="dm-banner-action" onClick={() => open(scenario)}>
                  View decision <ChevronRight size={14} />
                </button>
              </div>
            )}

            <div className="dm-stats">
              {stats.map(s => {
                const Icon = s.icon
                return (
                  <div key={s.label} className="dm-stat-card">
                    <div className={`dm-stat-icon tint-${s.tint}`}><Icon size={20} /></div>
                    <div>
                      <div className="dm-stat-label">{s.label}</div>
                      <div className="dm-stat-value">{s.value}</div>
                      <div className="dm-stat-caption">{s.caption}</div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="dm-section-head">
              <div>
                <h2>Service Requests</h2>
                <p>Everything you have asked TLC, newest first.</p>
              </div>
            </div>

            <div className="dm-card dm-table-card">
              <table className="dm-table dm-requests-table">
                <thead>
                  <tr>
                    <th>Request</th>
                    <th>Sent</th>
                    <th>Last update</th>
                    <th>Status</th>
                    <th aria-label="Open" />
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map(row => (
                    <tr
                      key={row.id}
                      className={`clickable${row === scenario ? ' highlight' : ''}${row.status === 'returned' ? ' attention' : ''}`}
                      onClick={() => open(row)}
                    >
                      <td>
                        <div className="dm-req-type">{row.type}</div>
                        <div className="dm-req-summary">{row.summary}</div>
                        <div className="dm-req-id">{row.id}</div>
                      </td>
                      <td>{row.submittedDate ?? row.submitted}</td>
                      <td>{row.updated}</td>
                      <td><StatusBadge status={row.status} /></td>
                      <td className="dm-row-arrow"><ChevronRight size={16} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <ul className="dm-mobile-list">
                {pageRows.map(row => (
                  <li key={row.id} className="clickable" onClick={() => open(row)}>
                    <div className="dm-mobile-row-top">
                      <span className="dm-req-type">{row.type}</span>
                      <StatusBadge status={row.status} />
                    </div>
                    <div className="dm-req-summary">{row.summary}</div>
                    <div className="dm-mobile-row-meta">{row.id} · Sent {row.submittedDate ?? row.submitted}</div>
                  </li>
                ))}
              </ul>

              {pageCount > 1 && (
                <div className="dm-pagination">
                  <span>Showing {(page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, rows.length)} of {rows.length}</span>
                  <div className="dm-pagination-controls">
                    <button disabled={page === 1} onClick={() => setPage(p => p - 1)} aria-label="Previous page"><ChevronLeft size={14} /></button>
                    {Array.from({ length: pageCount }, (_, i) => (
                      <button key={i} className={page === i + 1 ? 'active' : ''} onClick={() => setPage(i + 1)}>{i + 1}</button>
                    ))}
                    <button disabled={page === pageCount} onClick={() => setPage(p => p + 1)} aria-label="Next page"><ChevronRight size={14} /></button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        <aside className="dm-split-side">
          <div className="dm-section-head">
            <div>
              <h2>Start a request</h2>
              <p>Choose what you need help with and we will send it to the right team.</p>
            </div>
          </div>
          <ul className="dm-start-list">
            {requestTypes.map(t => {
              const Icon = typeIcons[t.value]
              const content = (
                <>
                  <span className="dm-start-icon"><Icon size={18} /></span>
                  <span className="dm-start-body">
                    <strong>{t.label}</strong>
                    <span>{t.blurb}</span>
                  </span>
                  <ChevronRight size={16} className="dm-start-arrow" />
                </>
              )
              return (
                <li key={t.value}>
                  {t.value === 'document' ? (
                    <button className="dm-start-item" onClick={() => navigate(`/requests/new?type=${t.value}`)}>
                      {content}
                    </button>
                  ) : (
                    <div className="dm-start-item preview" title="Not part of this demonstration">{content}</div>
                  )}
                </li>
              )
            })}
            <li>
              <div className="dm-start-item other">
                <span className="dm-start-icon"><MessageCircle size={18} /></span>
                <span className="dm-start-body">
                  <strong>Something else</strong>
                  <span>For anything not listed, contact 311 or call TLC at (718) 391-5501.</span>
                </span>
                <Phone size={16} className="dm-start-arrow" />
              </div>
            </li>
          </ul>
        </aside>
      </div>
    </PortalShell>
  )
}
