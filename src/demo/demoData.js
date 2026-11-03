// Generic Service Request scenario — aligned to TLC Vendor Demonstration Criteria, Section 2.
// Story: submitted Nov 2 10:14 AM → returned Nov 2 3:40 PM → resubmitted Nov 3 9:05 AM → approved Nov 3 11:20 AM (2026).

export const john = {
  name: 'John Martinez',
  firstName: 'John',
  initials: 'JM',
  email: 'john.martinez@gmail.com',
}

export const sarah = {
  name: 'Sarah Chen',
  initials: 'SC',
  role: 'Licensing Support',
}

// Four values per TLC criteria, modeled on TLC's existing channels (TLC UP, licensing inquiries, inspections, prosecution)
export const requestTypes = [
  { value: 'document', label: 'Document submission and inquiry', unit: 'Licensing Support', blurb: 'Send a document for TLC to review or ask about one' },
  { value: 'licensing', label: 'Licensing inquiry', unit: 'Licensing Support', blurb: 'Questions about your license or renewal' },
  { value: 'vehicle', label: 'Vehicle and inspection inquiry', unit: 'Vehicle Inspections', blurb: 'Inspections, plates and vehicle records' },
  { value: 'summons', label: 'Summons or suspension question', unit: 'Prosecution', blurb: 'Questions about a summons or a suspension' },
]

export const documentDescription =
  'I completed a defensive driving course in September. Please confirm whether the certificate will be accepted for my license renewal, and let me know if any additional documents are needed.'

export const DESCRIPTION_LIMIT = 1000

// Where SR-00482 is in the story. Shared by both profiles and kept until the overview relaunches the experience.
const STAGE_KEY = 'tlc-demo-stage'
export const stage = {
  get: () => sessionStorage.getItem(STAGE_KEY) ?? 'new', // new | submitted | returned | resubmitted | approved
  set: (s) => sessionStorage.setItem(STAGE_KEY, s),
  reset: () => sessionStorage.removeItem(STAGE_KEY),
}

export const profiles = {
  john: { name: john.name, initials: john.initials, role: 'Driver', app: 'TLC Connect', path: '/requests', tone: 'navy' },
  sarah: { name: sarah.name, initials: sarah.initials, role: sarah.role, app: 'TLC One', path: '/one/requests', tone: 'green' },
}

// ── The scenario request ─────────────────────────
export const scenarioRequest = {
  id: 'SR-00482',
  name: john.name,
  email: john.email,
  type: 'Document submission and inquiry',
  priority: 'Standard',
  unit: 'Licensing Support',
  summary: 'Defensive Driving Certificate for my renewal',
  description: documentDescription,
  submitted: 'Nov 2, 2026 · 10:14 AM',
  submittedDate: 'Nov 2, 2026',
  returned: 'Nov 2, 2026 · 3:40 PM',
  resubmitted: 'Nov 3, 2026 · 9:05 AM',
  decided: 'Nov 3, 2026 · 11:20 AM',
  decidedDate: 'Nov 3, 2026',
  returnNote: 'The certificate scan is unreadable. Please upload a clearer copy.',
  approveNote: 'Your certificate is accepted and your license file is complete. No additional documents are needed.',
  firstFile: { name: 'DDC_Certificate_scan.jpg', size: '1.1 MB', added: 'Nov 2, 2026' },
  secondFile: { name: 'DDC_Certificate_JMartinez.pdf', size: '640 KB', added: 'Nov 3, 2026' },
}

const r = scenarioRequest

// State of SR-00482 at each point in the story
export function scenarioState(state) {
  const files = ['resubmitted', 'approved'].includes(state)
    ? [{ ...r.secondFile, current: true }, { ...r.firstFile, current: false }]
    : [{ ...r.firstFile, current: true, flagged: state === 'returned' }]

  const updated = {
    submitted: r.submittedDate, returned: 'Nov 2, 2026', resubmitted: 'Nov 3, 2026', approved: r.decidedDate,
  }[state]

  return {
    ...r, status: state, files, updated,
    decisionNote: state === 'approved' ? r.approveNote : null,
    decidedOn: state === 'approved' ? r.decided : null,
    timeline: scenarioTimeline(state),
  }
}

