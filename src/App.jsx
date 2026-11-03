import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import SideNav from './components/SideNav'
import Dashboard from './pages/Dashboard'
import RenewalFlow from './pages/RenewalFlow'
import IndexPage from './pages/IndexPage'
import MyRequests from './demo/MyRequests'
import NewRequest from './demo/NewRequest'
import RequestConfirmation from './demo/RequestConfirmation'
import RequestDetail from './demo/RequestDetail'
import ReviewQueue from './demo/ReviewQueue'
import ReviewRequest from './demo/ReviewRequest'

function VisionLayout() {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <SideNav />
      <Outlet />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<IndexPage />} />

          <Route element={<VisionLayout />}>
            <Route path="/vision" element={<Dashboard />} />
            <Route path="/renewal" element={<RenewalFlow />} />
          </Route>

          {/* Step 1 · John submits */}
          <Route path="/demo/submit" element={<MyRequests key="s1" step={1} />} />
          <Route path="/demo/submit/new" element={<NewRequest />} />
          <Route path="/demo/submit/confirmation" element={<RequestConfirmation />} />
          <Route path="/demo/submit/:id" element={<RequestDetail key="d1" step={1} />} />

          {/* Step 2 · Sarah returns */}
          <Route path="/demo/review" element={<ReviewQueue key="q2" step={2} />} />
          <Route path="/demo/review/:id" element={<ReviewRequest key="r2" step={2} />} />

          {/* Step 3 · John updates and resubmits */}
          <Route path="/demo/fix" element={<MyRequests key="s3" step={3} />} />
          <Route path="/demo/fix/:id" element={<RequestDetail key="d3" step={3} />} />

          {/* Step 4 · Sarah approves */}
          <Route path="/demo/approve" element={<ReviewQueue key="q4" step={4} />} />
          <Route path="/demo/approve/:id" element={<ReviewRequest key="r4" step={4} />} />

          {/* Step 5 · John sees the decision */}
          <Route path="/demo/decision" element={<MyRequests key="s5" step={5} />} />
          <Route path="/demo/decision/:id" element={<RequestDetail key="d5" step={5} />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
