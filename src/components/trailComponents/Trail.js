import React, { useState, useEffect } from 'react';
import { Paper, Box, Grid } from '@material-ui/core';
import '../../App.css';
import Comments from './Comments';
import TrailData from './TrailData';
import TrailHeader from './TrailHeader';
import { useQuery, gql } from '@apollo/react-hooks';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import Loader from 'react-loader-spinner';

function Trail(props) {
	const [trailData, setTrailData] = useState([]);
	const [noTrailError, setNoTrailError] = useState(false);

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
				conditionStatus
				conditionDetails
				conditionDate
				comments {
					username
					text
				}
			}
		}
	`;

	const { isloading, error, data } = useQuery(query, {
		variables: {
			trailID: props.match.params.id
		}
	});

	useEffect(() => {
		async function getTrail() {
			if (data) {
				if (data.getTrailsById) {
					setTrailData(Object.values(data)[0][0]);
				} else {
					console.log("This trail doesn't exist");
					setNoTrailError(true);
				}
			}
		}
		getTrail();
	}, [data]);

	if (error) {
		return <div>Error</div>;
	}

	if (noTrailError) {
		return <h1>ERROR 404: This Trail does not exist</h1>;
	}

	if (isloading || !trailData.name) {
		return (
			<Grid container>
				<Loader type="Grid" color="#00BFFF" height={80} width={80} />
			</Grid>
		);
	}

	return (
		<div>
			<TrailHeader
				name={trailData.name}
				trailId={props.match.params.id}
			/>

			<Grid container spacing={1}>
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
				<Grid item xs={4}>
					<Box
						maxWidth="sm"
						height="500px"
						style={{
							backgroundImage: `url(${trailData.img})`
						}}
					>
						<Box m={2} pt={3}>
							<Paper elevation={3}>
								<h2>{trailData.summary}</h2>
							</Paper>
						</Box>
					</Box>
				</Grid>
				<Grid item xs={5}>
					<Comments
						trailId={props.match.params.id}
						comments={trailData.comments}
					/>
				</Grid>
			</Grid>
		</div>
	);
}

export default Trail;
