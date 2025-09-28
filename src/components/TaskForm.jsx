import {useState, useEffect} from "react";
import {toast} from "react-toastify";
import axios from "axios";

const API_BASE = "http://localhost:44393/api/tasks";

const TaskForm = ({task, onSave, onClose}) => {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [deadline, setDeadline] = useState("");
	const [status, setStatus] = useState("Pending");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (task) {
			setTitle(task.title || "");
			setDescription(task.description || "");
			setDeadline(
				task.deadline
					? new Date(task.deadline).toISOString().slice(0, 16)
					: ""
			);
			setStatus(task.status || "Pending");
		}
	}, [task]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!title.trim() || !deadline) {
			toast.error("Title and deadline are required");
			return;
		}

		const newTask = {
			Title: title.trim(),
			Description: description.trim(),
			Deadline: new Date(deadline).toISOString(),
			Status: status,
		};

		setLoading(true);
		try {
			if (task) {
				// EDIT TASK
				const res = await axios.put(`${API_BASE}/${task._id}`, newTask);
				const updatedTask = {
					_id: task._id,
					title: res.data.Title || newTask.Title,
					description: res.data.Description || newTask.Description,
					status: res.data.Status || newTask.Status,
					deadline: res.data.Deadline || newTask.Deadline,
				};
				toast.success("Task updated successfully");
				onSave(updatedTask);
			} else {
				// ADD TASK
				const res = await axios.post(API_BASE, newTask);
				const createdTask = {
					_id: res.data._id || res.data.Id,
					title: res.data.Title || newTask.Title,
					description: res.data.Description || newTask.Description,
					status: res.data.Status || newTask.Status,
					deadline: res.data.Deadline || newTask.Deadline,
				};
				toast.success("Task created successfully");
				onSave(createdTask);
			}
		} catch (err) {
			toast.error("Failed to save task");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
			<div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-700">
				<button
					onClick={onClose}
					className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
					aria-label="Close modal"
					disabled={loading}
				>
					✕
				</button>

				<h2 className="text-2xl font-bold mb-4">
					{task ? "Edit Task" : "Add Task"}
				</h2>

				<form onSubmit={handleSubmit} className="space-y-4">
					<input
						type="text"
						placeholder="Title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white/50 dark:bg-gray-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
						disabled={loading}
					/>
					<textarea
						placeholder="Description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white/50 dark:bg-gray-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
						rows="4"
						disabled={loading}
					/>
					<input
						type="datetime-local"
						value={deadline}
						onChange={(e) => setDeadline(e.target.value)}
						className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white/50 dark:bg-gray-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
						disabled={loading}
					/>
					<select
						value={status}
						onChange={(e) => setStatus(e.target.value)}
						className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white/50 dark:bg-gray-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
						disabled={loading}
					>
						<option>Pending</option>
						<option>In Progress</option>
						<option>Completed</option>
					</select>

					<div className="flex justify-end gap-2">
						<button
							type="button"
							onClick={onClose}
							className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
							disabled={loading}
						>
							Cancel
						</button>
						<button
							type="submit"
							className={`bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 ${
								loading ? "opacity-50 cursor-not-allowed" : ""
							}`}
							disabled={loading}
						>
							{loading ? "Saving..." : "Save"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default TaskForm;
