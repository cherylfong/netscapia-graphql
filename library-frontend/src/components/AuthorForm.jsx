import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { ALL_BOOKS, ALL_AUTHORS, CHANGE_BIRTH } from '../queries'
import { useNotification } from '../NotificationContext'

const AuthorForm = ({ authors }) => {
  const [name, setName] = useState('')
  const [year, setYear] = useState('')
  const { notify } = useNotification()

  const [editAuthor] = useMutation(CHANGE_BIRTH, {
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }],
    onCompleted: (data) => {
      if (!data.editAuthor) {
        console.log('author not found')
      }
      notify(
        `updated "${data.editAuthor.name}" to year ${data.editAuthor.born}`,
      )
    },
    onError: (error) => notify(error.message),
  })

  const submit = async (event) => {
    event.preventDefault()

    const yearInteger = Number(year)

    if (name === '' || year.trim() === '' || !Number.isInteger(yearInteger)) {
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
          <select
            name="select-author"
            value={name}
            onChange={(e) => setName(e.target.value)}
          >
            <option value="" disabled>
              select author
            </option>
            {authors.map((a) => (
              <option key={a.id} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>
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
