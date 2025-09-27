import {useState, useEffect} from "react";
import NoteList from "../components/NoteList";
import NoteForm from "../components/NoteForm";
import axios from "axios";
import {toast} from "react-toastify";

const API_BASE = "http://localhost:44393/api/notes";

const Notes = () => {
	const [notes, setNotes] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchNotes();
	}, []);

	const fetchNotes = async () => {
		setLoading(true);
		try {
			const res = await axios.get(API_BASE);
			const mappedNotes = res.data.map((note) => ({
				_id: note._id || note.Id, // MongoDB ID
				content: note.Content || note.content || "No content",
				createdAt:
					note.CreatedAt || note.createdAt || new Date().toISOString(),
			}));
			setNotes(mappedNotes);
		} catch (err) {
			toast.error("Failed to fetch notes");
			console.error(err);
			setNotes([]);
		} finally {
			setLoading(false);
		}
	};

	const openModal = () => setIsModalOpen(true);
	const closeModal = () => setIsModalOpen(false);

	// Add or refresh notes after creating
	const handleSave = async () => {
		await fetchNotes();
		closeModal();
	};

	// Delete note handler
	const deleteNote = async (_id) => {
		try {
			await axios.delete(`${API_BASE}/${_id}`);
			setNotes((prev) => prev.filter((n) => n._id !== _id));
			toast.success("Note deleted successfully");
		} catch (err) {
			toast.error("Failed to delete note");
			console.error(err);
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row justify-between items-center gap-4">
				<h1 className="text-3xl font-bold tracking-tight">My Notes</h1>
				<button
					onClick={openModal}
					className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-md hover:shadow-lg"
				>
					Add Note
				</button>
			</div>

			{loading ? (
				<div className="flex justify-center">
					<div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
				</div>
			) : notes.length === 0 ? (
				<p className="text-center text-gray-500 dark:text-gray-400">
					No notes found. Add one above!
				</p>
			) : (
				<NoteList notes={notes} onDelete={deleteNote} />
			)}

			{isModalOpen && <NoteForm onSave={handleSave} onClose={closeModal} />}
		</div>
	);
};

export default Notes;
