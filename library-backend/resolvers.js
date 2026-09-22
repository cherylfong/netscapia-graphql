const { v4: uuidv4 } = require('uuid')

const countBooksByAuthor = (authorName) =>
  books.filter((book) => book.author === authorName).length

const booksByAuthor = (authorName) =>
  books.filter((book) => book.author === authorName)

const booksByGenre = (genre) =>
  books.filter((book) => book.genres.includes(genre))

const authorByName = (authorName) => authors.find((a) => a.name === authorName)

const resolvers = {
  Query: {
    authorCount: () => authors.length,
    bookCount: (root, args) =>
      args.name ? countBooksByAuthor(args.name) : books.length,
    allBooks: (root, args) => {
      if (args.genre) {
        return booksByGenre(args.genre)
      }

      return args.author ? booksByAuthor(args.author) : books
    },
    allAuthors: () => authors,
  },

  // self-defined resolver
  Author: {
    // receives parent author object as param
    bookCount: (author) => countBooksByAuthor(author.name),
  },

  Mutation: {
    addBook: (root, args) => {
      if (!authorByName(args.author)) {
        //if author does not exist then add to authors
        const author = { name: args.author, born: null, id: uuidv4() }
        authors = authors.concat(author)
      }
      const book = { ...args, id: uuidv4() }
      books = books.concat(book)
      return book
    },
    editAuthor: (root, args) => {
      const author = authorByName(args.name)
      if (!author) {
        return null
      }

      const updatedAuthor = { ...author, born: args.setBornTo }
      authors = authors.map((a) => (a.name === args.name ? updatedAuthor : a))
      return updatedAuthor
    },
  },
}

module.exports = resolvers