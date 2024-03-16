import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './AreaCards.scss';

const AreaCards = () => {
	const [botToken, setBotToken] = useState('');
	const [botName, setBotName] = useState('');
	const [dataList, setDataList] = useState([]);

	useEffect(() => {
		fetchDataList();
	}, []);

	const fetchDataList = async () => {
		try {
			const response = await axios.get('http://localhost:8080/api/getBots');
			setDataList(response.data);
		} catch (error) {
			console.log('Error fetching data:', error);
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		const data = {
			botToken: botToken,
			botName: botName,
		};

		axios
			.post('http://localhost:8080/api/submitToken', data, {
				headers: {
					'Content-Type': 'application/json',
				},
			})
			.then((response) => {
				console.log(response.data);

				fetchDataList();
				setBotToken('');
				setBotName('');
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const handleSelectBot = async (_id) => {
		axios
			.post('http://localhost:8080/api/saveToCookies', { botId: _id })
			.then((response) => {
				console.log(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const handleDeleteBot = async (_id) => {
		try {
			const response = await axios.delete(
				`http://localhost:8080/api/deleteBot/${_id}`
			);
			console.log(response.data);
			fetchDataList();
		} catch (error) {
			console.log('Error deleting bot:', error);
		}
	};

	const handleTokenChange = (e) => {
		setBotToken(e.target.value);
	};

	const handleNameChange = (e) => {
		setBotName(e.target.value);
	};

	return (
		<section className="content-area-cards">
			<div className="card">
				<form className="form-field" onSubmit={handleSubmit}>
					<h2>Add Bot:</h2>
					<input
						className="input-field"
						type="text"
						placeholder="Enter Bot Name"
						value={botName}
						onChange={handleNameChange}
					/>
					<input
						className="input-field"
						type="text"
						placeholder="Enter Bot Token"
						value={botToken}
						onChange={handleTokenChange}
					/>
					<button className="btn-submit" type="submit">
						Submit Token
					</button>
				</form>
			</div>

			<div className="card">
				{dataList.map((item, index) => (
					<div key={index} className={`bot-card ${index}`}>
						<h2>{item.botName}</h2>
						<div className="btn-wrap">
							<button
								className="btn-submit"
								onClick={() => handleSelectBot(item._id)}
							>
								Select Bot
							</button>
							<button
								className="btn-delete"
								onClick={() => handleDeleteBot(item._id)}
							>
								Delete Bot
							</button>
						</div>
					</div>
				))}
			</div>
		</section>
	);
};

export default AreaCards;
