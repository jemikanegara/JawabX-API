const { gql } = require('apollo-server');

module.exports = gql`
  scalar JSON

  type Journal {
    # Type of Journal
    accounts: [String]
    trueAnswer: JSON
  }

  type Choice {
    options: [String]
    trueAnswer: JSON
  }

  type Answer {
    _id: ID
    journal: Journal
    multi: Choice
    single: Choice
    word: String
  }

  enum PageType {
    CONCEPT,
    PRACTICE
  }

  type Page {
    _id: ID
    explanation: String
    type: PageType
    answers: [Answer]
  }

  enum ModuleType {
    LEARN
    EXERCISE
    TEST
  }

  type Images {
    small: String
    medium: String
    original: String
  }

  type Module {
    _id: ID!
    type: ModuleType
    images: [Images]
    title: String!
    description: String!
    pages: [Page]
    user: User!
  }

  type User {
    _id: ID
    name: String
    username: String
    email: String
    phone: String
    module: [Module]
  }

  input AnswerMutation {
    _id: ID
    journal: JSON
    multi: JSON
    single: JSON
    word: String
  }

  input PageMutation {
    _id: ID
    explanation: String
    type: PageType
    answers: [AnswerMutation]
  }

  input ModuleMutation {
    _id: ID
    type: ModuleType
    images: [Upload]
    title: String
    description: String
    pages: [PageMutation]
  }

  type Query {
    user(_id: ID): [User]
    modules(user: ID, text: String, type: ModuleType, lastModuleIndex: ID): [Module]
    module(_id: ID): Module
    page(_id: ID): Page
    solution(_id: ID): Answer
  }

  type Mutation {
    register(email: String, password: String, phone: String, name: String): String
    login(email: String!, password: String!, phone: String): String
    update(email: String, password: String, newPass: String, phone: String, name: String): String
    auth: Boolean
    modifyModule(data: ModuleMutation): ID
    deleteModule(data: ModuleMutation): Boolean
    modifyPage(data: PageMutation): ID
    deletePage(data: PageMutation): Boolean
  }
`;