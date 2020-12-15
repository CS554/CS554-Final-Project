import React from 'react';
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
import StarRateIcon from '@material-ui/icons/StarRate';
import FitnessCenterIcon from '@material-ui/icons/FitnessCenter';
import '../../App.css';

function TrailData(props) {
	const [value, setValue] = React.useState(2);

	const useStyles = makeStyles((theme) => ({
		root: {
			width: '100%',
			maxWidth: 360
		}
	}));

	const classes = useStyles();

	const difficulty = {
		green: 'Easy',
		blue: 'Intermediate',
		blueBlack: 'Hard',
		black: 'Very Hard'
	};

	return (
		<div>
			<Paper elevation={3}>
				<List className={classes.root}>
					<ListItem>
						<ListItemAvatar>
							<Avatar>
								<StarRateIcon />
							</Avatar>
						</ListItemAvatar>

						<Rating
							name="simple-controlled"
							value={props.rating}
							// onChange={(event, newValue) => {
							// 	setValue(newValue);
							// }}
						/>
						<br />
						<ListItemText
							secondary={`${props.num_of_ratings} ratings`}
						/>
					</ListItem>
					<Divider variant="inset" component="li" />
					<ListItem>
						<ListItemAvatar>
							<Avatar>
								<FitnessCenterIcon />
							</Avatar>
						</ListItemAvatar>
						<ListItemText
							primary={difficulty[props.difficulty]}
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
					{props.conditionStatus !== 'Unknown' && (
						<div>
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
						</div>
					)}
				</List>
			</Paper>
		</div>
	);
}

export default TrailData;
