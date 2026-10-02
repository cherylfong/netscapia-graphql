require('dotenv').config()

const mongoose = require('mongoose')
const connectToDatabase = require('./db')
const Author = require('./models/author')
const Book = require('./models/book')

const backfill = async () => {
  await connectToDatabase(process.env.MONGODB_URI)

  const authors = await Author.find({})

  for (const author of authors) {
    // every book whose `author` field points at this author's _id
    const books = await Book.find({ author: author._id })
    const bookIds = books.map((b) => b._id)

    await Author.updateOne(
      { _id: author._id },
      { $set: { bookCount: bookIds } },
    )

    console.log(`${author.name}: ${bookIds.length} book(s)`)
  }

  await mongoose.connection.close()
}

backfill()
