import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { gql, useMutation } from '@apollo/react-hooks';
import { doCreateUserWithEmailAndPassword } from '../firebase/FirebaseFunctions';
import { AuthContext } from '../firebase/Auth';
import SocialSignIn from './SocialSignIn';

const ADD_USER = gql`
	mutation createUser($id: ID!, $name: String!) {
		createUser(id: $id, name: $name) {
			name
			id
		}
	}
`;

function SignUp() {
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
		<div>
			<h1>Sign up</h1>
			{pwMatch && <h4 className="error">{pwMatch}</h4>}
			<form onSubmit={(e) => handleSignUp(e, addUser)}>
				<div className="form-group">
					<label>
						Name:
						<input
							className="form-control"
							required
							name="displayName"
							type="text"
							placeholder="Name"
						/>
					</label>
				</div>
				<div className="form-group">
					<label>
						Email:
						<input
							className="form-control"
							required
							name="email"
							type="email"
							placeholder="Email"
						/>
					</label>
				</div>
				<div className="form-group">
					<label>
						Password:
						<input
							className="form-control"
							id="passwordOne"
							name="passwordOne"
							type="password"
							placeholder="Password"
							required
						/>
					</label>
				</div>
				<div className="form-group">
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
				</div>
				<button id="submitButton" name="submitButton" type="submit">
					Sign Up
				</button>
			</form>
			<br />
			<SocialSignIn />
		</div>
	);
}

export default SignUp;
