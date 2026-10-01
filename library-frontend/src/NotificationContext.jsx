import { createContext, useContext, useState } from 'react'

const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
  const [message, setMessage] = useState(null)

  const notify = (msg) => {
    setMessage(msg)
    setTimeout(() => setMessage(null), 10000)
  }

  return (
    <NotificationContext.Provider value={{ message, notify }}>
      {children}
    </NotificationContext.Provider>
  )
}

// This hook must share the context created by the provider in this module.
// eslint-disable-next-line react-refresh/only-export-components
export const useNotification = () => useContext(NotificationContext)