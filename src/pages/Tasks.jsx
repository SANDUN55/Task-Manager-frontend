import {useState, useEffect} from "react";
import TaskFilter from "../components/TaskFilter";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";
import axios from "axios";
import {toast} from "react-toastify";

const API_BASE = "http://localhost:44393/api/tasks";

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
			const res = await axios.get(API_BASE);
			setTasks(
				res.data.map((task) => ({
					_id: task.Id || task._id,
					title: task.Title || task.title,
					description: task.Description || task.description,
					status: task.Status || task.status,
					deadline: task.Deadline || task.deadline,
				}))
			);
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

	const handleSave = (taskData) => {
		setTasks((prev) =>
			editingTask
				? prev.map((t) =>
						t._id === editingTask._id ? {...t, ...taskData} : t
					)
				: [taskData, ...prev]
		);
		closeModal();
	};

	const deleteTask = async (_id) => {
		try {
			await axios.delete(`${API_BASE}/${_id}`);
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
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold">My Tasks</h1>
				<div className="flex gap-4">
					<input
						type="text"
						placeholder="Search tasks..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="p-2 border rounded-lg"
					/>
					<button
						onClick={() => openModal()}
						className="bg-blue-500 text-white px-4 py-2 rounded-lg"
					>
						Add Task
					</button>
				</div>
			</div>

			<TaskFilter filter={filter} setFilter={setFilter} />

			{loading ? (
				<div>Loading...</div>
			) : filteredTasks.length === 0 ? (
				<p>No tasks found.</p>
			) : (
				<TaskList
					tasks={filteredTasks}
					onEdit={openModal}
					onDelete={deleteTask}
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
