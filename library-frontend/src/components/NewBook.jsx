import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { ALL_BOOKS, ADD_BOOK, ALL_AUTHORS } from '../queries'
import { useNotification } from '../NotificationContext'
import { addBookToCache } from '../utils/apolloCache'

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])
  const { notify } = useNotification()

  const [addBook] = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }],
    onCompleted: () => notify('book added'),
    onError: (error) => notify(error.message),
    update: (cache, response) => {
      const addedBook = response.data.addBook
      addBookToCache(cache, addedBook)
    },
  })

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    console.log('add book...')

    const publishedYear = Number(published)

    if (published.trim() === '' || !Number.isInteger(publishedYear)) {
      return
    }

    addBook({
      variables: { title, author, published: publishedYear, genres },
    })

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <h2>Add Book</h2>
      <form onSubmit={submit}>
        <div>
          <label>
            title
            <input
              value={title}
              onChange={({ target }) => setTitle(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            author
            <input
              value={author}
              onChange={({ target }) => setAuthor(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            published
            <input
              type="number"
              value={published}
              onChange={({ target }) => setPublished(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            genre
            <input
              value={genre}
              onChange={({ target }) => setGenre(target.value)}
            />
          </label>
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook
