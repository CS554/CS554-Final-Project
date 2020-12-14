const { ApolloServer, ApolloError } = require('apollo-server-lambda');
//const { ApolloServer, gql } = require('apollo-server');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

/* Construct a schema, using GraphQL schema language */
const { typeDefs } = require('./schema');
const faunadb = require('faunadb');

// FQL functions
const {
	Ref,
	Paginate,
	Replace,
	Get,
	Match,
	Select,
	Index,
	Create,
	Collection,
	Join,
	Call,
	Update,
	Lambda,
	Var,
	Map,
	Function: Fn
} = faunadb.query;

/* Provide resolver functions for your schema fields */
const resolvers = {
	Query: {
		listTrails: async (_, args) => {
			return await getTrails(args.lat, args.long);
		},
		getTrailsById: async (_, args) => await getTrailsById(args.trailId),
		getUser: async (_, args) => await getUser(args.userId),
		listUsersInGroup: async (_, args) => {
			return await listUsersInGroup(args.groupId);
		},
		getGroup: async (_, args) => {
			return await getGroup(args.groupId);
		}
	},
	Mutation: {
		addFavorite: async (_, args) => {
			return await addFavorite(args.userId, args.newFavorite);
		},
		deleteFavorite: async (_, args) => {
			return await deleteFavorite(args.userId, args.newFavorite);
		},
		addUserToGroup: async (_, args) => {
			return await addUserToGroup(args.groupId, args.userId);
		},
		addComment: async (_, args) => {
			return await addComment(args.trailId, args.username, args.text);
		},
		createUser: async (_, args) => {
			return await createUser(args.id, args.name);
		},
		createGroup: async (_, args) => {
			return await createGroup(args.id, args.name, args.members);
		}
	}
};

const getGroup = async (groupId) => {
	const client = new faunadb.Client({ secret: process.env.FAUNA_API_KEY });
	// get a ref to the user
	const { data } = await client.query(
		Get(Match(Index('group_by_id'), groupId))
	);
	return data;
};

const createGroup = async (id, name, members = []) => {
	const client = new faunadb.Client({ secret: process.env.FAUNA_API_KEY });
	const response = await client.query(
		Create(Collection('groups'), {
			data: {
				id: id,
				name: name,
				members: members
			}
		})
	);
	return response.data;
};

const createUser = async (id, name) => {
	const client = new faunadb.Client({ secret: process.env.FAUNA_API_KEY });

	const response = await client.query(
		Create(Collection('users'), {
			data: {
				id: id,
				name: name,
				favorites: [],
				groups: []
			}
		})
	);
	return response.data;
};

const addFavorite = async (userId, newFavorite) => {
	const client = new faunadb.Client({ secret: process.env.FAUNA_API_KEY });

	// get a ref to the user
	const { data, ref } = await client.query(
		Get(Match(Index('user_by_id'), userId))
	);

	const response = await client.query(
		Update(ref, {
			data: {
				favorites: [...data.favorites, newFavorite]
			}
		})
	);

	return response.data;
};

const deleteFavorite = async (userId, oldFavorite) => {
	// Not working right now
	const client = new faunadb.Client({ secret: process.env.FAUNA_API_KEY });

	// get a ref to the user
	const { data, ref } = await client.query(
		Get(Match(Index('user_by_id'), userId))
	);

	let favArray = data.favorites;

	for (let i = favArray.length - 1; i >= 0; i--) {
		if (favArray[i] === oldFavorite) {
			favArray.splice(i, 1);
		}
	}

	const response = await client.query(
		Replace(ref, {
			data: {
				id: data.id,
				name: data.name,
				favorites: [...favArray],
				groups: data.groups
			}
		})
	);

	return response.data;
};

