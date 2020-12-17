import React, { useState, useRef, useEffect } from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import osm from './osm-providers';
import useGeoLocation from '../hooks/useGeoLocation';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { makeStyles } from '@material-ui/core/styles';
import {
	Card,
	CardActionArea,
	CardActions,
	CardContent,
	CardMedia,
	Button,
	Typography,
	Grid
} from '@material-ui/core';

import { Link } from 'react-router-dom';
import altIcon from '../images/trail_marker_3.png';
import altTrailImage from '../images/temp_trail_image.jpeg';
import { useQuery, gql } from '@apollo/react-hooks';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import Loader from 'react-loader-spinner';
import uuid from 'react-uuid';

let DefaultIcon = L.icon({
	iconUrl: icon,
	shadowUrl: iconShadow
});

let AltIcon = L.icon({
	iconUrl: altIcon,
	iconSize: [40, 40]
});

const style = {
	position: 'fixed',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)'
};
L.Marker.prototype.options.icon = DefaultIcon;

const useStyles = makeStyles({
	root: {
		flexGrow: 1,
		minWidth: 200,
		maxWidth: 500,
		maxHeight: 300
	},
	media: {
		height: 140
	}
});

const query2 = gql`
	query trails($lat: Float!, $long: Float!) {
		listTrails(lat: $lat, long: $long) {
			id
			summary
			name
			img
			lat
			long
		}
	}
`;

const Home = (props) => {
	let inputLat;
	let inputLong;
	let trailMarkers;
	const [center, setCenter] = useState({ lat: 0.0, lng: 0.0 });
	const { isloading, error, data, refetch } = useQuery(query2, {
		variables: { lat: center.lat, long: center.lng }
	});
	const location = useGeoLocation();
	let cards = [];

	const ZOOM_LEVEL = 9;
	const mapRef = useRef();
	const classes = useStyles();

	useEffect(() => {
		console.log('on load useeffect');
	}, [center]);

	if (isloading || !location.loaded) {
		return (
			<div style={style}>
				<Loader
					className="Loader"
					type="Grid"
					color="#00BFFF"
					height={150}
					width={150}
				/>
			</div>
		);
	}

	if (error) {
		return <div>Unexpected Error: {error}</div>;
	}

	if (data?.listTrails) {
		let newCards = data.listTrails.map((trail) => {
			if (trail.img === '') {
				trail.img = altTrailImage;
			}
			return (
				<Grid item xs={12} sm={6} md={4} key={trail.id}>
					<Card className={classes.root} key={trail.id}>
						<CardActionArea>
							<Link to={`/trails/${trail.id}`}>
								<CardMedia
									className={classes.media}
									image={trail.img}
									title={trail.name}
									alt="trail card"
								/>
							</Link>
							<CardContent>
								<Typography
									gutterBottom
									variant="h5"
									component="h2"
								>
									{trail.name}
								</Typography>
								<Typography
									variant="body2"
									color="textSecondary"
									component="p"
								>
									{trail.summary}
								</Typography>
							</CardContent>
						</CardActionArea>
						<CardActions>
							<Button size="small" color="primary">
								Share
							</Button>
							<Button size="small" color="primary">
								Learn More
							</Button>
						</CardActions>
					</Card>
				</Grid>
			);
		});
		trailMarkers = data.listTrails.map((trail) => {
			return (
				<Marker
					key={uuid()}
					icon={AltIcon}
					position={[trail.lat, trail.long]}
				>
					<Popup>{trail.name}</Popup>
				</Marker>
			);
		});
		console.log(trailMarkers);
		console.log(newCards);
		cards = newCards;
	}

	// console.log(location);
	const showMyLocation = () => {
		console.log(location);
		const { current = {} } = mapRef;
		const { leafletElement: map } = current;

		if (location.loaded && !location.error) {
			map.flyTo(
				[location.coordinates.lat, location.coordinates.lng],
				ZOOM_LEVEL,
				{
					animate: true,
					duration: 0.5
				}
			);
			console.log({
				lat: location.coordinates.lat,
				lng: location.coordinates.lng
			});

			setCenter({
				lat: location.coordinates.lat,
				lng: location.coordinates.lng
			});

			setCenter((center) => {
				console.log(center);
				return center;
			});
		} else {
			alert('loading location...');
		}
	};

	return (
		<>
			<div className="row">
				<div className="col text-center">
					<h2>Find your Location</h2>
					<p>Find Hiking trails near you!</p>
					<div className="col">
						<Map ref={mapRef} center={center} zoom={ZOOM_LEVEL}>
							<TileLayer
								url={osm.maptiler.url}
								attribution={osm.maptiler.attribution}
							/>

							{location.loaded && !location.error && (
								<>
									<Marker
										icon={DefaultIcon}
										position={[center.lat, center.lng]}
									>
										<Popup>You are here!</Popup>
									</Marker>
									{trailMarkers}
								</>
							)}
						</Map>
					</div>
				</div>
			</div>
			<div className="row my-4">
				<div className="coordInputs">
					<form
						className="form"
						id="find-location"
						onSubmit={(e) => {
							e.preventDefault();
							setCenter({
								lat: parseFloat(inputLat.value),
								lng: parseFloat(inputLong.value)
							});
							setCenter((center) => {
								console.log(center);
								return center;
							});
							refetch();
							inputLat.value = '';
							inputLong.value = '';
						}}
					>
						<label htmlFor="inputLat">Latitude</label>
						<input
							type="text"
							id="inputLat"
							name="inputLat"
							placeholder="Latitude"
							ref={(node) => {
								inputLat = node;
							}}
							required
							autoFocus={true}
						></input>

						<label htmlFor="inputLong">Longitude</label>
						<input
							type="text"
							id="inputLong"
							name="inputLong"
							placeholder="Longitude"
							ref={(node) => {
								inputLong = node;
							}}
							required
							autoFocus={true}
						></input>
						<Button color="alternate">
							<input type="submit" value="Submit" />
						</Button>
					</form>
					<div className="col d-flex justify-content-center">
						<Button
							color="primary"
							variant="contained"
							onClick={showMyLocation}
							disabled={!location.loaded}
						>
							{' '}
							Locate Me
						</Button>
					</div>
				</div>
			</div>
			<Grid container>{cards}</Grid>
		</>
	);
};
export default Home;
