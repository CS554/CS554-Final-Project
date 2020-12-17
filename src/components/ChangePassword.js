import React, { useContext, useState } from 'react';
import { AuthContext } from '../firebase/Auth';
import { doChangePassword } from '../firebase/FirebaseFunctions';
import '../App.css';
import { Button, TextField, Typography } from '@material-ui/core';

function ChangePassword() {
	const { currentUser } = useContext(AuthContext);
	const [pwMatch, setPwMatch] = useState('');
	console.log(currentUser);

	const submitForm = async (event) => {
		event.preventDefault();
		const {
			currentPassword,
			newPasswordOne,
			newPasswordTwo
		} = event.target.elements;

		if (newPasswordOne.value !== newPasswordTwo.value) {
			setPwMatch('New Passwords do not match, please try again');
			return false;
		}

		try {
			await doChangePassword(
				currentUser.email,
				currentPassword.value,
				newPasswordOne.value
			);
			alert('Password has been changed, you will now be logged out');
		} catch (error) {
			alert(error);
		}
	};
	if (currentUser.providerData[0].providerId === 'password') {
		return (
			<div>
				{pwMatch && <h4 className="error">{pwMatch}</h4>}
				<h2>Change Password</h2>
				<form onSubmit={submitForm}>
					<div className="form-group">
						<TextField
							name="currentPassword"
							id="currentPassword"
							type="password"
							placeholder="Current Password"
							label="Current Password"
							required
						/>
					</div>

					<div className="form-group">
						<TextField
							name="newPasswordOne"
							id="newPasswordOne"
							type="password"
							placeholder="Password"
							label="New Password"
							required
						/>
					</div>
					<div className="form-group">
						<TextField
							name="newPasswordTwo"
							id="newPasswordTwo"
							type="password"
							placeholder="Confirm Password"
							label="Confirm Password"
							required
						/>
					</div>

					<Button type="submit" color="primary">
						Change Password
					</Button>
				</form>
			</div>
		);
	} else {
		return (
			<Typography variant="subtitle1" className="AccountInfo">
				You are signed in using a Social Media Provider, You cannot
				change your password
			</Typography>
		);
	}
}

export default ChangePassword;
