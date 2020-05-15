const { ApolloServer } = require('apollo-server');
const typeDefs = require('./graphql-schema');
const resolvers = require('./resolvers');

// create server
const server = new ApolloServer({ typeDefs, resolvers, context: ({ req }) => {

  // Get the user token from the headers.
  const token = req.headers.authorization || '';

  if (token == 'editing' ) {
    return {editing: true}
  }
},});

// launch server.
server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});