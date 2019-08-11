const { gql } = require('apollo-server');

module.exports = gql`
  enum AnswerType {
    JOURNAL,
    MULTI,
    SINGLE,
    WORD
  }

  type Answer {
    _id: ID
    type: AnswerType
    answer: String
  }

  enum PageType {
    CONCEPT,
    PRACTICE
  }

  type Page {
    _id: ID
    explanation: String,
    type: PageType,
    answers: [Answer]
  }

  enum ModuleType {
    LEARN,
    EXERCISE,
    TEST
  }

  type Module {
    _id: ID
    type: ModuleType
    thumbnail: String
    title: String
    description: String
    pages: [Page]
  }

  type User {
    _id: ID
    username: String
    email: String
    phone: String
    module: [Module]
  }

  type Query {
    user(_id: ID): [User]
    modules: [Module]
    module(_id: ID): [Page]
  }

  input AnswerMutation {
    _id: ID
    type: AnswerType
    answer: String
  }

  input PageMutation {
    _id: ID
    explanation: String,
    type: PageType,
    answers: [AnswerMutation]
  }

  input ModuleMutation {
    _id: ID
    type: ModuleType
    thumbnail: String
    title: String
    description: String
    pages: [PageMutation]
  }

  type Mutation {
    register(email: String, password: String, phone: String): String
    login(email: String, password: String, phone: String): String
    modifyModule(data: ModuleMutation): ID
    deleteModule(data: ModuleMutation): Boolean
    modifyPage(data: PageMutation): ID
    deletePage(data: PageMutation): Boolean
  }
`;