const addUserToGroup = async (groupId, userId) => {
	const client = new faunadb.Client({
		secret: process.env.FAUNA_API_KEY
	});

	// get a ref to the user
	const userDoc = await client.query(Get(Match(Index('user_by_id'), userId)));

	// get a ref to the group
	const groupDoc = await client.query(
		Get(Match(Index('group_by_id'), groupId))
	);

	// check if we're in the group already
	if (groupDoc.data.members.contains(userId)) {
		throw new ApolloError('User is already in group', '400');
	}

	// update user
	const userResponse = await client.query(
		Update(userDoc.ref, {
			data: {
				groups: [...userDoc.data.groups, groupId]
			}
		})
	);

	// update group
	const groupResponse = await client.query(
		Update(groupDoc.ref, {
			data: {
				members: [...groupDoc.data.members, userId]
			}
		})
	);

	return userResponse.data;
};

const addComment = async (trailId, username, text) => {
	const client = new faunadb.Client({
		secret: process.env.FAUNA_API_KEY
	});

	const commentId = uuidv4();

	// Create comment
	const response = await client.query(
		Create(Collection('comments'), {
			data: {
				id: commentId,
				trailId: trailId,
				username: username,
				text: text
			}
		})
	);

	return response.data;
};

const listUsersInGroup = async (groupId) => {
	const client = new faunadb.Client({ secret: process.env.FAUNA_API_KEY });

	const doc = await client.query(
		Get(Match(Index('users_in_group'), groupId))
	);

	const userIds = doc.data.members;

	const response = [];

	for (let index = 0; index < userIds.length; index++) {
		const userId = userIds[index];
		const x = await client.query(Get(Match(Index('user_by_id'), userId)));
		response.push(x.data);
	}

	return response;
};

const getTrailsById = async (trailIdArray) => {
	const client = new faunadb.Client({ secret: process.env.FAUNA_API_KEY });
	const API_URL = 'https://www.hikingproject.com/data/get-trails-by-id';

	try {
		const { data } = await axios.get(API_URL, {
			params: {
				key: process.env.HIKING_APP_API_KEY,
				ids: trailIdArray.join()
			}
		});

		let trailResponsePromises = data.trails.map(async (trail) => {
			const commentArray = await getComments(trail.id.toString(), client);

			return {
				id: trail.id,
				name: trail.name,
				summary: trail.summary,
				difficulty: trail.difficulty,
				rating: trail.stars,
				num_of_ratings: trail.starVotes,
				length: trail.length,
				ascent: trail.ascent,
				descent: trail.descent,
				img: trail.imgMedium,
				comments: commentArray
			};
		});

		const trailResponse = Promise.all(trailResponsePromises);
		return trailResponse;
	} catch (e) {
		console.log(e);
	}
};

const getUser = async (userId) => {
	const client = new faunadb.Client({ secret: process.env.FAUNA_API_KEY });

	const doc = await client.query(Get(Match(Index('user_by_id'), userId)));

	const data = doc.data;

	let response = {
		id: data.id,
		name: data.name,
		favorites: data.favorites,
		groups: data.groups
	};

	return response;
};

const getTrails = async (lat, long) => {
	const client = new faunadb.Client({ secret: process.env.FAUNA_API_KEY });

	const API_URL = 'https://www.hikingproject.com/data/get-trails';

	try {
		const { data } = await axios.get(API_URL, {
			params: {
				key: process.env.HIKING_APP_API_KEY,
				lat: lat,
				lon: long
			}
		});

		let trailResponsePromises = data.trails.map(async (trail) => {
			const commentArray = await getComments(trail.id.toString(), client);

			return {
				id: trail.id,
				name: trail.name,
				summary: trail.summary,
				difficulty: trail.difficulty,
				rating: trail.stars,
				num_of_ratings: trail.starVotes,
				length: trail.length,
				ascent: trail.ascent,
				descent: trail.descent,
				img: trail.imgMedium,
				comments: commentArray
			};
		});

		const trailResponse = Promise.all(trailResponsePromises);
		return trailResponse;
	} catch (e) {
		console.log(e);
	}
};

const getComments = async (id, client) => {
	const { data } = await client.query(
		Map(
			Paginate(Match(Index('get_comments_by_trailId'), id)),
			Lambda('X', Get(Var('X')))
		)
	);

	let commentArray = null;

	if (data) {
		commentArray = data.map((entry) => {
			return entry.data;
		});
	}

	return commentArray;
};

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
});
