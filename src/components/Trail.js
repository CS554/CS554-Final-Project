import React, { useState, useEffect } from 'react';
import { Box, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import '../App.css';
import Comments from './Comments';
import TrailData from './TrailData';

function Trail(props) {
	console.log(props.match.params.id);

	const [trailData, setTrailData] = useState([]);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function getTrail() {
			let trail = {
				id: 7011192,
				name: 'Boulder Skyline Traverse',
				type: 'Recommended Route',
				summary: 'The classic long mountain route in Boulder.',
				difficulty: 'black',
				stars: 4.7,
				starVotes: 93,
				location: 'Superior, Colorado',
				url:
					'https://www.hikingproject.com/trail/7011192/boulder-skyline-traverse',
				imgSqSmall:
					'https://cdn2.apstatic.com/photos/hike/7039883_sqsmall_1555092747.jpg',
				imgSmall:
					'https://cdn2.apstatic.com/photos/hike/7039883_small_1555092747.jpg',
				imgSmallMed:
					'https://cdn2.apstatic.com/photos/hike/7039883_smallMed_1555092747.jpg',
				imgMedium:
					'https://cdn2.apstatic.com/photos/hike/7039883_medium_1555092747.jpg',
				length: 17.3,
				ascent: 5345,
				descent: -5420,
				high: 8433,
				low: 5425,
				longitude: -105.2582,
				latitude: 39.9388,
				conditionStatus: 'All Clear',
				conditionDetails: 'Dry',
				conditionDate: '2020-09-16 14:37:11'
			};
			setTrailData(trail);
			setLoading(false);
		}
		getTrail();
	}, [JSON.stringify(trailData)]);

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
			<h1>
				{trailData.name}
				<FavoriteBorderIcon />
			</h1>
			<Grid container spacing={3}>
				<Grid item xs={3}>
					<TrailData />
				</Grid>
				<Grid item xs={9}>
					<Box
						maxWidth="sm"
						height="500px"
						style={{
							backgroundImage: `url(${trailData.imgMedium})`
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
