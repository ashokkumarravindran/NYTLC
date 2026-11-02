import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Upload, X, CheckCircle, ArrowLeft, ChevronRight, AlertTriangle, Info } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { user } from '../data/mockData'

const STEPS = [
  { num: 1, label: 'Confirm Information' },
  { num: 2, label: 'Upload Documents' },
  { num: 3, label: 'Review & Pay' },
]

function StepBar({ current }) {
  return (
    <div className="step-bar">
      {STEPS.map((s, i) => (
        <div key={s.num} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 0 }}>
          <div className={`step-item${current === s.num ? ' active' : current > s.num ? ' done' : ''}`}>
            <div className="step-circle">
              {current > s.num ? <CheckCircle size={13} /> : s.num}
            </div>
            <span className="step-label">{s.label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`step-connector${current > s.num ? ' done' : ''}`} style={{ flex: 1 }} />
          )}
        </div>
      ))}
    </div>
  )
}

function LockedField({ label, value }) {
  return (
    <div className="field-wrap">
      <div className="field-label">{label}</div>
      <div className="field-locked">
        <Lock size={12} />
        <span>{value}</span>
      </div>
    </div>
  )
}

function EditField({ label, defaultValue }) {
  return (
    <div className="field-wrap">
      <div className="field-label">{label}</div>
      <input className="field-input" defaultValue={defaultValue} />
    </div>
  )
}

