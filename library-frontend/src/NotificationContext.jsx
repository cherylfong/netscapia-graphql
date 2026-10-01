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

export const useNotification = () => useContext(NotificationContext)
