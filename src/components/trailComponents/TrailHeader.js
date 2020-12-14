import React, { useState, useEffect } from 'react';
import { Button, Paper, Box, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
//import CircularProgress from '@material-ui/core/CircularProgress';
import '../../App.css';
import firebase from 'firebase';

function TrailHeader(props) {
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
				{props.name}
				<Button size="small" color="primary">
					<FavoriteBorderIcon />
				</Button>

				<Button size="small" color="primary">
					Share
				</Button>
			</h1>
		</div>
	);
}

export default TrailHeader;
