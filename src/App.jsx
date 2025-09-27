import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {useState} from "react";
import Tasks from "./pages/Tasks";
import Notes from "./pages/Notes";
import Navbar from "./components/Navbar";

function App() {
	const [darkMode, setDarkMode] = useState(true);

	return (
		<div
			className={`min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-300 ${
				darkMode ? "dark" : ""
			}`}
		>
			<Router>
				<Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
				<div className="container mx-auto p-4 sm:p-6">
					<Routes>
						<Route path="/" element={<Tasks />} />
						<Route path="/notes" element={<Notes />} />
					</Routes>
				</div>
			</Router>
		</div>
	);
}

export default App;
