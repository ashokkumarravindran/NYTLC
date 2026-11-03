import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { ConnectFrame } from './demo/shared'
import Dashboard from './pages/Dashboard'
import RenewalFlow from './pages/RenewalFlow'
import IndexPage from './pages/IndexPage'
import MyRequests from './demo/MyRequests'
import NewRequest from './demo/NewRequest'
import RequestDetail from './demo/RequestDetail'
import ReviewQueue from './demo/ReviewQueue'
import ReviewRequest from './demo/ReviewRequest'

function HomeLayout() {
  return (
    <ConnectFrame active="home">
      <Outlet />
    </ConnectFrame>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<IndexPage />} />

          {/* John in TLC Connect */}
          <Route element={<HomeLayout />}>
            <Route path="/home" element={<Dashboard />} />
            <Route path="/renewal" element={<RenewalFlow />} />
          </Route>
          <Route path="/requests" element={<MyRequests />} />
          <Route path="/requests/new" element={<NewRequest />} />
          <Route path="/requests/:id" element={<RequestDetail />} />

          {/* Sarah in TLC One */}
          <Route path="/one/requests" element={<ReviewQueue />} />
          <Route path="/one/requests/:id" element={<ReviewRequest />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
