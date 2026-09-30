import { useState } from 'react'

const Books = ({ show, books }) => {
  const [genre, setGenre] = useState(null)

  if (!show) {
    return null
  }

  // To remove duplicates, first collect every book's genres into a single flat list with flatMap. Then pass that list through a Set, which only keeps unique values:
  const genres = [...new Set(books.flatMap((b) => b.genres))]

  // if genre null then provide all books
  const booksToShow = genre
    ? books.filter((b) => b.genres.includes(genre))
    : books

  return (
    <div>
      <h2>books</h2>

      <pre>
        Number of books: {booksToShow.length}{' '}
        {genre && (
          <i>
            in genre <b>{genre}</b>
          </i>
        )}
      </pre>
      <div>
        {genres.map((g) => (
          <button key={g} onClick={() => setGenre(g)}>
            {g}
          </button>
        ))}
        <button onClick={() => setGenre(null)}>all genres</button>
      </div>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksToShow.map((a) => (
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

export default Books
