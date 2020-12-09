const { typeDefs } = require('./schema');
const { trails } = require('./mock/mockTrails');
const { ApolloServer, gql } = require('apollo-server-lambda');

/* Provide resolver functions for your schema fields */
const resolvers = {
  Query: {
    hello: () => 'Hello from Apollo!!',
    listTrails: () => listTrails(),
  },
};

const listTrails = () => {
  // map trails to response
  return trails.map((val) => {
    return {
      trailID: val.id,
      name: val.name,
      summary: val.summary,
      difficulty: val.difficulty,
      rating: val.stars,
      num_of_ratings: val.starVotes,
      length: val.length,
      ascent: val.ascent,
      descent: val.descent,
    };
  });
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ event, context }) => ({
    headers: event.headers,
    functionName: context.functionName,
    event,
    context,
  }),
});

exports.handler = server.createHandler({
  cors: {
    origin: '*',
    credentials: true,
  },
});
