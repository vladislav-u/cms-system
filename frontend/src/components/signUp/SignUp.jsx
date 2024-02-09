import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import './SignUp.css';

import email_icon from '../assets/icons8-email-32.png';
import password_icon from '../assets/icons8-password-32.png';
import user_icon from '../assets/icons8-user-32.png';

const SigninSignup = () => {
    const navigate = useNavigate();

    const redirectToLogin = () => {
        navigate('/login');
      };

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = () => {
        const data = {
            name: name,
            email: email,
            password: password
        };

		axios
			.post('http://localhost:8080/register', data, {
				headers: {
					'Content-Type': 'application/json',
				},
			})
			.then((response) => {
				console.log(response.data);
				navigate('/login');
			})
			.catch((error) => {
				console.log(error);
			});
    };

    return (
        <div className='container'>
            <div className='header'>
                <div className='text'>Sign Up</div>
                <div className='underline'></div>
            </div>
            <div className='inputs'>
                <div className='input'>
                    <img src={user_icon} alt='Name' />
                    <input type='text' placeholder="Name" onChange={(e) => setName(e.target.value)} />
                </div>
                <div className='input'>
                    <img src={email_icon} alt='Email' />
                    <input type='email' placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className='input'>
                    <img src={password_icon} alt='Password' />
                    <input type='password' placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                </div>
            </div>
            <div className="submit-container">
                <div className="submit" onClick={() => handleSignUp()}>
                    Sign Up
                </div>
                <div className="submit gray" onClick={redirectToLogin}>
                    Sign In
                </div>
            </div>
        </div>
    );
};

export default SigninSignup;
