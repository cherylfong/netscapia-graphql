import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Notify from './components/Notify'
import { ALL_AUTHORS, ALL_BOOKS } from './queries'
import { useApolloClient } from '@apollo/client/react'

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('library-user-token'))
  const [page, setPage] = useState('authors')

  const [errorMessage, setErrorMessage] = useState(null)

  const result = useQuery(ALL_AUTHORS)
  const books = useQuery(ALL_BOOKS)

  const client = useApolloClient()

  console.log('App rendered', {
    page,
    authorsLoading: result.loading,
    booksLoading: books.loading,
    authorsError: result.error,
    booksError: books.error,
    booksData: books.data,
  })

  if (result.loading || books.loading) {
    return <div>loading...</div>
  }

  if (result.error || books.error) {
    return <div>Error loading data</div>
  }

  const onLogout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setErrorMessage('User Logged OUT!')
  }

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  return (
    <div>
      <div>
        <Notify errorMessage={errorMessage} />
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => setPage('authors')}>
          set author birth year
        </button>
        {token ? (
          <button onClick={onLogout}>logout</button>
        ) : (
          <button onClick={() => setPage('login')}>login</button>
        )}
      </div>
      <Authors authors={result.data.allAuthors} show={page === 'authors'} />
      <Books show={page === 'books'} books={books.data?.allBooks ?? []} />
      <NewBook show={page === 'add'} />

      {!token && page === 'login' && (
        <LoginForm setToken={setToken} setError={notify} />
      )}
    </div>
  )
}

export default App
