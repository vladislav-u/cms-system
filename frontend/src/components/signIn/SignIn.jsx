import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignIn.scss';

import email_icon from '../assets/icons8-email-32.png';
import password_icon from '../assets/icons8-password-32.png';

const SignIn = () => {
	const navigate = useNavigate();

	const redirectToRegister = () => {
		navigate('/register');
	};

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleSignIn = async () => {
		const data = {
			email: email,
			password: password,
		};

		axios
			.post('http://localhost:8080/login', data, {
				headers: {
					'Content-Type': 'application/json',
				},
			})
			.then((response) => {
				console.log(response.data);
				navigate('/');
			})
			.catch((error) => {
				console.log(error);
			});
	};

	return (
		<div className="container">
			<div className="header">
				<div className="text">Sign In</div>
				<div className="underline"></div>
			</div>
			<div className="inputs">
				<div className="input">
					<img src={email_icon} alt="Email" />
					<input
						type="email"
						placeholder="Email"
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>
				<div className="input">
					<img src={password_icon} alt="Password" />
					<input
						type="password"
						placeholder="Password"
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
			</div>
			<div className="submit-container">
				<div className="submit" onClick={() => handleSignIn()}>
					Sign In
				</div>
				<div className="submit gray" onClick={redirectToRegister}>
					Sign Up
				</div>
			</div>
		</div>
	);
};

export default SignIn;
