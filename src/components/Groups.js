import React, { useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/react-hooks';
import { AuthContext } from '../firebase/Auth';
import {
	Modal,
	Card,
	CardActionArea,
	CardActions,
	CardContent,
	CardMedia,
	Button,
	Typography,
	Grid
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { Link } from 'react-router-dom';
import ShareModal from './Modal/ShareModal';
import Loader from 'react-loader-spinner';

import TextField from '@material-ui/core/TextField';

import '../App.css';

const style = {
	position: 'fixed',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	fontWeight: 'bold',
	fontSize: '50px'
};

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
	const [load, setLoad] = useState(true);

	useEffect(() => {
		if (load) {
			setTimeout(refetch, 50);
			setLoad(false);
		}
	}, [load, refetch]);

	if (error) {
		return <h2>Error 404: Page Not Found</h2>;
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
			setTimeout(refetch, 1000);
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
									alt="group card"
									style={{
										backgroundColor:
											'#' +
											Math.floor(
												Math.random() * 16777215
											).toString(16)
									}}
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
							<ShareModal id={props.trailId} type="group" />
						</CardActions>
					</Card>
				</Grid>
			);
		});
		cards = newCards;
	}
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
	if (isloading || !data) {
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
	} else {
		return (
			<div>
				<Grid
					container
					spacing={0}
					padding={1}
					direction="column"
					alignItems="center"
					justify="center"
					style={{ padding: 20 }}
				>
					<Grid item xs={12}>
						<button
							class="buttons"
							type="button"
							onClick={handleOpen}
						>
							Create New Group
						</button>
					</Grid>
				</Grid>
				<Modal
					open={open}
					onClose={handleClose}
					aria-labelledby="simple-modal-title"
					aria-describedby="simple-modal-description"
				>
					{body}
				</Modal>
				<Grid container spacing={2}>
					{cards}
				</Grid>
			</div>
		);
	}
}
export default Groups;
