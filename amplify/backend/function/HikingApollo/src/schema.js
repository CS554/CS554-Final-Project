const { gql } = require('apollo-server-lambda');

const typeDefs = gql`
	type Query {
		listTrails(lat: Float!, long: Float!): [Trail]
		getTrailsById(trailId: [ID]!): [Trail]
		getUser(userId: ID!): User
		listUsersInGroup(groupId: ID!): [User]
	}
	type Mutation {
		addFavorite(userId: ID!, newFavorite: ID!): User
		deleteFavorite(userId: ID!, oldFavorite: ID!): User
		addUserToGroup(groupId: ID!, userId: ID!): User
		addComment(trailId: ID!, username: String!, text: String!): [Comment]
	}
	type Comment {
		id: ID!
		username: String!
		text: String!
	}
	type Group {
		id: ID!
		name: String
		members: [ID]
	}
	type Trail {
		id: ID!
		name: String!
		summary: String
		difficulty: String
		rating: Float!
		num_of_ratings: Int!
		length: Float
		ascent: Int
		descent: Int
		img: String
	}
	type User {
		id: ID!
		name: String
		favorites: [ID]
		groups: [ID]
	}
	enum difficulty {
		Easy
		Medium
		Hard
	}
`;

// const typeDefs = gql`
//   input AddUser {
//     id: ID!
//     name: String
//     lat: Float
//     long: Float
//   }
// type Mutation {
// 	addFavorite(userId: ID!, newFavorite: ID!): Trail
// 	deleteFavorite(user_id: ID!, new_favorite: ID!): Trail
// 	addUserToGroup(group_id: ID!, user_id: ID!): [User]
//   addComment(trail_id: ID!, username: string): [Comment]
// }
// `;

module.exports = { typeDefs };
