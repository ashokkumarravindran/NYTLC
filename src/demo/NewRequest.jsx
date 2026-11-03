import { useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Upload, FileText, X, Route, CircleAlert, Send, ChevronRight, ChevronDown, Lock } from 'lucide-react'
import { PortalShell } from './shared'
import { john, requestTypes, DESCRIPTION_LIMIT, documentDescription } from './demoData'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(form) {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Enter your name.'
  if (!form.email.trim()) errors.email = 'Enter your email address.'
  else if (!EMAIL_RE.test(form.email.trim())) errors.email = 'Enter an email address in the format name@example.com.'
  if (!form.type) errors.type = 'Select a request type.'
  if (!form.description.trim()) errors.description = 'Describe what you need from TLC.'
  return errors
}

const errorOrder = [
  ['name', 'Your name'],
  ['email', 'Email'],
  ['type', 'Request type'],
  ['description', 'Description'],
]

export function FieldError({ id, message }) {
  if (!message) return null
  return (
    <div className="dm-field-error" id={`${id}-error`}>
      <CircleAlert size={13} /> {message}
    </div>
  )
}

export default function NewRequest() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const summaryRef = useRef(null)
  const presetType = requestTypes.some(t => t.value === params.get('type')) ? params.get('type') : ''
  const [form, setForm] = useState({
    name: john.name, email: john.email, type: presetType, priority: 'Standard',
    description: presetType === 'document' ? documentDescription : '', file: null,
  })
  const [attempted, setAttempted] = useState(false)

  const errors = attempted ? validate(form) : {}
  const errorCount = Object.keys(errors).length
  const selectedType = requestTypes.find(t => t.value === form.type)
  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    setAttempted(true)
    if (Object.keys(validate(form)).length) {
      requestAnimationFrame(() => summaryRef.current?.focus())
      return
    }
    navigate('/demo/submit/confirmation', {
      state: { type: selectedType.label, unit: selectedType.unit, priority: form.priority, file: form.file },
    })
  }

  return (
    <PortalShell step={1} title="New Service Request" subtitle="tell TLC what you need and we will send it to the right team.">
      <div className="dm-narrow">
        <div className="dm-breadcrumb">
          <button onClick={() => navigate('/demo/submit')}>My Requests</button>
          <ChevronRight size={12} />
          <span>New Service Request</span>
        </div>

        <form className="dm-card dm-form" onSubmit={submit} noValidate>
          {errorCount > 0 && (
            <div className="dm-error-summary" role="alert" tabIndex={-1} ref={summaryRef}>
              <div className="dm-error-summary-title">
                <CircleAlert size={16} /> Please fix {errorCount === 1 ? '1 field' : `${errorCount} fields`} before submitting
              </div>
              <ul>
                {errorOrder.filter(([k]) => errors[k]).map(([k, label]) => (
                  <li key={k}><a href={`#f-${k}`}>{label}: {errors[k]}</a></li>
                ))}
              </ul>
            </div>
          )}

          <div className="dm-form-section">
            <div className="dm-form-section-title">Your details</div>
            <div className="dm-form-grid">
              <div className="dm-form-field">
                <label htmlFor="f-name">Your name <span className="dm-req">*</span></label>
                <input
                  id="f-name" className={`dm-input${errors.name ? ' invalid' : ''}`} value={form.name}
                  onChange={set('name')} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'f-name-error' : undefined}
                />
                <FieldError id="f-name" message={errors.name} />
              </div>
              <div className="dm-form-field">
                <label htmlFor="f-email">Email <span className="dm-req">*</span></label>
                <input
                  id="f-email" type="email" className={`dm-input${errors.email ? ' invalid' : ''}`} value={form.email}
                  onChange={set('email')} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'f-email-error' : 'f-email-hint'}
                />
                {errors.email
                  ? <FieldError id="f-email" message={errors.email} />
                  : <div className="dm-hint" id="f-email-hint">We will send updates about this request here.</div>}
              </div>
            </div>
          </div>

          <div className="dm-form-section">
            <div className="dm-form-section-title">Your request</div>
            <div className="dm-form-grid">
              <div className="dm-form-field">
                <label htmlFor="f-type">Request type <span className="dm-req">*</span></label>
                <div className="dm-select">
                  <select
                    id="f-type" className={`dm-input${errors.type ? ' invalid' : ''}${form.type ? '' : ' placeholder'}`} value={form.type}
                    onChange={set('type')} aria-invalid={!!errors.type} aria-describedby={errors.type ? 'f-type-error' : undefined}
                  >
                    <option value="">Select a request type</option>
                    {requestTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                  <ChevronDown size={16} className="dm-select-icon" />
                </div>
                <FieldError id="f-type" message={errors.type} />
              </div>

              <fieldset className="dm-form-field">
                <legend>Priority <span className="dm-req">*</span></legend>
                <div className="dm-segmented" role="radiogroup">
                  {['Standard', 'Expedited'].map(p => (
                    <label key={p} className={`dm-segment${form.priority === p ? ' selected' : ''}`}>
                      <input
                        type="radio" name="priority" value={p} checked={form.priority === p}
                        onChange={() => setForm(f => ({ ...f, priority: p }))}
                      />
                      {p}
                    </label>
                  ))}
                </div>
                <div className="dm-hint">Choose Expedited only if the request is time-sensitive.</div>
              </fieldset>
            </div>

            {selectedType && (
              <div className="dm-routing active" aria-live="polite">
                <Route size={15} />
                <span>This request will go to <strong>{selectedType.unit}</strong>.</span>
              </div>
            )}

            <div className="dm-form-field">
              <label htmlFor="f-description">Description <span className="dm-req">*</span></label>
              <textarea
                id="f-description" rows={5} maxLength={DESCRIPTION_LIMIT}
                className={`dm-input${errors.description ? ' invalid' : ''}`} value={form.description}
                onChange={set('description')} placeholder="Tell us what you need and include any reference numbers."
                aria-invalid={!!errors.description} aria-describedby={`f-description-count${errors.description ? ' f-description-error' : ''}`}
              />
              <div className="dm-field-foot">
                <FieldError id="f-description" message={errors.description} />
                <span className="dm-counter" id="f-description-count">{form.description.length} / {DESCRIPTION_LIMIT}</span>
              </div>
            </div>

            <div className="dm-form-field">
              <span className="dm-label">Supporting document <span className="dm-optional">Optional</span></span>
              {form.file ? (
                <div className="dm-file">
                  <FileText size={16} />
                  <span className="dm-file-name">{form.file.name}</span>
                  <span className="dm-file-size">{form.file.size}</span>
                  <button type="button" className="dm-file-remove" aria-label="Remove file" onClick={() => setForm(f => ({ ...f, file: null }))}>
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button
                  type="button" className="dm-dropzone"
                  onClick={() => setForm(f => ({ ...f, file: { name: 'DDC_Certificate_scan.jpg', size: '1.1 MB' } }))}
                >
                  <Upload size={20} />
                  <span className="dm-dropzone-title">Click to upload or drag and drop</span>
                  <span className="dm-dropzone-sub">PDF, JPG or PNG, up to 10 MB</span>
                </button>
              )}
            </div>
          </div>

          <div className="dm-system-note">
            <Lock size={13} />
            Your request ID, the date and the reviewing team are added automatically when you submit.
          </div>

          <div className="dm-form-actions">
            <button type="button" className="dm-btn secondary" onClick={() => navigate('/demo/submit')}>Cancel</button>
            <button type="submit" className="dm-btn primary"><Send size={14} /> Submit request</button>
          </div>
        </form>
      </div>
    </PortalShell>
  )
}
