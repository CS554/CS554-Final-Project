import React, { useState, useEffect } from 'react';

import '../App.css';

function Trail(props) {
	let trail = {
		id: 7011192,
		name: 'Boulder Skyline Traverse',
		type: 'Recommended Route',
		summary: 'The classic long mountain route in Boulder.',
		difficulty: 'black',
		stars: 4.7,
		starVotes: 93,
		location: 'Superior, Colorado',
		url:
			'https://www.hikingproject.com/trail/7011192/boulder-skyline-traverse',
		imgSqSmall:
			'https://cdn2.apstatic.com/photos/hike/7039883_sqsmall_1555092747.jpg',
		imgSmall:
			'https://cdn2.apstatic.com/photos/hike/7039883_small_1555092747.jpg',
		imgSmallMed:
			'https://cdn2.apstatic.com/photos/hike/7039883_smallMed_1555092747.jpg',
		imgMedium:
			'https://cdn2.apstatic.com/photos/hike/7039883_medium_1555092747.jpg',
		length: 17.3,
		ascent: 5345,
		descent: -5420,
		high: 8433,
		low: 5425,
		longitude: -105.2582,
		latitude: 39.9388,
		conditionStatus: 'All Clear',
		conditionDetails: 'Dry',
		conditionDate: '2020-09-16 14:37:11'
	};

	return (
		<>
			<br></br>
			<div>
				<img src={trail.imgMedium} alt="Trail" />
				<h1>Name: {trail.name}</h1>{' '}
				<h2>Description: {trail.summary}</h2>
				<h2>Difficulty: {trail.difficulty}</h2>
				<h2>
					Rating: {trail.stars} Stars. {trail.starVotes} Votes
				</h2>
				<h2>
					Condditions: {trail.conditionStatus},{' '}
					{trail.conditionDetails}. Last updated:{' '}
					{trail.conditionDate}
				</h2>
			</div>
		</>
	);
}

export default Trail;
