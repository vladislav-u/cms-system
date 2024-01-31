import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import SignIn from './components/signIn/SignIn';
import SignUp from './components/signUp/SignUp';

function App() {
	return (
		<>
			<Router>
				<Routes>
					<Route exact path="/register" element={<SignUp />} />
					<Route exact path="/login" element={<SignIn />} />
				</Routes>
			</Router>
		</>
	);
}

export default App;
