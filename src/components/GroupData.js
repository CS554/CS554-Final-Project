import React, { useContext, useEffect, useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/react-hooks';
import { AuthContext } from '../firebase/Auth';
import Loader from 'react-loader-spinner';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import { Card, Container } from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { useHistory } from 'react-router-dom';

import '../App.css';

const style = {
	position: 'fixed',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	fontWeight: 'bold',
	fontSize: '50px'
};

const style1 = {
	background: '#0d3482',
	borderRadius: 12,
	border: '2px solid #2E3B55',
	color: 'white',
	padding: '14 40px',
	fontSize: '24px',
	boxShadow: '0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19)'
};
const useStyles2 = makeStyles((theme) => ({
	root: {
		width: '100%',
		maxWidth: 360
	}
}));
const getGroup = gql`
	query getGroup($id: ID!) {
		getGroup(id: $id) {
			id
			name
			description
			members
			ownerId
		}
	}
`;

const addGroup = gql`
	mutation addToGroup($groupId: ID!, $userId: ID!) {
		addUserToGroup(groupId: $groupId, userId: $userId) {
			id
			name
			favorites
			groups
		}
	}
`;

const removeGroup = gql`
	mutation removeUserFromGroup($groupId: ID!, $userId: ID!) {
		removeUserFromGroup(groupId: $groupId, userId: $userId) {
			id
			name
			favorites
			groups
		}
	}
`;

const allUsers = gql`
	query listUserInGroup($groupId: ID!) {
		listUsersInGroup(groupId: $groupId) {
			id
			name
		}
	}
`;

const deleteGroup = gql`
	mutation deleteGroup($groupId: ID!) {
		deleteGroup(groupId: $groupId) {
			name
			id
			ownerId
		}
	}
`;

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

function Groups(props) {
	const { isloading, error, data, refetch } = useQuery(getGroup, {
		variables: { id: props.match.params.id }
	});
	const { data: userData, refetch: userRefetch } = useQuery(allUsers, {
		variables: { groupId: props.match.params.id }
	});
	const { currentUser } = useContext(AuthContext);
	const userID = currentUser.$b.uid;
	const groupData = data?.getGroup;
	const classes2 = useStyles2();
	const classes1 = useStyles1();
	const [addToGroups] = useMutation(addGroup);
	const [removeFromGroups] = useMutation(removeGroup);
	let cards = [];
	const [newAdd, setAdd] = useState(false);
	const [newRemove, setRemove] = useState(false);
	const [deleteGroups] = useMutation(deleteGroup);
	let history = useHistory();

	useEffect(() => {
		async function fetchData(){
		if (groupData?.members.indexOf(userID) < 0) {
			setAdd(true);
			setRemove(false);
		} else {
			setAdd(false);
			setRemove(true);
		}
	}fetchData();
}, [userID, groupData?.members,data, userData]);

	if (error) {
		return <h2>Error 404: Page Not Found</h2>;
	}

	// if (noGroupError) {
	//   return <h1>ERROR 404: This Group does not exist</h1>;

	if (userData?.listUsersInGroup) {
		let newUser = userData.listUsersInGroup.map((user) => {
			return (
				<Grid item xs={12} sm={6} md={4} key={user.id}>
					<Card className={classes1.root} key={user.id}>
						<CardMedia
							className={classes1.media}
							title={user.name}
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
						<CardContent>
							<Typography
								gutterBottom
								variant="h5"
								component="h2"
							>
								{user.name}
							</Typography>
						</CardContent>
					</Card>
				</Grid>
			);
		});
		cards = newUser;
	}

	const handleSubmit = (event) => {
		event.preventDefault();

		if (/\S/.test(props.match.params.id)) {
			addToGroups({
				variables: {
					groupId: props.match.params.id,
					userId: userID
				}
			});
			setAdd(false);
			setRemove(true);
			setTimeout(userRefetch, 1000);
			setTimeout(refetch, 1000);
		}
	};

	const handleSubmit1 = (event) => {
		event.preventDefault();

		if (/\S/.test(props.match.params.id)) {
			removeFromGroups({
				variables: {
					groupId: props.match.params.id,
					userId: userID
				}
			});
			setAdd(true);
			setRemove(false);
			setTimeout(userRefetch, 1000);
			setTimeout(refetch, 1000);
		}
	};

	const g = () => {
		history.push('/groups');
	};

	const handleSubmit2 = (event) => {
		event.preventDefault();

		if (/\S/.test(props.match.params.id)) {
			deleteGroups({
				variables: {
					groupId: props.match.params.id
				}
			});
			// setAdd(true);
			// setRemove(false);
			// setTimeout(userRefetch, 1000);
			// setTimeout(refetch, 1000);
			setTimeout(g, 1000);
			//history.push('/groups')
		}
	};

	const add = (
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
				<form
					onSubmit={handleSubmit}
					className={classes2.root}
					noValidate
					autoComplete="off"
				>
					<Button
						type="submit"
						value="Submit"
						size="small"
						color="primary"
						variant="outlined"
						style={style1}
					>
						Add to Group
					</Button>
				</form>
			</Grid>
		</Grid>
	);

	const remove = (
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
				<form
					onSubmit={handleSubmit1}
					className={classes2.root}
					noValidate
					autoComplete="off"
				>
					<Button
						type="submit"
						value="Submit"
						size="small"
						color="primary"
						variant="outlined"
						style={style1}
					>
						Remove from Group
					</Button>
				</form>
			</Grid>
		</Grid>
	);

	const del = (
		<div className="buttonClass">
			<form
				onSubmit={handleSubmit2}
				className={classes2.root}
				noValidate
				autoComplete="off"
			>
				<Button
					type="submit"
					value="Submit"
					size="small"
					color="primary"
					variant="outlined"
					style={style1}
					// component={Link} to="/groups"
				>
					Delete Group
				</Button>
			</form>
		</div>
	);

	let desc = '';
	if (groupData && groupData?.description) {
		desc = groupData?.description;
	} else {
		desc = 'You guys need a better leader who puts a description';
	}
	if (isloading || !groupData) {
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
				<h1>{groupData?.name}</h1>
				<h2>{desc} </h2>
				{newAdd && groupData?.members.indexOf(userID) < 0 && add}
				{newRemove && groupData?.members.indexOf(userID) > -1 && remove}
				{groupData?.ownerId === userID && del}
				<Grid container>{cards}</Grid>
			</div>
		);
	}
}

export default Groups;
