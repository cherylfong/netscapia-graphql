const { v4: uuidv4 } = require('uuid')
const Author = require('./models/author')
const Book = require('./models/book')

const { GraphQLError } = require('graphql')

const countBooksByAuthor = (authorId) =>
  Book.countDocuments({ author: authorId }).exec()
//   books.filter((book) => book.author === authorName).length

const resolvers = {
  Query: {
    authorCount: async () => Author.collection.countDocuments(),

    allAuthors: async (root, args) => Author.find({}).exec(),

    bookCount: async (root, args) => {
      if (!args.name) {
        return Book.countDocuments({}).exec()
      }

      const author = await Author.findOne({ name: args.name }).exec()

      return author ? countBooksByAuthor(author._id) : 0
    },

    allBooks: async (root, { author, genre }) => {
      const filter = {}

      if (author) filter.author = author
      if (genre) filter.genres = { $all: [genre] }

      // it is necessary to populate the field 'author' in the Book schema!
      // exec() returns a promise
      //
      // .exec() means: “Run this Mongoose query.”
      // await means: “Pause here until the promise finishes.”
      // Mongoose queries are thenable, so this often also works:
      // const books = await Book.find({})
      // But .exec() makes the query execution explicit and returns a standard promise.
      return Book.find(filter).populate('author').exec()
    },
  },

  // self-defined resolver
  Author: {
    // receives parent author object as param
    bookCount: (author) => countBooksByAuthor(author._id),
  },

  Mutation: {
    addBook: async (root, args) => {
      let author = await Author.findOne({ name: args.author })

      if (!author) {
        author = await new Author({ name: args.author }).save()
      }

      const book = new Book({
        title: args.title,
        author: author,
        published: args.published,
        genres: args.genres,
      })

      try {
        await book.save()
        await book.populate('author')
      } catch (error) {
        throw new GraphQLError(`Saving BOOK failed: ${error.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
            error,
          },
        })
      }

      return book
    },
    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name })
      if (!author) {
        return null
      }
      author.born = args?.setBornTo

      try {
        await author.save()
      } catch (error) {
        throw new GraphQLError(`Failed to UPDATE AUTHOR: ${error.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error,
          },
        })
      }
      return author
    },
  },
}

module.exports = resolvers
