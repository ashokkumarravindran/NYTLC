import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CheckCircle, Calendar, Upload, RotateCcw,
  AlertTriangle, Shield, Info,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { feedItemsInitial, sarahReuploadItem, todoItems } from '../data/mockData'

const systemIconMap = {
  'check-circle':   <CheckCircle size={14} color="#2E844A" />,
  'calendar':       <Calendar size={14} color="#0070D2" />,
  'alert-triangle': <AlertTriangle size={14} color="#C23934" />,
  'shield':         <Shield size={14} color="#DD7A01" />,
  'info':           <Info size={14} color="#706E6B" />,
}

function FeedIcon({ item }) {
  if (item.type === 'case-manager') {
    return (
      <div className="feed-avatar" style={{ background: item.avatarColor }}>
        {item.avatar}
      </div>
    )
  }
  return (
    <div className="feed-icon">
      {systemIconMap[item.icon] || <CheckCircle size={14} color="#706E6B" />}
    </div>
  )
}

function FeedItem({ item, onCtaClick }) {
  return (
    <div className={`feed-item${item.isNew ? ' new-item' : ''}`}>
      <div className="feed-item-top">
        <FeedIcon item={item} />
        <div style={{ flex: 1 }}>
          <div className="feed-sender">
            {item.sender}
            {item.role && (
              <span style={{ fontWeight: 400, color: '#706E6B', fontSize: 11, marginLeft: 4 }}>
                · {item.role}
              </span>
            )}
          </div>
        </div>
        <div className="feed-time">{item.time}</div>
      </div>
      <p className="feed-message">{item.message}</p>
      {item.cta && (
        <button className="feed-cta" onClick={() => onCtaClick(item.cta.action)}>
          {item.cta.action.startsWith('upload') && <Upload size={12} />}
          {item.cta.action === 'reupload' && <RotateCcw size={12} />}
          {item.cta.label}
        </button>
      )}
    </div>
  )
}

export default function ActionCenter() {
  const [activeTab, setActiveTab] = useState('foryou')
  const navigate = useNavigate()
  const { sarahReuploadVisible, setIsReupload } = useApp()

  const feedItems = sarahReuploadVisible
    ? [sarahReuploadItem, ...feedItemsInitial]
    : feedItemsInitial

  const handleCtaClick = (action) => {
    if (action === 'upload' || action === 'reupload') {
      setIsReupload(action === 'reupload')
      navigate('/renewal')
    }
  }

  return (
    <aside className="action-center">
      <div className="action-center-header">
        <div className="action-center-title">Action Center</div>
        <div className="ac-tabs">
          <button
            className={`ac-tab${activeTab === 'foryou' ? ' active' : ''}`}
            onClick={() => setActiveTab('foryou')}
          >
            For You
            <span className="ac-count">{feedItems.length}</span>
          </button>
          <button
            className={`ac-tab${activeTab === 'todo' ? ' active' : ''}`}
            onClick={() => setActiveTab('todo')}
          >
            To-Do
            <span className="ac-count">{todoItems.length}</span>
          </button>
        </div>
      </div>

      <div className="action-center-feed">
        {activeTab === 'foryou' ? (
          feedItems.map(item => (
            <FeedItem key={item.id} item={item} onCtaClick={handleCtaClick} />
          ))
        ) : (
          todoItems.map(item => (
            <div key={item.id} className="ac-todo-item">
              <div className={`ac-todo-dot ${item.urgency}`} />
              <div style={{ flex: 1 }}>
                <div className="ac-todo-label">{item.label}</div>
                <div className="ac-todo-due">{item.due}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  )
}
