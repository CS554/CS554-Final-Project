import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../firebase/Auth';
import '../App.css';
import firebase from 'firebase';
import StarIcon from '@material-ui/icons/Star';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import GroupIcon from '@material-ui/icons/Group';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import HomeIcon from '@material-ui/icons/Home';
import { useQuery, gql } from '@apollo/react-hooks';

import { AppBar, Toolbar, IconButton, Typography } from '@material-ui/core';

const Navigation = () => {
	const { currentUser } = useContext(AuthContext);
	return (
		<div>{currentUser ? <NavigationAuth /> : <NavigationNonAuth />}</div>
	);
};

const NavigationAuth = () => {
  const { currentUser } = useContext(AuthContext);
  return (
    <div>{currentUser ? <NavigationAuth /> : <NavigationNonAuth />}</div>
  );
};

const NavigationAuth = () => {
  const GET_USER = gql`
    query($userId:ID!) {
      getUser(userId:$userId){
        name
        }
    }`;
  console.log(firebase.auth().currentUser)
  const userID = firebase.auth().currentUser.uid
  const { isloading, error, data } = useQuery(GET_USER, {
    variables: {
      userId: userID,
    }
  });

  if (isloading) {
    return (
      <div>Loading</div>
    ) 
  } else if(data == undefined){

    return (
      <div>Loading</div>
    )
  } else{
	return (
		<div>
			
			<nav className="navigation">
				<Typography variant="h1">Take a Hike </Typography>
				<AppBar position="relative" style={{ background: '#2E3B55' }}>
					<Toolbar>
						<div className="links title">
						
								<StarIcon> </StarIcon>
								<NavLink exact to="/" activeClassName="active">
									Landing
								</NavLink>
						
						</div>
						<div className="links title">
							
								<HomeIcon> </HomeIcon>
								<NavLink
									exact
									to="/home"
									activeClassName="active"
								>
									Home
								</NavLink>
							
						</div>
						<div className="links title">
						
								<AccountCircleIcon> </AccountCircleIcon>
								<NavLink
									exact
									to="/account"
									activeClassName="active"
								>
									Account
								</NavLink>
						
						</div>
						<div className="links title">
				
								<GroupIcon> </GroupIcon>
								<NavLink
									exact
									to="/groups"
									activeClassName="active"
								>
									Group
								</NavLink>
						
						</div>
						<div className="links title">
							
								<BookmarkIcon> </BookmarkIcon>
								<NavLink
									exact
									to="/favorites"
									activeClassName="active"
								>
									Favorites
								</NavLink>
						
						</div>
						
						
					</Toolbar>
				</AppBar>
			</nav>
			<br/>
			<div className="user name">
						
						
								    Welcome {data.getUser.name}
						
						</div>
		</div>
	);
}};

const NavigationNonAuth = () => {
	return (
		<div>
			<nav className="navigation">
			<Typography variant="h1">Take a Hike </Typography>
				<AppBar position="relative" style={{ background: '#2E3B55' }}>
					<Toolbar style={{ color: 'black' }}>
					
						<IconButton
							edge="start"
							color="primary"
							aria-label="menu"
						></IconButton>
						<div className="links">
							<Typography variant="h4">
								<NavLink exact to="/" activeClassName="active">
									Landing
								</NavLink>
							</Typography>
						</div>
						<Typography variant="h4">
							<div className="links">
								<NavLink
									exact
									to="/signup"
									activeClassName="active"
								>
									Sign-up
								</NavLink>
							</div>
						</Typography>
						<Typography variant="h4">
							<div className="links">
								<NavLink
									exact
									to="/signin"
									activeClassName="active"
								>
									Sign-In
								</NavLink>
							</div>
						</Typography>
					</Toolbar>
				</AppBar>
			</nav>
		</div>
	);
};

export default Navigation;