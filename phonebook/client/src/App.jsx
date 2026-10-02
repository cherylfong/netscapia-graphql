import { useState } from 'react'

import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notify from './components/Notify'
import PhoneForm from './components/PhoneForm'
import LoginForm from './components/LoginForm'
import { ALL_PERSONS, PERSON_ADDED } from './queries'
import {
  useApolloClient,
  useQuery,
  useSubscription,
} from '@apollo/client/react'
import { addPersonToCache } from './utils/apolloCache'

const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem('phonebook-user-token'),
  )
  const [errorMessage, setErrorMessage] = useState(null)
  const result = useQuery(ALL_PERSONS)
  const client = useApolloClient()

  useSubscription(PERSON_ADDED, {
    onData: ({ data }) => {
      const addedPerson = data.data.personAdded
      notify(`${addedPerson.name} added`)
      addPersonToCache(client.cache, addedPerson)
    },
  })

  console.log('App rendered', {
    personsLoading: result.loading,
    personsError: result.error,
    personData: result.data,
  })

  if (result.loading) return <div>loading...</div>
  if (result.error) return <div>error: {result.error.message}</div>

  const onLogout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  if (!token) {
    return (
      <div>
        <Notify errorMessage={errorMessage} />
        <h2>Login</h2>
        <LoginForm setToken={setToken} setError={notify} />
      </div>
    )
  }

  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <button onClick={onLogout}>logout</button>
      <Persons persons={result.data.allPersons} />
      <PersonForm setError={notify} />
      <PhoneForm setError={notify} />
    </div>
  )
}

export default App
