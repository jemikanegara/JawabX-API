require('dotenv').config()
const { ApolloServer } = require('apollo-server');
const typeDefs = require('./GQL-TYPE');
const Query = require('./GQL-QUERY')
const Mutation = require('./GQL-MUTATION');
const { connect } = require('mongoose')
const { checkToken } = require('./FUNCTIONS/tokenFunction')

connect('mongodb://localhost/jawabx', { useNewUrlParser: true }).then(() => {
  console.log("server connected")
}).catch(err => console.log(err))

const resolvers = {
  Query,
  Mutation
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