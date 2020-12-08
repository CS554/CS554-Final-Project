const { gql } = require('apollo-server-lambda');

export const typeDefs = gql`
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
