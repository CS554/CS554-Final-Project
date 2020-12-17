import React from 'react';
import SignOutButton from './SignOut';
import '../App.css';
import ChangePassword from './ChangePassword';
import firebase from 'firebase';
import AccountImage from '../images/Account_Image.png';
import { Container, Typography } from '@material-ui/core';

function Account() {
	console.log(firebase.auth().currentUser);
	return (
		<>
			<div>
				<h2>Account Page</h2>
				<img src={AccountImage} alt="user"></img>
				<Typography variant="h3" className="AccountInfo">
					{firebase.auth().currentUser.displayName}
				</Typography>
				<br />
				<Typography variant="h4" className="AccountInfo">
					{firebase.auth().currentUser.email}
				</Typography>
				<br />
				<Container className="AccountInfo">
					<ChangePassword />
					<SignOutButton />
				</Container>
			</div>
		</>
	);
}

export default Account;
