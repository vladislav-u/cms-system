import axios from 'axios';
import React, { useState } from 'react';
import './AreaCards.scss';

const AreaCards = () => {
	const [token, setToken] = useState('');

	const handleSubmit = async (e) => {
		const data = {
			token: token,
		};
		try {
			axios
				.post('http://localhost:8080/api/submitToken', data, {
					headers: {
						'Content-Type': 'application/json',
					},
				})
				.then((response) => {
					console.log(response.data);
				})
				.catch((error) => {
					console.log(error);
				});
		} catch (error) {
			console.error('Token submitting error:', error);
		}
	};

	return (
		<section className="content-area-cards">
			<div className="card">
				<form className="form-field" onSubmit={handleSubmit}>
					<h2>Add Bot:</h2>
					<input
						className="input-field"
						type="text"
						placeholder="Enter Bot Token"
						onChange={(e) => setToken(e.target.value)}
					/>
					<button className="btn-submit" type="submit">
						Submit Token
					</button>
				</form>
			</div>
			<div className="card">card div</div>
		</section>
	);
};

export default AreaCards;
