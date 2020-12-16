import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../firebase/Auth';
import SignOutButton from './SignOut';
import '../App.css';
import firebase from 'firebase';
import Icon from '@material-ui/core/Icon';
import StarIcon from '@material-ui/icons/Star';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import GroupIcon from '@material-ui/icons/Group';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import HomeIcon from '@material-ui/icons/Home';

import { AppBar, Toolbar, IconButton, Typography, Button } from '@material-ui/core';


const Navigation = () => {
  const { currentUser } = useContext(AuthContext);
  return <div>{currentUser ? <NavigationAuth /> : <NavigationNonAuth />}</div>;
};

const NavigationAuth = () => {
  return (
    <nav className="navigation">
    <AppBar position="relative" style={{ background: '#2E3B55' }}>
      <Toolbar>
        <div className = "links">
        <Typography variant="h4">
        <StarIcon> </StarIcon>
          <NavLink exact to="/" activeClassName="active">
                Landing
              </NavLink>
        </Typography>
        </div>
        <div className = "links">
        <Typography variant="h4">
        <HomeIcon> </HomeIcon>
          <NavLink exact to="/home" activeClassName="active">
                Home
          </NavLink>
        </Typography>
        </div>
        <div className = "links">
        <Typography variant="h4">
        <AccountCircleIcon> </AccountCircleIcon>
        <NavLink exact to="/profile/:id" activeClassName="active">
                Account
              </NavLink>
        </Typography>
        </div>
        <div className = "links">
        <Typography variant="h4">
        <GroupIcon> </GroupIcon>
        <NavLink exact to="/profile/:id/groups" activeClassName="active">
                Group
              </NavLink>
        </Typography>
        </div>
        <div className = "links">
      <Typography variant="h4">
      <BookmarkIcon> </BookmarkIcon>
      <NavLink exact to="/profile/:id/favorites" activeClassName="active">
              Favorites
            </NavLink>
      </Typography>
      </div>
      <div className = "user">
      <Typography variant="h6">
      Hi {firebase.auth().currentUser.displayName}
    </Typography>
    </div>
      </Toolbar>
    </AppBar>
    </nav>
  );
};

const NavigationNonAuth = () => {
  return (
    <nav className="navigation">
    <AppBar position="relative" style={{ background: '#2E3B55' }}>
      <Toolbar style={{ color: 'black'}}>
        <IconButton edge="start"  color="black" aria-label="menu">
        </IconButton>
        <div className = "links">
        <Typography variant="h4">
          <NavLink exact to="/" activeClassName="active">
                Landing
              </NavLink>
        </Typography>
        </div>
        <Typography variant="h4">
        <div className = "links">
        <NavLink exact to="/signup" activeClassName="active">
          Sign-up
        </NavLink>
          </div>
        </Typography>
        <Typography variant="h4">
        <div className = "links">
        <NavLink exact to="/signin" activeClassName="active">
          Sign-In
        </NavLink>
          </div>
        </Typography>
      </Toolbar>
    </AppBar>
    </nav>

  );
};

export default Navigation;
