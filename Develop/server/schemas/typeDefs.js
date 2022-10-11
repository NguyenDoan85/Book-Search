const { gql } = require ('apollo-server-express');

const typeDefs = gql`

type Book {
    _id: ID!
    bookId: String
    authors: [String]
    description: String
    title: String
    image: String
    link: String
}

type User {
    _id: ID!
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
}

input savedBooks {
    description: String
    title: String
    bookId: String
    link: String
    authors: [String]
}  

type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(input: savedBooks!): User
    removeBook(bookId: ID!): User
}

type Auth {
    token: ID!
    user: User
}
`;

module.exports = typeDefs;