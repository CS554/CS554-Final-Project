import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Account from './components/Account';
import Home from './components/Home';
import Landing from './components/Landing';
import Navigation from './components/Navigation';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import { AuthProvider } from './firebase/Auth';
import PrivateRoute from './components/PrivateRoute';
import Trail from './components/Trail'
import Favorites from './components/Favorites'
import Groups from './components/Groups'



function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <header className="App-header">
            <Navigation />
          </header>
        </div>
        <Route exact path="/" component={Landing} />
        <PrivateRoute path="/home" component={Home} />
        <PrivateRoute exact path="/profile/:id" component={Account} />
        <PrivateRoute exact path="/trails/:id" component={Trail}/>
        <PrivateRoute exact path="/profile/:id/favorites" component={Favorites}/>
        <PrivateRoute exact path="/profile/:id/groups" component={Groups}/>
        <Route path="/signin" component={SignIn} />
        <Route path="/signup" component={SignUp} />
      </Router>
    </AuthProvider>
  );
}

export default App;
