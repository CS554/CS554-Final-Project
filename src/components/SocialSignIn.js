import React from 'react';
import { doSocialSignIn } from '../firebase/FirebaseFunctions';
import { gql, useMutation } from '@apollo/react-hooks';

const ADD_USER = gql`
	mutation createUser($id: ID!, $name: String!) {
		createUser(id: $id, name: $name) {
			name
			id
		}
	}
`;

const SocialSignIn = () => {
	const [addUser] = useMutation(ADD_USER);

	const socialSignOn = async (provider) => {
		try {
			const cred = await doSocialSignIn(provider);
			addUser({
				variables: {
					id: cred.user.uid,
					name: cred.user.displayName
				}
			});
		} catch (error) {
			alert(error);
		}
	};
	return (
		<div>
			<img
				onClick={() => socialSignOn('google')}
				alt="google signin"
				src="/imgs/btn_google_signin.png"
			/>
			<img
				onClick={() => socialSignOn('facebook')}
				alt="facebook signin"
				src="/imgs/facebook_signin.png"
			/>
		</div>
	);
};

export default SocialSignIn;
