import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { Chip, Paper } from '@material-ui/core';

function Comments(props) {
	const useStyles = makeStyles((theme) => ({
		root: {
			width: '100%',
			maxWidth: 360
		}
	}));

	const classes = useStyles();

	return (
		<div>
			<Paper>
				<div>
					<Chip label="Will" />
					<h3>This hike is awesome!!</h3>
				</div>
			</Paper>
			<Paper>
				<form className={classes.root} noValidate autoComplete="off">
					<TextField
						id="standard-basic"
						label="Add a Comment"
						multiline
						rowsMax={4}
					/>
				</form>
			</Paper>
		</div>
	);
}

export default Comments;
