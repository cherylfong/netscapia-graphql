import AuthorForm from './AuthorForm'

const Authors = ({ show, authors, setError }) => {
  if (!show) {
    return null
  }

  return (
    <div>
      <h2>authors</h2>

      <pre>Number of authors: {authors.length}</pre>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <AuthorForm authors={authors} setError={setError} />
    </div>
  )
}

export default Authors