// What John sees, newest first
export function scenarioTimeline(state) {
  const all = [
    { status: 'approved', title: 'Approved', date: r.decided, text: `Decision by ${r.unit}.`, note: r.approveNote },
    { status: 'resubmitted', title: 'You resubmitted the request', date: r.resubmitted, text: 'You uploaded a clearer copy of your certificate.' },
    { status: 'returned', title: 'Returned for more information', date: r.returned, text: `${r.unit} needs something from you. We emailed you.`, note: r.returnNote },
    { status: 'submitted', title: 'Submitted', date: r.submitted, text: `Sent to ${r.unit} for review.` },
  ]
  const order = ['submitted', 'returned', 'resubmitted', 'approved']
  const keep = order.slice(0, order.indexOf(state) + 1)
  return all.filter(t => keep.includes(t.status))
}

// What staff see in TLC One, newest first
export function staffHistory(state) {
  const all = [
    { key: 'approved', date: r.decided, actor: 'Sarah Chen', action: 'approved the request', detail: '“Certificate accepted. No additional documents are needed.” · Requester notified by email', tone: 'green' },
    { key: 'resubmitted', date: r.resubmitted, actor: 'John Martinez', action: 'resubmitted the request', detail: `Replaced ${r.firstFile.name} with ${r.secondFile.name}`, tone: 'blue' },
    { key: 'returned', date: r.returned, actor: 'Sarah Chen', action: 'returned the request for information', detail: `“${r.returnNote}” · Requester notified by email`, tone: 'amber' },
    { key: 'routed', date: r.submitted, actor: 'Routing rule', action: 'assigned the request to Licensing Support', detail: 'Based on request type: Document submission and inquiry', tone: 'gray' },
    { key: 'submitted', date: r.submitted, actor: 'John Martinez', action: 'submitted the request through TLC Connect', detail: `Attached ${r.firstFile.name}`, tone: 'blue' },
  ]
  const order = ['submitted', 'routed', 'returned', 'resubmitted', 'approved']
  const keep = order.slice(0, order.indexOf(state === 'submitted' ? 'routed' : state) + 1)
  return all.filter(h => keep.includes(h.key))
}

