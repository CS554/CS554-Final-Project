const { ApolloServer } = require('apollo-server-lambda');
//const { ApolloServer, gql } = require('apollo-server');
const axios = require('axios');
require('dotenv').config();

/* Construct a schema, using GraphQL schema language */
const { typeDefs } = require('./schema');

/* Provide resolver functions for your schema fields */
const resolvers = {
  Query: {
    hello: () => 'Hello from Apollo!!',

    listTrails: (args) => {
      const API_URL = 'https://www.hikingproject.com/data/get-trails';

      async function getTrails(lat, long) {
        let trailResponse = [];

        try {
          const { data } = await axios.get(API_URL, {
            params: {
              key: process.env.HIKING_APP_API_KEY,
              lat: lat,
              lon: long,
            },
          });

          Object.values(data.trails).forEach((trail) => {
            trailResponse.push({
              trailID: trail.id,
              name: trail.name,
              summary: trail.summary,
              difficulty: trail.difficulty,
              rating: trail.stars,
              num_of_ratings: trail.starVotes,
              length: trail.length,
              ascent: trail.ascent,
              descent: trail.descent,
            });
          });

          return trailResponse;
        } catch (e) {
          console.log(e);
        }
      }
      return getTrails(args.lat, args.long);
    },
  },
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
