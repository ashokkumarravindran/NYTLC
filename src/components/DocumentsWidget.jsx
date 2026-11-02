import { FileText } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { documents } from '../data/mockData'

const statusLabels = {
  expiring: 'Expiring',
  valid: 'Valid',
  verified: 'Verified',
  missing: 'Missing',
  review: 'Under Review',
  reupload: 'Re-upload Requested',
}

function ddcStatus(renewalStatus, sarahReuploadVisible) {
  if (renewalStatus === 'resubmitted') return 'review'
  if (sarahReuploadVisible) return 'reupload'
  if (renewalStatus === 'submitted') return 'review'
  return 'missing'
}

export default function DocumentsWidget() {
  const { renewalStatus, sarahReuploadVisible } = useApp()

  return (
    <div className="doc-list">
      {documents.map(doc => {
        const status = doc.id === 'ddc' ? ddcStatus(renewalStatus, sarahReuploadVisible) : doc.status
        return (
          <div key={doc.id} className="doc-row">
            <div className="doc-icon"><FileText size={15} /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="doc-name">{doc.name}</div>
              <div className="doc-detail">{doc.detail}</div>
            </div>
            <span className={`doc-status status-${status}`}>{statusLabels[status]}</span>
          </div>
        )
      })}
    </div>
  )
}
