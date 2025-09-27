import {useState} from "react";
import axios from "axios";
import {toast} from "react-toastify";

const API_BASE = "http://localhost:44393/api";

const NoteForm = ({onSave, onClose}) => {
	const [content, setContent] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!content.trim()) {
			toast.error("Note content cannot be empty");
			return;
		}

		setLoading(true);
		try {
			await axios.post(`${API_BASE}/notes`, {content: content.trim()});
			toast.success("Note created");
			setContent(""); // Reset content
			await onSave(); // Refresh parent list
			onClose(); // Close modal
		} catch (err) {
			toast.error("Failed to save note");
			console.error("Error saving note:", err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
			<div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-700">
				{/* Close Button */}
				<button
					onClick={onClose}
					className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
					aria-label="Close modal"
				>
					<svg
						className="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>

				<h2 className="text-2xl font-bold mb-4">Add Note</h2>

				<form onSubmit={handleSubmit} className="space-y-4">
					<textarea
						placeholder="Note content"
						value={content}
						onChange={(e) => setContent(e.target.value)}
						className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white/50 dark:bg-gray-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
						required
						disabled={loading}
					/>

					<div className="flex justify-end space-x-2">
						<button
							type="button"
							onClick={onClose}
							className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200"
							disabled={loading}
						>
							Cancel
						</button>
						<button
							type="submit"
							className={`bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 ${
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

export default NoteForm;
