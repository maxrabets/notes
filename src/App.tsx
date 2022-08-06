import { useMemo, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./db";
import Sidebar from "./components/Sidebar/Sidebar";
import NotesContext, { INotesContext } from "./NotesContext";
import { addNote, deleteNote, setNoteContent } from "./notesService";
import { INote } from "./types";
import { generateId } from "./utils";
import Workspace from "./components/Workspace/Workspace";
import "antd/dist/antd.css";
import "easymde/dist/easymde.min.css";

import "./App.scss";

const App = () => {
	const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
	const [isEditMode, setIsEditMode] = useState(false);
	const notes = useLiveQuery(() => db.notes.toArray(), []);
	const notesContextValue: INotesContext = useMemo(() => {
		return {
			notes: notes || [],
			selectedNoteId,
			setSelectedNoteId,
			addNote: async () => {
				const newNote: INote = {
					content: "",
					title: "New Note",
					dateEdited: new Date(),
					id: generateId(),
				};
				await addNote(newNote);
			},
			deleteNote: async (id: string | null) => {
				if (id) {
					await deleteNote(id);
				}
			},
			setNoteContent,
			isEditMode,
			setIsEditMode,
		};
	}, [selectedNoteId, notes, isEditMode]);

	return (
		<div className="App">
			<NotesContext.Provider value={notesContextValue}>
				<Sidebar />
				{selectedNoteId && <Workspace />}
			</NotesContext.Provider>
		</div>
	);
};

export default App;
