import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import SideNav from './components/SideNav'
import Dashboard from './pages/Dashboard'
import RenewalFlow from './pages/RenewalFlow'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
          <SideNav />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/renewal" element={<RenewalFlow />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AppProvider>
  )
}
