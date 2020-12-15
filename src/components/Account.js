import React from 'react';
import SignOutButton from './SignOut';
import '../App.css';
import ChangePassword from './ChangePassword';
import firebase from 'firebase';
import AccountImage from '../images/Account_Image.png'

let temp_user = {
  username: 'jgarner413',
  email: 'jgarner413@gmail.com',
  firstName: 'Josh',
  lastName: 'Garner'

}

function Account() {
  console.log(firebase.auth().currentUser);
  return (
    <>
    <div>
      <h2>Account Page</h2>
      <img src={AccountImage}></img>
    <p className="AccountInfo">Display Name: {firebase.auth().currentUser.displayName}</p><br></br>
    <p className="AccountInfo">email: {firebase.auth().currentUser.email}</p><br></br>
      <ChangePassword />
      <SignOutButton />
    </div>
    </>
  );
}

export default Account;
