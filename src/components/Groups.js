import React, { useContext, useEffect, useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/react-hooks';
import { AuthContext } from '../firebase/Auth';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { Link } from 'react-router-dom';
import ShareModal from './Modal/ShareModal';

import TextField from '@material-ui/core/TextField';

import '../App.css';

function getModalStyle() {
	const top = 50;
	const left = 50;

	return {
		top: `${top}%`,
		left: `${left}%`,
		transform: `translate(-${top}%, -${left}%)`
	};
}

const useStyles = makeStyles((theme) => ({
	paper: {
		position: 'absolute',
		width: 400,
		backgroundColor: theme.palette.background.paper,
		border: '2px solid #000',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3)
	}
}));

const useStyles1 = makeStyles({
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

const getGroup = gql`
	query getGroup {
		getAllGroups {
			id
			name
			members
		}
	}
`;

const addGroup = gql`
	mutation createGroup(
		$name: String!
		$members: [ID]
		$ownerId: ID
		$description: String
	) {
		createGroup(
			name: $name
			members: $members
			ownerId: $ownerId
			description: $description
		) {
			name
			id
			members
			description
			ownerId
		}
	}
`;

const useStyles2 = makeStyles((theme) => ({
	root: {
		width: '100%',
		maxWidth: 360
	}
}));

function Groups(props) {
	const classes = useStyles();
	const classes1 = useStyles1();
	const classes2 = useStyles2();
	const [modalStyle] = React.useState(getModalStyle);
	const [open, setOpen] = React.useState(false);
	const { currentUser } = useContext(AuthContext);
	const userID = currentUser.$b.uid;
	const { isloading, error, data, refetch } = useQuery(getGroup);
	let cards = [];
	const [addGroups] = useMutation(addGroup);
	const [newName, setnewName] = useState('');
	const [newDescription, setnewDescription] = useState('');

	if (data?.getAllGroups) {
		console.log(data?.getAllGroups[0].id);
	}

	const handleSubmit = (event) => {
		event.preventDefault();

		if (/\S/.test(newName)) {
			addGroups({
				variables: {
					name: newName,
					ownerId: userID,
					description: newDescription,
					members: [userID]
				}
			});

			setnewName('');
			setnewDescription('');
			refetch();
		}
	};

	if (data?.getAllGroups) {
		let newCards = data.getAllGroups.map((group) => {
			return (
				<Grid item xs={12} sm={6} md={4} key={group.id}>
					<Card className={classes1.root} key={group.id}>
						<CardActionArea>
							<Link to={`/groups/${group.id}`}>
								<CardMedia
									className={classes1.media}
									title={group.name}
									alt="trail card"
									style={{ backgroundColor: 'red' }}
									image="/imgs/take-a-hike-logo.png"
								/>
							</Link>
							<CardContent>
								<Typography
									gutterBottom
									variant="h5"
									component="h2"
								>
									{group.name}
								</Typography>
							</CardContent>
						</CardActionArea>
						<CardActions>
							<ShareModal trailid={props.trailId} type="group" />
							<Button size="small" color="primary">
								Learn More
							</Button>
						</CardActions>
					</Card>
				</Grid>
			);
		});
		cards = newCards;
	}
	// <label for="gname">Group name:</label>
	// <input type="text" id="gname" name="gname"></input>

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const body = (
		<div style={modalStyle} className={classes.paper}>
			<h2 id="simple-modal-title">Create New Group</h2>
			<p id="simple-modal-description">
				Please Enter a Name to the group
			</p>
			<form
				onSubmit={handleSubmit}
				className={classes2.root}
				noValidate
				autoComplete="off"
			>
				<TextField
					id="standard-basic"
					label="Name your Group"
					value={newName}
					onInput={(e) => setnewName(e.target.value)}
					multiline
					rowsMax={4}
				/>
				<TextField
					id="standard-basic"
					label="Add a Description"
					value={newDescription}
					onInput={(e) => setnewDescription(e.target.value)}
					multiline
					rowsMax={4}
				/>
				<br />
				<Button
					type="submit"
					value="Submit"
					size="small"
					color="primary"
				>
					Submit
				</Button>
				<Button
					type="submit"
					value="Submit"
					size="small"
					color="primary"
					onClick={handleClose}
				>
					Go Back
				</Button>
			</form>
		</div>
	);

	return (
		<div>
			<h2>Page for users groups</h2>
			<div className="chran">
				<button type="button" onClick={handleOpen}>
					Create New Group
				</button>
				<Modal
					open={open}
					onClose={handleClose}
					aria-labelledby="simple-modal-title"
					aria-describedby="simple-modal-description"
				>
					{body}
				</Modal>
			</div>
			<Grid container>{cards}</Grid>
		</div>
	);
}

export default Groups;
