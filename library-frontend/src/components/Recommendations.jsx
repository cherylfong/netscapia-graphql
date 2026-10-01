import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS } from '../queries'

const Recommendations = ({ show, user }) => {
  const genre = user?.favoriteGenre

  const result = useQuery(ALL_BOOKS, {
    variables: { genre },
    skip: !genre,
  })

  if (!show) {
    return null
  }

  if (!user) {
    return <p>Login to see recommendations.</p>
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  const books = result.data?.allBooks ?? []

  return (
    <div>
      <h2>recommendations</h2>
      <p>hello {user.username}!</p>
      <p>
        books in your favorite genre <b>{genre}</b>
      </p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommendations
