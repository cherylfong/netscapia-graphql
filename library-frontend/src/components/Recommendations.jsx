const Recommendations = ({ show, books, user }) => {
  if (!show) {
    return null
  }

  if(!user){
    return <p>Login to see recommendations.</p>
  }

  const favorite = user.favoriteGenre

  const booksToShow = user
    ? books.filter((b) => b.genres.includes(favorite))
    : books

  return (
    <div>
      <h2>recommendations</h2>
      <p>hello {user.username}!</p>
      <p>
        books in your favorite genre <b>{favorite}</b>
      </p>

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

export default Recommendations
