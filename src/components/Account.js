import React from 'react';
import SignOutButton from './SignOut';
import '../App.css';
import ChangePassword from './ChangePassword';
import firebase from 'firebase';
import AccountImage from '../images/Account_Image.png';

function Account() {
	console.log(firebase.auth().currentUser);
	return (
		<>
			<div>
				<h2>Account Page</h2>
				<img src={AccountImage} alt="user"></img>
				<p className="AccountInfo">
					Display Name: {firebase.auth().currentUser.displayName}
				</p>
				<br />
				<p className="AccountInfo">
					email: {firebase.auth().currentUser.email}
				</p>
				<br></br>
				<ChangePassword />
				<SignOutButton />
			</div>
		</>
	);
}

export default Account;
