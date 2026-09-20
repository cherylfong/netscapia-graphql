import { useQuery } from '@apollo/client/react'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import { ALL_PERSONS } from './queries'

const App = () => {
  const result = useQuery(ALL_PERSONS)

  if (result.loading) {
    return <div>loading...</div>
  }

  return (
    <div>
        <h1>HELLO</h1>
      <Persons persons={result.data.allPersons} />
      <PersonForm />
    </div>
  )
}

export default App