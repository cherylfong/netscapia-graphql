import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Notify from './components/Notify'
import AuthorForm from './components/AuthorForm'
import Recommendations from './components/Recommendations'
import { ALL_AUTHORS, ALL_BOOKS, USER_INFO } from './queries'
import { useApolloClient } from '@apollo/client/react'

import { useNotification } from './NotificationContext'

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('library-user-token'))
  const [page, setPage] = useState('authors')

  const { notify } = useNotification()

  const result = useQuery(ALL_AUTHORS)
  const books = useQuery(ALL_BOOKS)

  // make query depend on token field
  // if token is null then skip the query
  // so user never gets null
  const user = useQuery(USER_INFO, { skip: !token })

  const client = useApolloClient()

  console.log('App rendered', {
    page,
    authorsLoading: result.loading,
    booksLoading: books.loading,
    authorsError: result.error,
    booksError: books.error,
    booksData: books.data,
    userLoading: user.loading,
    userError: user.error,
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
    notify('User Logged OUT!')
  }

  return (
    <div>
      <div>
        <Notify />
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token && <button onClick={() => setPage('add')}>add book</button>}
        {token && (
          <button onClick={() => setPage('recommend')}>recommend</button>
        )}
        <button onClick={() => setPage('edit-authors')}>
          set author birth year
        </button>
        {token ? (
          <button onClick={onLogout}>logout</button>
        ) : (
          <button onClick={() => setPage('login')}>login</button>
        )}
      </div>
      <Authors
        authors={result.data.allAuthors}
        show={page === 'authors'}
        setError={notify}
      />

      <Books show={page === 'books'} books={books.data?.allBooks ?? []} />

      {token && <NewBook show={page === 'add'} setError={notify} />}
      {token && (
        <Recommendations show={page === 'recommend'} user={user.data?.me} />
      )}
      <AuthorForm
        show={page === 'edit-authors'}
        authors={result.data.allAuthors}
        setError={notify}
      />

      {!token && page === 'login' && <LoginForm setToken={setToken} />}
    </div>
  )
}

export default App
