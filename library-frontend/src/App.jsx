import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { ALL_AUTHORS, ALL_BOOKS } from './queries'

const App = () => {
  const [page, setPage] = useState('authors')

  const result = useQuery(ALL_AUTHORS)
  const books = useQuery(ALL_BOOKS)

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

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => setPage('add')}>set author birth year</button>
      </div>

      <Authors authors={result.data.allAuthors} show={page === 'authors'} />

      <Books show={page === 'books'} books={books.data?.allBooks ?? []} />

      <NewBook show={page === 'add'} />

    </div>
  )
}

export default App
