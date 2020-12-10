import React from 'react';
import SignOutButton from './SignOut';
import '../App.css';
import ChangePassword from './ChangePassword';

let temp_user = {
  username: 'jgarner413',
  email: 'jgarner413@gmail.com',
  firstName: 'Josh',
  lastName: 'Garner'

}

function Account() {
  return (
    <>
    <div>
      <h2>Account Page</h2>
      <img src="/imgs/hiking_icon.png"></img>
    <p>User Name: {temp_user.username}</p><br></br>
    <p>First Name: {temp_user.firstName}</p><br></br>
    <p>Last Name: {temp_user.lastName}</p><br></br>
    <p>email: {temp_user.email}</p><br></br>
      <ChangePassword />
      <SignOutButton />
    </div>
    </>
  );
}

export default Account;
