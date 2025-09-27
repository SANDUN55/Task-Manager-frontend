import {PencilIcon, TrashIcon} from "@heroicons/react/24/solid";
import {format} from "date-fns";

const getStatusColor = (status) => {
	switch (status) {
		case "Pending":
			return "bg-blue-100/80 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200";
		case "In Progress":
			return "bg-yellow-100/80 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200";
		case "Completed":
			return "bg-green-100/80 text-green-800 dark:bg-green-900/40 dark:text-green-200";
		default:
			return "bg-gray-100/80 text-gray-800 dark:bg-gray-700/40 dark:text-gray-200";
	}
};

const TaskList = ({tasks = [], onEdit, onDelete}) => {
	const isOverdue = (deadline, status) => {
		return (
			deadline && new Date(deadline) < new Date() && status !== "Completed"
		);
	};

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{tasks.map((task) => (
				<div
					key={task._id}
					className={`p-4 rounded-lg shadow-md backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border ${
						isOverdue(task.deadline, task.status)
							? "border-red-500"
							: "border-gray-200 dark:border-gray-700"
					} hover:shadow-lg transition-transform duration-200 hover:-translate-y-1`}
				>
					<h3 className="text-xl font-semibold truncate">{task.title}</h3>
					<p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
						{task.description}
					</p>
					<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
						Deadline:{" "}
						{task.deadline
							? format(new Date(task.deadline), "MMM d, yyyy h:mm a")
							: "No deadline"}
					</p>
					<span
						className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${getStatusColor(
							task.status
						)}`}
					>
						{task.status}
					</span>
					{isOverdue(task.deadline, task.status) && (
						<p className="text-red-500 font-bold mt-1">Overdue!</p>
					)}
					<div className="flex justify-end space-x-2 mt-4">
						<button
							onClick={() => onEdit(task)}
							className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
							aria-label="Edit task"
						>
							<PencilIcon className="h-5 w-5" />
						</button>
						<button
							onClick={() => onDelete(task._id)}
							className="text-red-500 hover:text-red-700 transition-colors duration-200"
							aria-label="Delete task"
						>
							<TrashIcon className="h-5 w-5" />
						</button>
					</div>
				</div>
			))}
		</div>
	);
};

export default TaskList;
