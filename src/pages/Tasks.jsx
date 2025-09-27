import {useState, useEffect} from "react";
import TaskFilter from "../components/TaskFilter";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";
import {toast} from "react-toastify";
import axios from "axios";

const API_BASE = "http://localhost:44393/api";

const Tasks = () => {
	const [tasks, setTasks] = useState([]);
	const [filter, setFilter] = useState("All");
	const [search, setSearch] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingTask, setEditingTask] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchTasks();
	}, []);

	const fetchTasks = async () => {
		setLoading(true);
		try {
			const res = await axios.get(`${API_BASE}/tasks`);
			const mappedTasks = res.data.map((task) => ({
				_id: task._id || task.id,
				title: task.Title || task.title || "Untitled",
				description:
					task.Description || task.description || "No description",
				status: task.Status || task.status || "Pending",
				deadline:
					task.Deadline || task.deadline || new Date().toISOString(),
			}));
			setTasks(mappedTasks);
		} catch (err) {
			toast.error("Failed to fetch tasks");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const openModal = (task = null) => {
		setEditingTask(task);
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setEditingTask(null);
		setIsModalOpen(false);
	};

	const handleSave = async () => {
		await fetchTasks(); // refresh tasks
		closeModal();
	};

	const handleDelete = async (_id) => {
		try {
			await axios.delete(`${API_BASE}/tasks/${_id}`);
			setTasks((prev) => prev.filter((t) => t._id !== _id));
			toast.success("Task deleted successfully");
		} catch (err) {
			toast.error("Failed to delete task");
			console.error(err);
		}
	};

	const filteredTasks = tasks
		.filter((task) => filter === "All" || task.status === filter)
		.filter(
			(task) =>
				task.title.toLowerCase().includes(search.toLowerCase()) ||
				task.description.toLowerCase().includes(search.toLowerCase())
		);

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row justify-between items-center gap-4">
				<h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
				<div className="flex gap-4">
					<input
						type="text"
						placeholder="Search tasks..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white/50 dark:bg-gray-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					<button
						onClick={() => openModal()}
						className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-md hover:shadow-lg"
					>
						Add Task
					</button>
				</div>
			</div>

			<TaskFilter filter={filter} setFilter={setFilter} />

			{loading ? (
				<div className="flex justify-center">
					<div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
				</div>
			) : filteredTasks.length === 0 ? (
				<p className="text-center text-gray-500 dark:text-gray-400">
					No tasks found. Add one above!
				</p>
			) : (
				<TaskList
					tasks={filteredTasks}
					onEdit={openModal}
					onDelete={handleDelete}
				/>
			)}

			{isModalOpen && (
				<TaskForm
					task={editingTask}
					onSave={handleSave}
					onClose={closeModal}
				/>
			)}
		</div>
	);
};

export default Tasks;
