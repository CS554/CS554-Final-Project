import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Chip, Paper } from '@material-ui/core';

function Comments(props) {
	const [commentData, setCommentData] = useState([]);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function getComments() {
			const comments = [
				{
					id: 1234234,
					username: 'Will',
					text: 'This hike is awesome'
				},
				{
					id: 12342342,
					username: 'Josh',
					text: 'Comment1'
				},
				{
					id: 969869876,
					username: 'Amr',
					text: 'Comment2'
				},
				{
					id: 68769876,
					username: 'Chran',
					text: 'Comment3'
				},
				{
					id: 4564654754,
					username: 'Glen',
					text: 'Comment 4'
				}
			];
			setCommentData(comments);
			setLoading(false);
		}
		getComments();
	}, [JSON.stringify(commentData)]);

	const useStyles = makeStyles((theme) => ({
		root: {
			width: '100%',
			maxWidth: 360
		}
	}));

	const classes = useStyles();

	return (
		<div>
			{commentData.map(function ({ id, username, text }) {
				return (
					<Container maxWidth="sm" id={id}>
						<Paper elevation={3}>
							<div>
								<Chip label={username} />
								<h3>{text}</h3>
							</div>
						</Paper>
					</Container>
				);
			})}
			<Container maxWidth="sm">
				<Paper>
					<form
						className={classes.root}
						noValidate
						autoComplete="off"
					>
						<TextField
							id="standard-basic"
							label="Add a Comment"
							multiline
							rowsMax={4}
						/>
					</form>
				</Paper>
			</Container>
		</div>
	);
}

export default Comments;
