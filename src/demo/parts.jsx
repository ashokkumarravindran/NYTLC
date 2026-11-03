import { FileText } from 'lucide-react'

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
