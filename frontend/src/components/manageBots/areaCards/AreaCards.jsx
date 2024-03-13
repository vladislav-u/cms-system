import axios from 'axios';
import React, { useState } from 'react';
import './AreaCards.scss';

const AreaCards = () => {
	const [botToken, setBotToken] = useState('');

	const handleSubmit = async (e) => {
		const data = {
			botToken: botToken,
		};

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
				console.error(error);
			});
	};

	const handleInputChange = (e) => {
		setBotToken(e.target.value); // Update the token state with the input field value
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
						value={botToken} // Bind the input field value to the token state
						onChange={handleInputChange} // Handle input changes
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
