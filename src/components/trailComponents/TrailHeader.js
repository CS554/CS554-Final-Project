import React, { useState, useEffect } from 'react';
import { Button, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
//import CircularProgress from '@material-ui/core/CircularProgress';
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

	const { isloading, error, data, refetch } = useQuery(FAVORITES_QUERY, {
		variables: {
			userId: firebase.auth().currentUser.uid
		}
	});

	useEffect(() => {
		console.log('TrailHeader useEffect has been called');

		if (data) {
			setFavorite(data.getUser.favorites.includes(props.trailId));
		}

		console.log(isFavorite);
	}, [data]);

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
		console.log('toggle');
	};

	const useStyles = makeStyles((theme) => ({
		root: {
			width: '100%',
			maxWidth: 360
		}
	}));

	const classes = useStyles();

	return (
		<div>
			<br />
			<Grid container spacing={0}>
				<Grid item xs={6}>
					<h1>{props.name}</h1>
				</Grid>
				<Grid item xs={3}>
					<form onSubmit={handleSubmit}>
						<Button color="primary" type="submit">
							{!isFavorite && <FavoriteBorderIcon />}
							{isFavorite && <FavoriteIcon />}
						</Button>
					</form>
				</Grid>
				<Grid item xs={3}>
					<Button size="small" color="primary">
						Share
					</Button>
				</Grid>
			</Grid>
		</div>
	);
}

export default TrailHeader;
