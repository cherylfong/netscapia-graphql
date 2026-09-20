import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { ALL_BOOKS, ALL_AUTHORS, CHANGE_BIRTH } from '../queries'

const AuthorForm = () => {
  const [name, setName] = useState('')
  const [year, setYear] = useState('')

  const [editAuthor] = useMutation(CHANGE_BIRTH, {
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }],
    onCompleted: (data) => {
      if (!data.editNumber) {
        console.log('author not found')
      }
    },
  })

  const submit = async (event) => {
    event.preventDefault()

    const yearInteger = Number(year)

    if (year.trim() === '' || !Number.isInteger(yearInteger)) {
      return
    }

    editAuthor({
      variables: { name, setBornTo: yearInteger },
    })

    setName('')
    setYear('')
  }

  return (
    <div>
      <h2>Set Author Birth Year</h2>
      <form onSubmit={submit}>
        <div>
          name
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>

        <div>
          born
          <input
            type="number"
            value={year}
            onChange={({ target }) => setYear(target.value)}
          />
        </div>

        <button type="submit">submit</button>
      </form>
    </div>
  )
}

export default AuthorForm
