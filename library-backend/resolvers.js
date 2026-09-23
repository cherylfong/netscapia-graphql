const { v4: uuidv4 } = require('uuid')
const Author = require('./models/author')
const Book = require('./models/book')

const { GraphQLError } = require('graphql')

const jwt = require('jsonwebtoken')
const User = require('./models/user')

const resolvers = {
  Query: {
    authorCount: async () => Author.collection.countDocuments(),

    allAuthors: async () => Author.find({}).exec(),

    bookCount: async (root, args) => {
      if (!args.name) {
        return Book.countDocuments({}).exec()
      }

      const author = await Author.findOne({ name: args.name }).exec()

      return author ? Book.countDocuments({ author: author._id }).exec() : 0
    },

    allBooks: async (root, args) => {
      const filter = {}
      const author = args.author
      const genre = args.genre

      if (author) {
        if (!(await Author.exists({ name: author }))) {
          throw new GraphQLError(`Author "${author}" does not exist.`, {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.title,
            },
          })
        }
        filter.author = author
      }
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

    me: (root, args, context) => {
      return context.currentUser
    },
  },

  // self-defined resolver
  Author: {
    // receives parent author object as param
    bookCount: (author) => Book.countDocuments({ author: author._id }).exec(),
  },

  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
          },
        })
      }

      if (await Book.exists({ title: args.title })) {
        throw new GraphQLError('Book Title needs to be unique!', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
          },
        })
      }

      if (args.title.length < 6) {
        throw new GraphQLError('Book title at least 5 characters long', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
          },
        })
      }

      if (args.author.length < 5) {
        throw new GraphQLError('Author name needs at least 4 characters long', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
          },
        })
      }

      let author = await Author.findOne({ name: args.author })

      if (!author) {
        author = new Author({ name: args.author })

        try {
          await author.save()
        } catch (error) {
          throw new GraphQLError(`Saving AUTHOR failed: ${error.message}`, {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.title,
              error,
            },
          })
        }
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
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
          },
        })
      }

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

    createUser: async (root, args) => {
      const user = new User({ ...args })

      return user.save().catch((error) => {
        throw new GraphQLError(`Creating the user failed: ${error.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            error,
          },
        })
      })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },

    _resetDatabase: async () => {
      if (process.env.NODE_ENV !== 'test') {
        throw new GraphQLError('_resetDatabase is only available in test mode')
      }
      await Author.deleteMany({})
      await Book.deleteMany({})
      await User.deleteMany({})
      return true
    },
  }, // mutation ending bracket
}

module.exports = resolvers
