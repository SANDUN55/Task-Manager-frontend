import {Link} from "react-router-dom";
import {MoonIcon, SunIcon} from "@heroicons/react/24/solid";

const Navbar = ({darkMode, setDarkMode}) => {
	return (
		<nav className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 shadow-lg backdrop-blur-md">
			<div className="container mx-auto flex justify-between items-center">
				<Link
					to="/"
					className="text-white text-2xl font-bold tracking-tight"
				>
					Task Manager
				</Link>
				<div className="flex items-center space-x-4">
					<Link
						to="/"
						className="text-white hover:text-indigo-200 transition-colors duration-200"
					>
						Tasks
					</Link>
					<Link
						to="/notes"
						className="text-white hover:text-indigo-200 transition-colors duration-200"
					>
						Notes
					</Link>
					<button
						onClick={() => setDarkMode(!darkMode)}
						className="text-white hover:text-indigo-200 p-2 rounded-full hover:bg-indigo-700/50 transition-colors duration-200"
						aria-label="Toggle dark mode"
					>
						{darkMode ? (
							<SunIcon className="h-6 w-6" />
						) : (
							<MoonIcon className="h-6 w-6" />
						)}
					</button>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