// ── John's other requests ────────────────────────
export const johnPriorRequests = [
  {
    id: 'SR-00471', type: 'Vehicle and inspection inquiry', unit: 'Vehicle Inspections', priority: 'Standard', status: 'in-review',
    summary: 'Question about my inspection appointment', submitted: 'Oct 29, 2026', updated: 'Oct 30, 2026',
    description: 'My inspection is booked for November 18. Can I bring a replacement registration card if the original is damaged?',
  },
  {
    id: 'SR-00436', type: 'Document submission and inquiry', unit: 'Licensing Support', priority: 'Standard', status: 'approved',
    summary: 'Copy of my renewed DMV license', submitted: 'Sep 18, 2026', updated: 'Sep 19, 2026',
    description: 'My NYS DMV license was renewed. I have attached a copy of the new card.',
    decisionNote: 'Your DMV license record has been updated.', decided: 'Sep 19, 2026',
  },
  {
    id: 'SR-00402', type: 'Licensing inquiry', unit: 'Licensing Support', priority: 'Standard', status: 'approved',
    summary: 'Which renewal course providers are approved', submitted: 'Aug 3, 2026', updated: 'Aug 5, 2026',
    description: 'Where can I find the list of approved providers for the TLC Driver License Renewal Course?',
    decisionNote: 'The approved provider list is on the TLC website under Driver Education.', decided: 'Aug 5, 2026',
  },
  {
    id: 'SR-00377', type: 'Summons or suspension question', unit: 'Prosecution', priority: 'Standard', status: 'approved',
    summary: 'Hearing date for a parking summons', submitted: 'Jun 21, 2026', updated: 'Jun 22, 2026',
    description: 'I received a summons on June 18 and cannot find my hearing date. Can you confirm it?',
    decisionNote: 'Your hearing is scheduled for July 14, 2026. Details are on your summons record.', decided: 'Jun 22, 2026',
  },
  {
    id: 'SR-00318', type: 'Licensing inquiry', unit: 'Licensing Support', priority: 'Standard', status: 'approved',
    summary: 'Status of my license record', submitted: 'Aug 12, 2025', updated: 'Aug 14, 2025',
    description: 'My insurance company needs confirmation that my TLC license is active. Can you send it?',
    decisionNote: 'A confirmation of your active license was emailed to you.', decided: 'Aug 14, 2025',
  },
  {
    id: 'SR-00256', type: 'Vehicle and inspection inquiry', unit: 'Vehicle Inspections', priority: 'Expedited', status: 'rejected',
    summary: 'Approval for a replacement vehicle', submitted: 'Feb 7, 2025', updated: 'Feb 10, 2025',
    description: 'I would like to replace my vehicle with a 2014 Honda Accord. Can this be approved?',
    decisionNote: 'The proposed vehicle does not meet the current vehicle age requirement.', decided: 'Feb 10, 2025',
  },
  {
    id: 'SR-00209', type: 'Vehicle and inspection inquiry', unit: 'Vehicle Inspections', priority: 'Standard', status: 'approved',
    summary: 'Reschedule my vehicle inspection', submitted: 'Mar 4, 2024', updated: 'Mar 6, 2024',
    description: 'I need to move my inspection from March 12 to a later date this month.',
    decisionNote: 'Your inspection has been moved to March 26, 2024.', decided: 'Mar 6, 2024',
  },
  {
    id: 'SR-00163', type: 'Summons or suspension question', unit: 'Prosecution', priority: 'Standard', status: 'approved',
    summary: 'Paying a summons in installments', submitted: 'Nov 10, 2023', updated: 'Nov 13, 2023',
    description: 'Can I pay my summons in installments instead of all at once?',
    decisionNote: 'Yes. An installment plan has been set up and sent to your email.', decided: 'Nov 13, 2023',
  },
  {
    id: 'SR-00117', type: 'Document submission and inquiry', unit: 'Licensing Support', priority: 'Standard', status: 'approved',
    summary: 'Updated proof of address', submitted: 'Jun 19, 2023', updated: 'Jun 21, 2023',
    description: 'I moved to 87-23 168th Street, Jamaica, NY 11432. I have attached a utility bill as proof.',
    decisionNote: 'Your address has been updated.', decided: 'Jun 21, 2023',
  },
]

// Timeline for a past request
export function priorTimeline(req) {
  const items = []
  if (req.status === 'approved' || req.status === 'rejected') {
    items.push({
      status: req.status, title: req.status === 'approved' ? 'Approved' : 'Not approved',
      date: req.decided, text: `Decision by ${req.unit}.`, note: req.decisionNote,
    })
  }
  if (req.status === 'in-review') {
    items.push({ status: 'in-review', title: 'In review', date: req.updated, text: `${req.unit} is reviewing your request.` })
  }
  items.push({ status: 'submitted', title: 'Submitted', date: req.submitted, text: `Sent to ${req.unit} for review.` })
  return items
}

// ── Licensing Support queue in TLC One ───────────
export const otherQueueItems = [
  { id: 'SR-00479', requester: 'Wei Zhang', type: 'Licensing inquiry', priority: 'Standard', status: 'submitted', updated: 'Nov 1, 2026', baseWaiting: 1 },
  { id: 'SR-00476', requester: 'Ahmed Khan', type: 'Document submission and inquiry', priority: 'Expedited', status: 'submitted', updated: 'Oct 31, 2026', baseWaiting: 2 },
  { id: 'SR-00474', requester: 'Fatou Diallo', type: 'Document submission and inquiry', priority: 'Standard', status: 'submitted', updated: 'Oct 30, 2026', baseWaiting: 3 },
  { id: 'SR-00470', requester: 'Maria Gonzalez', type: 'Licensing inquiry', priority: 'Expedited', status: 'submitted', updated: 'Oct 29, 2026', baseWaiting: 4 },
  { id: 'SR-00468', requester: 'David Cohen', type: 'Document submission and inquiry', priority: 'Standard', status: 'submitted', updated: 'Oct 28, 2026', baseWaiting: 5 },
]

export const queueStats = [
  { label: 'Pending review' },
  { label: 'Expedited', value: '2' },
  { label: 'Awaiting requester' },
  { label: 'Avg. time to decision', value: '2.4', unit: 'days' },
]
