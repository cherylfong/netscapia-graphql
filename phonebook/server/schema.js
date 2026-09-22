const typeDefs = /* GraphQL */ `
  type Address {
    street: String!
    city: String!
  }
  type Person {
    name: String!
    phone: String
    address: Address!
    city: String!
    id: ID!
  }
  enum YesNo {
    YES
    NO
  }

  type User {
    username: String!
    friends: [Person!]!
    id: ID!
  }
  type Token {
    token: String!
  }

  type Query {
    personCount: Int!

    allPersons(phone: YesNo): [Person!]!

    findPerson(name: String!): Person

    me: User
  }

  type Mutation {
    addPerson(
      name: String!
      phone: String
      street: String!
      city: String!
    ): Person
    editNumber(name: String!, phone: String!): Person

    # user related mutation
    createUser(username: String!): User
    login(username: String!, password: String!): Token
  }
`

module.exports = typeDefs
