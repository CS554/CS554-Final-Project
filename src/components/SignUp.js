import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { gql, useMutation } from '@apollo/react-hooks';
import { doCreateUserWithEmailAndPassword } from '../firebase/FirebaseFunctions';
import { AuthContext } from '../firebase/Auth';
import SocialSignIn from './SocialSignIn';
import { Box, Button, TextField, makeStyles } from '@material-ui/core';

const ADD_USER = gql`
	mutation createUser($id: ID!, $name: String!) {
		createUser(id: $id, name: $name) {
			name
			id
		}
	}
`;

const useStyles = makeStyles((theme) => ({
	root: {
		'& > *': {
			margin: theme.spacing(1),
			width: '25ch'
		}
	}
}));

const defaultProps = {
	bgcolor: 'background.paper',
	m: 1,
	border: 1.5,
	style: { width: '20rem', height: '39rem', padding: '50px' }
};

function SignUp() {
	const classes = useStyles();
	const { currentUser } = useContext(AuthContext);
	const [pwMatch, setPwMatch] = useState('');
	const [addUser] = useMutation(ADD_USER);

	const handleSignUp = async (e) => {
		e.preventDefault();
		const {
			displayName,
			email,
			passwordOne,
			passwordTwo
		} = e.target.elements;
		if (passwordOne.value !== passwordTwo.value) {
			setPwMatch('Passwords do not match');
			return false;
		}

		try {
			const cred = await doCreateUserWithEmailAndPassword(
				email.value,
				passwordOne.value,
				displayName
			);

			addUser({
				variables: {
					id: cred.user.uid,
					name: displayName.value
				}
			});
		} catch (error) {
			alert(error);
		}
	};

	if (currentUser) {
		return <Redirect to="/home" />;
	}

	return (
		<Box display="flex" justifyContent="center">
			<Box borderColor="primary.main" {...defaultProps}>
				<div>
					<h1>Sign up</h1>
					{pwMatch && <h4 className="error">{pwMatch}</h4>}
					<form
						onSubmit={(e) => handleSignUp(e, addUser)}
						className={classes.root}
						noValidate
						autoComplete="off"
					>
						{/* //<div className="form-group"> */}
						<TextField
							required
							id="displayName"
							name="displayName"
							label="Name"
							variant="outlined"
							type="text"
						/>
						{/* <label>
						Name:
						<input
							className="form-control"
							required
							name="displayName"
							type="text"
							placeholder="Name"
						/>
					</label> */}
						{/* //</div> */}
						{/* <div className="form-group"> */}
						<TextField
							required
							id="email"
							name="email"
							label="Email"
							variant="outlined"
							type="email"
						/>
						{/* <label>
						Email:
						<input
							className="form-control"
							required
							name="email"
							type="email"
							placeholder="Email"
						/>
					</label>
				</div> */}
						{/* <div className="form-group">
					<label> */}
						<TextField
							required
							id="passwordOne"
							name="passwordOne"
							type="password"
							label="Password"
							variant="outlined"
						/>
						{/* Password:
						<input
							className="form-control"
							id="passwordOne"
							name="passwordOne"
							type="password"
							placeholder="Password"
							required
						/>
					</label>
				</div> */}
						<TextField
							required
							id="passwordTwo"
							name="passwordTwo"
							type="password"
							label="Confirm Password"
							variant="outlined"
						/>
						{/* <div className="form-group">
					<label>
						Confirm Password:
						<input
							className="form-control"
							name="passwordTwo"
							type="password"
							placeholder="Confirm Password"
							required
						/>
					</label>
				</div> */}
						<Button
							variant="contained"
							color="primary"
							type="submit"
						>
							Sign Up
						</Button>
					</form>
					<br />
					<SocialSignIn />
				</div>
			</Box>
		</Box>
	);
}

export default SignUp;
