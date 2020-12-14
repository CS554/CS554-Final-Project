import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Container, Chip, Paper } from '@material-ui/core';
import { gql, useMutation } from '@apollo/react-hooks';
const firebase = require('firebase');

function Comments(props) {
	const COMMENT_MUTATION = gql`
		mutation addComment($trailId: ID!, $username: String!, $text: String!) {
			addComment(trailId: $trailId, username: $username, text: $text) {
				username
				text
			}
		}
	`;

	const [commentData, setCommentData] = useState(props.comments);
	const [newComment, setNewComment] = useState('');
	//const [error, setError] = useState(false);
	const [loading, setLoading] = useState(true);
	const [addComment, { data }] = useMutation(COMMENT_MUTATION);

	const useStyles = makeStyles((theme) => ({
		root: {
			width: '100%',
			maxWidth: 360
		}
	}));

	const handleSubmit = (event) => {
		event.preventDefault();

		const { isloading, error, new_data, refetch } = addComment({
			variables: {
				trailId: props.trailId,
				username: firebase.auth().currentUser.displayName,
				text: newComment
			}
		});

		setNewComment('');

		// TODO: create hook to update commentData with new comment added
	};

	const classes = useStyles();

	return (
		<div>
			{props.comments &&
				props.comments.map(function ({ username, text }) {
					return (
						<Container maxWidth="sm">
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
						onSubmit={handleSubmit}
						className={classes.root}
						noValidate
						autoComplete="off"
					>
						<TextField
							id="standard-basic"
							label="Add a Comment"
							value={newComment}
							onInput={(e) => setNewComment(e.target.value)}
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
					</form>
				</Paper>
			</Container>
		</div>
	);
}

export default Comments;
