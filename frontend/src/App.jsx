import { useContext, useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.scss';
import MoonIcon from './components/assets/moon.svg';
import SunIcon from './components/assets/sun.svg';
import MainPage from './components/mainPage/MainPage';
import SignIn from './components/signIn/SignIn';
import SignUp from './components/signUp/SignUp';
import { DARK_THEME, LIGHT_THEME } from './constants/themeConstants';
import { ThemeContext } from './context/ThemeContext';
import BaseLayout from './layout/BaseLayout';
import { Dashboard, PageNotFound } from './screens';

function App() {
	const { theme, toggleTheme } = useContext(ThemeContext);

	useEffect(() => {
		if (theme === DARK_THEME) {
			document.body.classList.add('dark-mode');
		} else {
			document.body.classList.remove('dark-mode');
		}
	}, [theme]);

	return (
		<>
			<Router>
				<Routes>
					<Route element={<BaseLayout />}>
						<Route exact path="/dashboard" element={<Dashboard />} />
						<Route exact path="*" element={<PageNotFound />} />
					</Route>
					<Route exact path="/" element={<MainPage />} />
					<Route exact path="/register" element={<SignUp />} />
					<Route exact path="/login" element={<SignIn />} />
				</Routes>

				<button
					type="button"
					className="theme-toggle-btn"
					onClick={toggleTheme}
				>
					<img
						className="theme-icon"
						src={theme === LIGHT_THEME ? SunIcon : MoonIcon}
						alt="Theme Toggle"
					/>
				</button>
			</Router>
		</>
	);
}

export default App;
