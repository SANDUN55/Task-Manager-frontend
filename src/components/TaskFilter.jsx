const TaskFilter = ({filter = "All", setFilter}) => {
	return (
		<div className="flex items-center space-x-3">
			<label className="font-semibold text-gray-700 dark:text-gray-300">
				Filter by Status:
			</label>
			<select
				value={filter}
				onChange={(e) => setFilter(e.target.value)}
				className="bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
			>
				<option value="All">All</option>
				<option value="Pending">Pending</option>
				<option value="In Progress">In Progress</option>
				<option value="Completed">Completed</option>
			</select>
		</div>
	);
};

export default TaskFilter;
