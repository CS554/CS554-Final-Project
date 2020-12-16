const { gql } = require('apollo-server-lambda');

const typeDefs = gql`
	type Query {
		listTrails(lat: Float!, long: Float!): [Trail]
		getTrailsById(trailId: [ID]!): [Trail]
		getUser(userId: ID!): User
		listUsersInGroup(groupId: ID!): [User]
		getGroup(groupId: ID!): Group
	}
	type Mutation {
		addFavorite(userId: ID!, newFavorite: ID!): User
		deleteFavorite(userId: ID!, oldFavorite: ID!): User # FIX
		addUserToGroup(groupId: ID!, userId: ID!): User
		# removeuserfromgroup
		addComment(trailId: ID!, username: String!, text: String!): Comment
		createUser(id: ID!, name: String!): User
		createGroup(id: ID!, name: String!, members: [ID]): Group
		# delete group
	}
	type Comment {
		id: ID!
		trailId: ID!
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
		comments: [Comment]
		lat: Float
		long: Float
		conditionStatus: String
		conditionDetails: String
		conditionDate: String
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
