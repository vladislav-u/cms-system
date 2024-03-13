import axios from 'axios';
import React, { useState } from 'react';
import './AreaCards.scss';

const AreaCards = () => {
	const [botToken, setBotToken] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();

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
				console.log(error);
			});
	};

	const handleInputChange = (e) => {
		setBotToken(e.target.value);
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
						value={botToken}
						onChange={handleInputChange}
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
