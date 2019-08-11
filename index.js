const { ApolloServer } = require('apollo-server');
const typeDefs = require('./GQL-TYPE');
const Query = require('./GQL-QUERY')
const Mutation = require('./GQL-MUTATION');
const { connect } = require('mongoose')

connect('mongodb://localhost/jawabx', { useNewUrlParser: true });

const resolvers = {
  Query,
  Mutation
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    token: req.headers['Authorization'] || "",
    decoded: {
      _id: "5d4f14aa859f3f3a59637b0f"
    }
  })
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});