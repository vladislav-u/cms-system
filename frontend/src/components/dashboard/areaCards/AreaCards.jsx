import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import './AreaCards.scss';

const AreaCards = () => {
	const [botName, setBotName] = useState('');
	const [botToken, setBotToken] = useState('');
	const [botStatus, setBotStatus] = useState();
	const [isFilterEnabled, setIsFilterEnabled] = useState();
	const [isKickUserEnabled, setIsKickUserEnabled] = useState();
	const [isMuteUserEnabled, setIsMuteUserEnabled] = useState();

	const toggleFilter = async () => {
		setIsFilterEnabled(!isFilterEnabled);
		axios
			.post('http://localhost:8080/api/command/messageFilter', {
				isFilterEnabled: !isFilterEnabled,
			})
			.then((response) => {
				console.log(response.data);
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	};

	const toggleKick = async () => {
		setIsKickUserEnabled(!isKickUserEnabled);
		axios
			.post('http://localhost:8080/api/command/kickUser', {
				isKickUserEnabled: !isKickUserEnabled,
			})
			.then((response) => {
				console.log(response.data);
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	};

	const toggleMute = async () => {
		setIsMuteUserEnabled(!isMuteUserEnabled);
		axios
			.post('http://localhost:8080/api/command/muteUser', {
				isMuteUserEnabled: !isMuteUserEnabled,
			})
			.then((response) => {
				console.log(response.data);
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	};

	useEffect(() => {
		const botId = Cookies.get('botId');
		if (botId) {
			fetchBotData(botId);
			fetchCommandData(botId);
		}
	}, []);

	const fetchBotData = async (botId) => {
		axios
			.get(`http://localhost:8080/api/getBotData/${botId}`)
			.then((response) => {
				const { botName, botToken, botStatus } = response.data;
				setBotStatus(botStatus);
				setBotName(botName);
				setBotToken(botToken);
			})
			.catch((error) => {
				console.error('Error fetching bot details:', error);
			});
	};
	const fetchCommandData = async (botId) => {
		axios
			.get(`http://localhost:8080/api/getCommandsData/${botId}`)
			.then((response) => {
				const { isMessageFilterEnabled, isKickUserEnabled, isMuteUserEnabled } =
					response.data.commandsData[0];
				setIsFilterEnabled(isMessageFilterEnabled);
				setIsKickUserEnabled(isKickUserEnabled);
				setIsMuteUserEnabled(isMuteUserEnabled);
			})
			.catch((error) => {
				console.error('Error fetching command details:', error);
			});
	};

	const launchBot = async () => {
		setBotStatus(!botStatus);
		axios
			.post('http://localhost:8080/api/command/launchBot', { botToken })
			.then((response) => {
				const botId = Cookies.get('botId');
				if (botId) {
					fetchCommandData(botId);
				}

				console.log(response.data);
			})
			.catch((error) => {
				console.error('Error launching bot:', error);
			});
	};
	const stopBot = async () => {
		setBotStatus(!botStatus);
		axios
			.post('http://localhost:8080/api/command/stopBot')
			.then((response) => {
				console.log(response.data);
			})
			.catch((error) => {
				console.error('Error stopping bot:', error);
			});
	};

	return (
		<section className="content-area-cards">
			<div className="card">
				{botName && (
					<div className="bot-card">
						<h2>
							Launch this bot: <b>{botName}</b>
						</h2>
						<h2>
							Status: <b>{botStatus ? 'Running' : 'Stopped'}</b>
						</h2>
						<div className="btn-wrap">
							<button className="btn-submit" onClick={launchBot}>
								Launch Bot
							</button>
							<button className="btn-delete" onClick={stopBot}>
								Stop Bot
							</button>
						</div>
					</div>
				)}
			</div>
			<div className="card">
				<div className="command-card">
					<h2>{isFilterEnabled ? 'Disable Filter' : 'Enable Filter'}</h2>
					<button className="btn-submit" onClick={toggleFilter}>
						{isFilterEnabled ? 'Turn Off' : 'Turn On'}
					</button>
				</div>
				<div className="command-card">
					<h2>{isKickUserEnabled ? 'Disable Kick' : 'Enable Kick'}</h2>
					<button className="btn-submit" onClick={toggleKick}>
						{isKickUserEnabled ? 'Turn Off' : 'Turn On'}
					</button>
				</div>
				<div className="command-card">
					<h2>
						{isMuteUserEnabled ? 'Disable Mute/Unmute' : 'Enable Mute/Unmute'}
					</h2>
					<button className="btn-submit" onClick={toggleMute}>
						{isMuteUserEnabled ? 'Turn Off' : 'Turn On'}
					</button>
				</div>
			</div>
		</section>
	);
};

export default AreaCards;
