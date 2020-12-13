import React, { useState, useEffect } from 'react';
import {
	Paper,
	List,
	ListItem,
	ListItemText,
	ListItemAvatar,
	Avatar,
	Divider
} from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import { makeStyles } from '@material-ui/core/styles';
import CallMadeIcon from '@material-ui/icons/CallMade';
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
import WbSunnyIcon from '@material-ui/icons/WbSunny';
import '../App.css';

function TrailData(props) {
	const useStyles = makeStyles((theme) => ({
		root: {
			width: '100%',
			maxWidth: 360
		}
	}));

	const classes = useStyles();

	return (
		<div>
			<Paper elevation={3}>
				<List className={classes.root}>
					<ListItem>
						<ListItemAvatar />
						<Rating defaultValue={props.rating} precision={0.5} />
						<br />
						<ListItemText
							secondary={`${props.num_of_ratings} ratings`}
						/>
					</ListItem>
					<Divider variant="inset" component="li" />
					<ListItem>
						<ListItemAvatar />
						<ListItemText
							primary={props.difficulty}
							secondary="Difficulty"
						/>
					</ListItem>
					<Divider variant="inset" component="li" />
					<ListItem>
						<ListItemAvatar>
							<Avatar>
								<DirectionsRunIcon />
							</Avatar>
						</ListItemAvatar>
						<ListItemText
							primary={`${props.length} miles`}
							secondary="Total Distance"
						/>
					</ListItem>
					<Divider variant="inset" component="li" />
					<ListItem>
						<ListItemAvatar>
							<Avatar>
								<CallMadeIcon />
							</Avatar>
						</ListItemAvatar>
						<ListItemText
							primary={`${props.ascent} ft`}
							secondary="Distance to Ascent"
						/>
					</ListItem>
					<Divider variant="inset" component="li" />
					<ListItem>
						<ListItemAvatar>
							<Avatar>
								<WbSunnyIcon />
							</Avatar>
						</ListItemAvatar>
						<ListItemText
							primary={`${props.conditionStatus} and ${props.conditionDetails}`}
							secondary={`Current Conditions as of ${props.conditionDate}`}
						/>
					</ListItem>
				</List>
			</Paper>
		</div>
	);
}

export default TrailData;
