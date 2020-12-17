import React from 'react';

import '../App.css';

function Landing() {
	return (
		<div>
			<img src="/imgs/take-a-hike-logo.png" alt="Take A Hike logo" />
			<h2>Welcome to Take A Hike!</h2>
			<p className="intro">
				Take A Hike! is our CS-554 final project application to help
				users find hiking trails near them. Either using our locate me
				feature or typing in your coordinates, Take A Hike! finds the
				best hiking trails near you!{' '}
			</p>
		</div>
	);
}

export default Landing;
