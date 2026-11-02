import {
  MapPin, Clock, Calendar, Phone, Car, Video, Landmark, ChevronLeft, ChevronRight,
} from 'lucide-react'
import { calendarEvents, calendarMarkers } from '../data/mockData'

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const daysInMonth = 30
const startDay = 0 // Nov 1 2026 = Sunday
const today = 2

const iconMap = {
  'map-pin': MapPin,
  clock: Clock,
  calendar: Calendar,
  phone: Phone,
  car: Car,
  video: Video,
  landmark: Landmark,
}

const legend = [
  { type: 'appointment', label: 'Appointment' },
  { type: 'deadline', label: 'Deadline' },
  { type: 'closed', label: 'TLC closed' },
]

function buildCalGrid() {
  const cells = []
  for (let i = 0; i < startDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  return cells
}

export default function MiniCalendar() {
  const cells = buildCalGrid()

  return (
    <div className="calendar-section">
      <div className="mini-cal">
        <div className="mini-cal-header">
          <span className="mini-cal-month">November 2026</span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="mini-cal-nav" title="Previous month"><ChevronLeft size={14} /></button>
            <button className="mini-cal-nav" title="Next month"><ChevronRight size={14} /></button>
          </div>
        </div>
        <div className="mini-cal-grid">
          {DAYS.map(d => (
            <div key={d} className="mini-cal-day-label">{d}</div>
          ))}
          {cells.map((day, i) => (
            <div key={i} className={`mini-cal-day${day === today ? ' today' : ''}`}>
              {day || ''}
              {day && calendarMarkers[day] && (
                <span className={`event-dot dot-${calendarMarkers[day]}`} />
              )}
            </div>
          ))}
        </div>
        <div className="mini-cal-legend">
          {legend.map(l => (
            <span key={l.type} className="mini-cal-legend-item">
              <span className={`legend-dot dot-${l.type}`} />
              {l.label}
            </span>
          ))}
        </div>
      </div>

      <div className="calendar-events-list">
        <div className="calendar-events-label">Coming up</div>

        {calendarEvents.map(event => {
          const TypeIcon = iconMap[event.icon]
          return (
            <div key={event.id} className="cal-event-item">
              <div className={`cal-event-tile tint-${event.tint}`}>
                <TypeIcon size={15} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="cal-event-title-row">
                  <div className="cal-event-title">{event.title}</div>
                  <div className="cal-event-date">{event.date} {event.month}</div>
                </div>
                <div className="cal-event-detail">{event.detail}</div>

                <div className="cal-event-meta-row">
                  {event.metadata.map((m, i) => {
                    const MetaIcon = iconMap[m.icon]
                    return (
                      <div key={i} className="cal-event-meta-item">
                        <MetaIcon size={11} />
                        <span>{m.label}</span>
                      </div>
                    )
                  })}

                  {event.participants.length > 0 && (
                    <div className="cal-event-participants">
                      {event.participants.map((p, i) => (
                        <div
                          key={i}
                          className="event-participant"
                          style={{ background: p.color, marginLeft: i > 0 ? -7 : 0, zIndex: event.participants.length - i }}
                        >
                          {p.initials}
                        </div>
                      ))}
                      {event.overflow > 0 && (
                        <div className="event-participant event-overflow" style={{ marginLeft: -7 }}>
                          +{event.overflow}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
