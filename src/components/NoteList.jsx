import {TrashIcon} from "@heroicons/react/24/solid";
import {format} from "date-fns";

const NoteList = ({notes, onDelete}) => {
	const formatDate = (dateString) => {
		if (!dateString) return "Unknown date";
		try {
			return format(new Date(dateString), "MMM d, yyyy h:mm a");
		} catch {
			return "Invalid date";
		}
	};

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{notes.map((note) => (
				<div
					key={note._id}
					className="p-4 bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-md backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-transform duration-200 hover:-translate-y-1"
				>
					<p className="text-gray-800 dark:text-gray-200 line-clamp-3">
						{note.content}
					</p>
					<p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
						Created: {formatDate(note.createdAt)}
					</p>
					<div className="flex justify-end mt-4">
						<button
							onClick={() => onDelete(note._id)}
							className="text-red-500 hover:text-red-700 transition-colors duration-200"
							aria-label="Delete note"
						>
							<TrashIcon className="h-5 w-5" />
						</button>
					</div>
				</div>
			))}
		</div>
	);
};

export default NoteList;
