import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Certificate from './Certificate';
import ErrorPage from './Error';

function App() {
	return (
		<>
			<Routes>
				<Route
					path='/'
					element={<Home />}
				/>
				<Route
					path='/certificate/*'
					element={<Certificate />}
				/>
				<Route
					path='/error'
					element={<ErrorPage />}
				/>
			</Routes>
		</>
	);
}

export default App;
