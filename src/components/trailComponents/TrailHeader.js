import React, { useState, useEffect } from 'react';
import { Button, Box } from '@material-ui/core';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import '../../App.css';
import firebase from 'firebase';
import { useQuery, useMutation, gql } from '@apollo/react-hooks';

function TrailHeader(props) {
	const [isFavorite, setFavorite] = useState(false);

	const FAVORITES_QUERY = gql`
		query queryUser($userId: ID!) {
			getUser(userId: $userId) {
				favorites
			}
		}
	`;

	const ADD_FAVORITE = gql`
		mutation addFav($userId: ID!, $newFavorite: ID!) {
			addFavorite(userId: $userId, newFavorite: $newFavorite) {
				favorites
			}
		}
	`;

	const REMOVE_FAVORITE = gql`
		mutation delFav($userId: ID!, $oldFavorite: ID!) {
			deleteFavorite(userId: $userId, oldFavorite: $oldFavorite) {
				favorites
			}
		}
	`;

	const [addFavorite] = useMutation(ADD_FAVORITE);
	const [delFavorite] = useMutation(REMOVE_FAVORITE);

	const { data } = useQuery(FAVORITES_QUERY, {
		variables: {
			userId: firebase.auth().currentUser.uid
		}
	});

	useEffect(() => {
		if (data) {
			setFavorite(data.getUser.favorites.includes(props.trailId));
		}
	}, [data, props.trailId]);

	const handleSubmit = (event) => {
		event.preventDefault();

		if (!isFavorite) {
			addFavorite({
				variables: {
					newFavorite: props.trailId,
					userId: firebase.auth().currentUser.uid
				}
			});
		} else {
			delFavorite({
				variables: {
					oldFavorite: props.trailId,
					userId: firebase.auth().currentUser.uid
				}
			});
		}

		setFavorite(!isFavorite);
	};

	return (
		<div>
			<br />

			<Box display="flex" flexDirection="row" justifyContent="center">
				<h1>{props.name}</h1>

				<form onSubmit={handleSubmit}>
					<Button color="primary" type="submit">
						{!isFavorite && <FavoriteBorderIcon />}
						{isFavorite && <FavoriteIcon />}
					</Button>
				</form>

				<Button size="small" color="primary">
					Share
				</Button>
			</Box>
		</div>
	);
}

export default TrailHeader;
