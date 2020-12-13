import React, { useState, useEffect } from 'react';
import { Box, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
//import CircularProgress from '@material-ui/core/CircularProgress';
import '../App.css';
import Comments from './Comments';
import TrailData from './TrailData';
import { useQuery, gql } from '@apollo/react-hooks';

function Trail(props) {
	const [trailData, setTrailData] = useState([]);

	const query = gql`
		query getTrail($trailID: [ID]!) {
			getTrailsById(trailId: $trailID) {
				name
				summary
				img
				length
				rating
				num_of_ratings
				difficulty
				ascent
			}
		}
	`;

	/* TODO need to add 
					conditionStatus
				conditionDetails
				conditionDate

	to query */

	const { isloading, error, data, refetch } = useQuery(query, {
		variables: {
			trailID: props.match.params.id
		}
	});

	useEffect(() => {
		async function getTrail() {
			if (data) {
				setTrailData(Object.values(data)[0][0]);
			}
		}
		getTrail();
	}, [data]);

	const useStyles = makeStyles((theme) => ({
		root: {
			width: '100%',
			maxWidth: 360
		}
	}));

	const classes = useStyles();

	console.log(error);

	return (
		<div>
			<br />
			<h1>
				{trailData.name}
				<FavoriteBorderIcon />
			</h1>
			<Grid container spacing={3}>
				<Grid item xs={3}>
					<TrailData
						length={trailData.length}
						rating={trailData.rating}
						num_of_ratings={trailData.num_of_ratings}
						difficulty={trailData.difficulty}
						ascent={trailData.ascent}
						conditionStatus={trailData.conditionStatus}
						conditionDetails={trailData.conditionDetails}
						conditionDate={trailData.conditionDate}
					/>
				</Grid>
				<Grid item xs={9}>
					<Box
						maxWidth="sm"
						height="500px"
						style={{
							backgroundImage: `url(${trailData.img})`
						}}
					>
						<br />
						<Comments />
					</Box>
				</Grid>
			</Grid>
		</div>
	);
}

export default Trail;
