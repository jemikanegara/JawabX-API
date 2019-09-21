require('dotenv').config()
const { ApolloServer } = require('apollo-server');
const typeDefs = require('./GQL-TYPE');
const Query = require('./GQL-QUERY')
const Mutation = require('./GQL-MUTATION');
const { connect, set } = require('mongoose')
const { checkToken } = require('./FUNCTIONS/tokenFunction')
const { GraphQLJSON } = require('graphql-type-json');


connect('mongodb://localhost/jawabx', { useNewUrlParser: true })
  .then(() => console.log("database connected"))
  .catch(() => console.log("database error"))

set('useCreateIndex', true)

const resolvers = {
  Query,
  Mutation,
  JSON: GraphQLJSON
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    token: req.headers.authorization ? req.headers.authorization.split(" ")[1] : "",
    decoded: checkToken(req.headers.authorization)
  })
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});