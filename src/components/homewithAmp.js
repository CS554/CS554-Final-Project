import React from 'react';
import { listTrails } from '../graphql/queries';
import '../App.css';

// Appsync setup
import appSyncConfig from '../aws-exports';
import Amplify, { API, graphqlOperation } from 'aws-amplify';
Amplify.configure(appSyncConfig);

function Home() {
  console.log(listTrails);

  const trails = API.graphql(graphqlOperation(listTrails));

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  // if (error) {
  //   return <div>{error.message}</div>;
  // }

  console.log(trails);

  return (
    <div>
      <h2>This is the Home page</h2>
      {/* <div>{data}</div> */}
    </div>
  );
}

export default Home;
