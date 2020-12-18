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
import Trail from './components/trailComponents/Trail';
import Favorites from './components/Favorites';
import Groups from './components/Groups';
import GroupInfo from './components/GroupData';
import HeaderImage from './images/hiking_horizontal.png';

import { Box } from '@material-ui/core';

import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';

Amplify.configure(awsconfig);

const { endpoint } = awsconfig.aws_cloud_logic_custom[0];

/* Create client using the GraphQL endpoint  */
const client = new ApolloClient({
	uri: endpoint + '/graphql'
});

function App() {
	return (
		<AuthProvider>
			<Router>
				<Box
					height="250px"
					display="flex"
					className="App"
					alignItems="center"
					justifyContent="center"
					style={{
						backgroundImage: `url(${HeaderImage})`
					}}
				>
					<Navigation />
				</Box>

				<Route exact path="/" component={Landing} />
				<PrivateRoute path="/home" component={Home} />
				<PrivateRoute exact path="/account" component={Account} />
				<PrivateRoute exact path="/trails/:id" component={Trail} />
				<PrivateRoute exact path="/favorites" component={Favorites} />
				<PrivateRoute exact path="/groups" component={Groups} />
				<PrivateRoute exact path="/groups/:id" component={GroupInfo} />
				<Route path="/signin" component={SignIn} />
				<Route path="/signup" component={SignUp} />
			</Router>
		</AuthProvider>
	);
}

const AppWithProvider = () => (
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>
);

export default AppWithProvider;

// export default App;
