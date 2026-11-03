import { createContext, useContext, useState } from 'react'

const AppContext = createContext()

export function AppProvider({ children }) {
  const [renewalStatus, setRenewalStatus] = useState(null) // null | 'submitted' | 'resubmitted'
  const [showSuccessBanner, setShowSuccessBanner] = useState(false)
  const [sarahReuploadVisible, setSarahReuploadVisible] = useState(false)
  const [isReupload, setIsReupload] = useState(false)

  const resetHome = () => {
    setRenewalStatus(null)
    setShowSuccessBanner(false)
    setSarahReuploadVisible(false)
    setIsReupload(false)
  }

  return (
    <AppContext.Provider value={{
      resetHome,
      renewalStatus, setRenewalStatus,
      showSuccessBanner, setShowSuccessBanner,
      sarahReuploadVisible, setSarahReuploadVisible,
      isReupload, setIsReupload,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
