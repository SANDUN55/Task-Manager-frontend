import {useState, useEffect} from "react";
import axios from "axios";
import {toast} from "react-toastify";

const API_BASE = "http://localhost:44393/api";

const TaskForm = ({task, onSave, onClose}) => {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [deadline, setDeadline] = useState("");
	const [status, setStatus] = useState("Pending");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (task) {
			setTitle(task.title);
			setDescription(task.description);
			setDeadline(new Date(task.deadline).toISOString().slice(0, 16));
			setStatus(task.status);
		}
	}, [task]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!title.trim() || !deadline) {
			toast.error("Title and deadline are required");
			return;
		}

		const taskData = {
			Title: title.trim(),
			Description: description.trim(),
			Status: status,
			Deadline: new Date(deadline).toISOString(),
		};

		setLoading(true);
		try {
			if (task) {
				await axios.put(`${API_BASE}/tasks/${task._id}`, taskData);
				toast.success("Task updated successfully");
			} else {
				await axios.post(`${API_BASE}/tasks`, taskData);
				toast.success("Task created successfully");
			}
			await onSave(); // refresh parent
			onClose();
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
						className="w-full p-2 border rounded-lg"
						required
						disabled={loading}
					/>
					<textarea
						placeholder="Description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						className="w-full p-2 border rounded-lg"
						rows="4"
						disabled={loading}
					/>
					<input
						type="datetime-local"
						value={deadline}
						onChange={(e) => setDeadline(e.target.value)}
						className="w-full p-2 border rounded-lg"
						required
						disabled={loading}
					/>
					<select
						value={status}
						onChange={(e) => setStatus(e.target.value)}
						className="w-full p-2 border rounded-lg"
						disabled={loading}
					>
						<option>Pending</option>
						<option>In Progress</option>
						<option>Completed</option>
					</select>
					<div className="flex justify-end space-x-2">
						<button
							type="button"
							onClick={onClose}
							className="bg-gray-500 text-white px-4 py-2 rounded-lg"
							disabled={loading}
						>
							Cancel
						</button>
						<button
							type="submit"
							className="bg-blue-500 text-white px-4 py-2 rounded-lg"
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
