//const { ApolloServer } = require('apollo-server-lambda');
const { ApolloServer, gql } = require('apollo-server');
const axios = require('axios');
require('dotenv').config();

/* Construct a schema, using GraphQL schema language */
//const typeDefs = require('./schema');
const typeDefs = gql`
	input AddUser {
		id: ID!
		name: String
		lat: Float
		long: Float
	}
	type Group {
		groupID: ID!
		name: String
		members: [User]
	}
	type Mutation {
		addFavorite(user_id: ID!, new_favorite: ID!): Trail
		deleteFavorite(user_id: ID!, new_favorite: ID!): Trail
		addUserToGroup(group_id: ID!, user_id: ID!): [User]
	}
	type Query {
		listTrails(lat: Float!, long: Float!): [Trail]
		listTrail(trail_id: ID!): Trail
		listUsersInGroup(group_id: ID!): [User]
		updateUserLocation(user_id: ID!, lat: Float!, long: Float!): User
		hello: String
	}
	type Trail {
		trailID: ID!
		name: String!
		summary: String
		difficulty: String
		rating: Float!
		num_of_ratings: Int!
		length: Float
		ascent: Int
		descent: Int
	}
	type User {
		id: ID!
		name: String
		lat: Float
		long: Float
		favorites: [Trail]
		groups: [Group]
	}
	enum difficulty {
		Easy
		Medium
		Hard
	}
`;

/* Provide resolver functions for your schema fields */
const resolvers = {
	Query: {
		hello: () => 'Hello from Apollo!!',

		listTrails: (_, args) => {
			const API_URL = 'https://www.hikingproject.com/data/get-trails';

			async function getTrails(lat, long) {
				let trailResponse = [];

				try {
					const { data } = await axios.get(API_URL, {
						params: {
							key: process.env.HIKING_APP_API_KEY,
							lat: lat,
							lon: long
						}
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
							descent: trail.descent
						});
					});

					console.log(trailResponse);
					return trailResponse;
				} catch (e) {
					console.log(e);
				}
			}
			return getTrails('40.783058', '-73.971252'); // TODO add arguements
		}
	}
};

/*
const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: ({ event, context }) => ({
		headers: event.headers,
		functionName: context.functionName,
		event,
		context
	})
});


exports.handler = server.createHandler({
	cors: {
		origin: '*',
		credentials: true
	}
});*/

//Delete when deployed to dev
const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
	console.log(`🚀  Server ready at ${url} 🚀`);
});