function Step1({ onNext }) {
  return (
    <div className="renewal-body">
      <div className="info-box">
        <Info size={14} style={{ flexShrink: 0, marginTop: 1 }} />
        <span>Your information is pre-filled from your TLC profile. Fields marked with a lock cannot be changed here — contact TLC to update them.</span>
      </div>

      <div className="form-section-label">Personal Information</div>
      <div className="form-grid">
        <LockedField label="Full Name" value={user.name} />
        <LockedField label="TLC License Number" value={user.licenseNumber} />
        <LockedField label="DMV License Number" value={user.dmvLicense} />
        <LockedField label="License Type" value="FHV Driver" />
      </div>

      <div className="form-section-label">Contact Information</div>
      <div className="form-grid">
        <EditField label="Home Address" defaultValue={user.address} />
        <EditField label="Phone Number" defaultValue={user.phone} />
        <EditField label="Email Address" defaultValue={user.email} />
        <LockedField label="Vehicle on File" value={`${user.vehicle} · ${user.plate}`} />
      </div>

      <div className="form-section-label">Renewal Requirements</div>
      <div className="checklist">
        {[
          { label: 'Drug test completed within 90 days', done: true, detail: 'Taken Oct 15 · verified Oct 28, 2026 · LabCorp', color: '#2E844A' },
          { label: 'TLC Renewal Course completed', done: true, detail: 'Completed Oct 20, 2026 · NYC TLC School', color: '#2E844A' },
          { label: 'Outstanding tickets cleared', done: true, detail: 'No outstanding tickets on record', color: '#2E844A' },
          { label: 'Defensive Driving Certificate (DDC)', done: false, detail: 'Upload required in next step', color: '#C23934' },
        ].map((req, i) => (
          <div key={i} className="checklist-row">
            {req.done
              ? <CheckCircle size={16} color="#2E844A" style={{ flexShrink: 0, marginTop: 2 }} />
              : <AlertTriangle size={16} color="#C23934" style={{ flexShrink: 0, marginTop: 2 }} />
            }
            <div>
              <div className="checklist-row-label">{req.label}</div>
              <div className="checklist-row-detail" style={{ color: req.color }}>{req.detail}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="form-actions">
        <span style={{ fontSize: 12, color: '#706E6B' }}>Step 1 of 3</span>
        <button className="btn-primary" onClick={onNext}>
          Continue <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}

function Step2({ onNext, onBack, uploads, setUploads, isReupload }) {
  const docs = [
    {
      key: 'ddc',
      label: 'Defensive Driving Certificate (DDC)',
      required: true,
      note: 'Must show course type, completion date, hours, and official seal',
      flagged: isReupload,
      flagNote: 'Re-upload required — previous scan was unclear',
    },
    {
      key: 'renewal_course',
      label: 'TLC Renewal Course Certificate',
      required: false,
      note: 'Already on file — upload only if updated',
      flagged: false,
    },
  ]

  const handleUpload = (key) => {
    setUploads(p => ({ ...p, [key]: `${key}_certificate.pdf` }))
  }

  const handleRemove = (key) => {
    setUploads(p => { const n = { ...p }; delete n[key]; return n })
  }

  return (
    <div className="renewal-body">
      {isReupload ? (
        <div className="warn-box">
          <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>
            <strong>Document re-upload required.</strong> Sarah Chen (Case Manager) has flagged your Defensive Driving Certificate as unclear. Please upload a higher quality scan.
          </span>
        </div>
      ) : (
        <div className="warn-box">
          <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
          <span><strong>1 document required:</strong> Your Defensive Driving Certificate is missing. Upload it to proceed.</span>
        </div>
      )}

      <div className="upload-doc-list">
        {docs.map(doc => (
          <div key={doc.key} className="upload-doc-item">
            <div className="upload-doc-header">
              <span className="upload-doc-label">{doc.label}</span>
              {doc.required && (
                <span style={{ fontSize: 10, fontWeight: 700, background: '#FEE8E8', color: '#C23934', padding: '2px 7px', borderRadius: 3 }}>
                  Required
                </span>
              )}
              {!doc.required && (
                <span style={{ fontSize: 10, fontWeight: 700, background: '#F3F3F3', color: '#706E6B', padding: '2px 7px', borderRadius: 3 }}>
                  Optional
                </span>
              )}
            </div>

            {doc.flagged && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#C23934', marginBottom: 6 }}>
                <AlertTriangle size={12} />
                {doc.flagNote}
              </div>
            )}

            <div style={{ fontSize: 11, color: '#706E6B', marginBottom: 6 }}>{doc.note}</div>

            {uploads[doc.key] ? (
              <div className="uploaded-file">
                <CheckCircle size={14} color="#2E844A" />
                <span className="uploaded-file-name">{uploads[doc.key]}</span>
                <button className="uploaded-file-remove" onClick={() => handleRemove(doc.key)}>
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div
                className={`upload-zone${doc.flagged ? ' flagged' : ''}`}
                onClick={() => handleUpload(doc.key)}
              >
                <Upload size={20} color={doc.flagged ? '#C23934' : '#706E6B'} />
                <div className="upload-zone-text">Click to upload or drag and drop</div>
                <div className="upload-zone-sub">PDF, JPG, PNG — Max 10MB</div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="form-actions">
        <button className="btn-secondary" onClick={onBack}>
          <ArrowLeft size={14} /> Back
        </button>
        <button
          className="btn-primary"
          onClick={onNext}
          disabled={!uploads.ddc}
          style={{ opacity: uploads.ddc ? 1 : 0.5 }}
        >
          Continue <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}

function Step3({ onSubmit, onBack, isReupload }) {
  return (
    <div className="renewal-body">
      <div className="form-section-label">Application Summary</div>
      <div className="review-table">
        {[
          ['License Holder', user.name],
          ['License Number', user.licenseNumber],
          ['License Type', 'For-Hire Vehicle (FHV) Driver'],
          ['Current Expiry', 'December 13, 2026'],
          ['Renewed Through', 'December 13, 2029 (3-year)'],
          ['Contact Address', user.address],
          ['Email', user.email],
          ['Phone', user.phone],
        ].map(([label, value]) => (
          <div key={label} className="review-row">
            <span className="review-row-label">{label}</span>
            <span className="review-row-value">{value}</span>
          </div>
        ))}
      </div>

      {isReupload ? (
        <>
          <div className="form-section-label" style={{ marginTop: 20 }}>Re-uploaded Document</div>
          <div className="uploaded-file">
            <CheckCircle size={14} color="#2E844A" />
            <span className="uploaded-file-name">ddc_certificate.pdf</span>
            <span style={{ fontSize: 11, color: '#2E844A', fontWeight: 600 }}>Ready to submit</span>
          </div>
        </>
      ) : (
        <>
          <div className="form-section-label" style={{ marginTop: 20 }}>Documents Submitted</div>
          <div className="review-table">
            {[
              ['Defensive Driving Certificate', 'Uploaded'],
              ['Drug Test Results', 'On File'],
              ['TLC Renewal Course Certificate', 'On File'],
            ].map(([name, status]) => (
              <div key={name} className="review-row">
                <span className="review-row-label">{name}</span>
                <span style={{ color: '#2E844A', fontWeight: 600, fontSize: 12 }}>
                  <CheckCircle size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                  {status}
                </span>
              </div>
            ))}
          </div>

          <div className="form-section-label" style={{ marginTop: 20 }}>Fees</div>
          <div className="fee-summary">
            {[
              { label: 'TLC Renewal Processing Fee (3-year)', value: '$252.00', muted: false },
              { label: 'Drug Test — paid Oct 15', value: '$34.00', muted: true },
              { label: 'Renewal Course — paid Oct 18', value: '$125.00', muted: true },
            ].map(f => (
              <div key={f.label} className="fee-row">
                <span className="fee-label">{f.label}</span>
                <span style={{ color: f.muted ? '#706E6B' : '#16325C', fontWeight: f.muted ? 400 : 600 }}>
                  {f.muted ? `${f.value} (paid)` : f.value}
                </span>
              </div>
            ))}
            <div className="fee-row total">
              <span className="fee-label">Amount Due Today</span>
              <span>$252.00</span>
            </div>
          </div>

          <div style={{ marginTop: 12, padding: '10px 14px', background: '#F8F8F8', borderRadius: 4, fontSize: 12, color: '#706E6B', border: '1px solid #E5E5E5' }}>
            Payment will be charged to your saved card ending in <strong>4821</strong>.
          </div>
        </>
      )}

      <div className="form-actions">
        <button className="btn-secondary" onClick={onBack}>
          <ArrowLeft size={14} /> Back
        </button>
        <button className="btn-primary success" onClick={onSubmit}>
          <CheckCircle size={14} />
          {isReupload ? 'Submit Document' : 'Submit & Pay $252.00'}
        </button>
      </div>
    </div>
  )
}

function Confirmation({ isReupload }) {
  const navigate = useNavigate()
  return (
    <div className="confirm-body">
      <div className="confirm-icon">
        <CheckCircle size={28} />
      </div>
      <div className="confirm-title">
        {isReupload ? 'Document Resubmitted!' : 'Application Submitted!'}
      </div>
      <div className="confirm-sub">
        {isReupload
          ? 'Your updated Defensive Driving Certificate has been sent to Sarah Chen for review.'
          : 'Your renewal application has been received. Case TLC-2026-4422 is now under review.'}
      </div>
      <div className="case-badge">
        Case Number: <strong>TLC-2026-4422</strong>
      </div>

      {!isReupload && (
        <div className="timeline">
          {[
            { dot: 'done',    label: 'Application submitted', detail: 'Nov 2, 2026 · Confirmation sent to ' + user.email },
            { dot: 'current', label: 'Under review by TLC', detail: 'Expected 3–5 business days' },
            { dot: 'pending', label: 'Document verification', detail: 'Sarah Chen (Case Manager) will review your documents' },
            { dot: 'pending', label: 'License renewed', detail: 'You will be notified by email and in-portal message' },
          ].map((row, i) => (
            <div key={i} className="timeline-row">
              <div className={`tl-dot ${row.dot}`} />
              <div className="tl-content">
                <strong>{row.label}</strong>
                <span>{row.detail}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="confirm-actions">
        <button className="btn-primary" onClick={() => navigate('/')}>
          Return to Home
        </button>
        {!isReupload && (
          <button className="btn-secondary">Download Receipt</button>
        )}
      </div>
    </div>
  )
}

export default function RenewalFlow() {
  const navigate = useNavigate()
  const { setRenewalStatus, setShowSuccessBanner, isReupload, setIsReupload } = useApp()

  const [step, setStep] = useState(isReupload ? 2 : 1)
  const [uploads, setUploads] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (isReupload) {
      setRenewalStatus('resubmitted')
      setIsReupload(false)
    } else {
      setRenewalStatus('submitted')
      setShowSuccessBanner(true)
    }
    navigate('/')
  }

  return (
    <div className="app-body">
      <div className="renewal-page">
        <div className="renewal-wrap">
          <button
            onClick={() => navigate('/')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0070D2', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4, marginBottom: 12, padding: 0 }}
          >
            <ArrowLeft size={14} /> Back to Home
          </button>

          <div className="renewal-card">
            <div className="renewal-card-header">
              <h2>License Renewal Application</h2>
              <p>TLC Driver License #{user.licenseNumber} · Expires December 13, 2026</p>
            </div>

            {!submitted && <StepBar current={step} />}

            {submitted ? (
              <Confirmation isReupload={isReupload} />
            ) : step === 1 ? (
              <Step1 onNext={() => setStep(2)} />
            ) : step === 2 ? (
              <Step2
                onNext={() => setStep(3)}
                onBack={() => isReupload ? navigate('/') : setStep(1)}
                uploads={uploads}
                setUploads={setUploads}
                isReupload={isReupload}
              />
            ) : (
              <Step3 onSubmit={handleSubmit} onBack={() => setStep(2)} isReupload={isReupload} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
