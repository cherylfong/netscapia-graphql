import { useNotification } from '../NotificationContext'

const Notify = () => {
  const { message } = useNotification()

  if (!message) {
    return null
  }
  return <div style={{ color: 'red' }}>{message}</div>
}

export default Notify
