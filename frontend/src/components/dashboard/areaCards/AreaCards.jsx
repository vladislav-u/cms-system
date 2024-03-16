import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import './AreaCards.scss';

const AreaCards = () => {
	const [botName, setBotName] = useState('');
	const [botToken, setBotToken] = useState('');

	useEffect(() => {
		fetchBotData();
	}, []);

	useEffect(() => {
		const botId = Cookies.get('botId');
		if (botId) {
			fetchBotData(botId);
		}
	}, []);

	const fetchBotData = async (botId) => {
		axios
			.get(`http://localhost:8080/api/getBotData/${botId}`)
			.then((response) => {
				const { botName, botToken } = response.data;
				setBotName(botName);
				setBotToken(botToken);
			})
			.catch((error) => {
				console.error('Error fetching bot details:', error);
			});
	};

	const launchBot = async () => {
		axios
			.post('http://localhost:8080/api/launchBot', { botToken })
			.then((response) => {
				console.log(response.data);
			})
			.catch((error) => {
				console.error('Error launching bot:', error);
			});
	};

	return (
		<section className="content-area-cards">
			<div className="card">
				{botName && (
					<div className="bot-card">
						<h2>Launch this bot: {botName}</h2>
						<button className="btn-submit" onClick={launchBot}>
							Launch Bot
						</button>
					</div>
				)}
			</div>
		</section>
	);
};

export default AreaCards;
