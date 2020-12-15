import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Container, Chip, Paper } from '@material-ui/core';
import { useQuery, gql, useMutation } from '@apollo/react-hooks';
const firebase = require('firebase');

function Comments(props) {
	const [commentData, setCommentData] = useState([]);
	const [newComment, setNewComment] = useState('');

	const COMMENT_MUTATION = gql`
		mutation addComment($trailId: ID!, $username: String!, $text: String!) {
			addComment(trailId: $trailId, username: $username, text: $text) {
				username
				text
			}
		}
	`;

	const GET_COMMENTS = gql`
		query getTrail($trailID: [ID]!) {
			getTrailsById(trailId: $trailID) {
				comments {
					username
					text
				}
			}
		}
	`;

	//const [error, setError] = useState(false);
	// const [loading, setLoading] = useState(true);
	const [addComment] = useMutation(COMMENT_MUTATION);

	const { isloading, error, data, refetch } = useQuery(GET_COMMENTS, {
		variables: {
			trailID: props.trailId
		}
	});

	const useStyles = makeStyles((theme) => ({
		root: {
			width: '100%',
			maxWidth: 360
		}
	}));

	const handleSubmit = (event) => {
		event.preventDefault();

		const { new_data } = addComment({
			variables: {
				trailId: props.trailId,
				username: firebase.auth().currentUser.displayName,
				text: newComment
			}
		});

		setCommentData(
			commentData.push({
				username: firebase.auth().currentUser.displayName,
				text: newComment,
				__typename: 'Comment'
			})
		);

		setNewComment('');
	};

	useEffect(() => {
		console.log('This should update commentData');
		//if (data) {
		// console.log(props.comments);
		// console.log(data.getTrailsById);
		setCommentData(props.comments);
		// console.log(commentData);
		//}
	}, [props.comments]);

	const classes = useStyles();

	return (
		<div>
			{commentData &&
				commentData.map(function ({ username, text }) {
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
