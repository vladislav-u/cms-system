import axios from 'axios';
import React from 'react';
import './AreaCards.scss';

const AreaCards = () => {
	const handleSubmit = async (e) => {
		try {
			axios
				.post('http://localhost:8080/api/submitToken', {
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
