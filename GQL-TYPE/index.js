const { gql } = require('apollo-server');

module.exports = gql`
  scalar JSON

# CHILD OUTPUT
  type Journal {
    accounts: [String]
    trueAnswer: JSON
  }

  type Choice {
    options: [String]
    trueAnswer: JSON
  }

# MAIN OUTPUT
  # ANSWER
  type Answer {
    _id: ID
    journal: Journal
    multi: Choice
    single: Choice
    word: String
  }

  # PAGE
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

  # MODULE
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

  # USER
  type User {
    _id: ID
    name: String
    username: String
    email: String
    phone: String
    module: [Module]
  }

# CHILD INPUT
  input ParentMutation {
    _id: ID!
    order: Int!
  }

# MAIN INPUT
  input AnswerMutation {
    _id: ID
    journal: JSON
    multi: JSON
    single: JSON
    word: String,
    parent: ParentMutation
  }

  input PageMutation {
    _id: ID
    explanation: String
    type: PageType
    answers: [AnswerMutation]
    parent: ParentMutation
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
    # USER
    user(_id: ID): [User]

    #ACCOUNT
    account: User

    # MODULE
    modules(user: ID, text: String, type: ModuleType, lastModuleIndex: ID): [Module]
    module(_id: ID): Module

    # PAGE
    page(_id: ID): Page

    # SOLUTION
    solution(_id: ID): Answer
  }

  type Mutation {
    # AUTH
    register(email: String, password: String, phone: String, name: String): String
    login(email: String!, password: String!, phone: String): String
    update(email: String, password: String, newPass: String, phone: String, name: String): String
    auth: Boolean

    # MODULE
    modifyModule(data: ModuleMutation): ID
    deleteModule(data: ModuleMutation): Boolean

    # PAGE
    modifyPage(data: PageMutation): ID
    deletePage(data: PageMutation): Boolean

    # ANSWER
    modifyAnswer(data: AnswerMutation): ID
    deleteAnswer(data: AnswerMutation): Boolean
  }
`;