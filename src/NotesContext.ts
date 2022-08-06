import React from "react";
import { INote } from "./types";
import { addNote, deleteNote, setNoteContent } from "./notesService";
import { generateId } from "./utils";

export interface INotesContext {
	notes: INote[];
	addNote: () => Promise<void>;
	deleteNote: (id: string | null) => Promise<void>;
	setNoteContent: (id: string | null, content: string) => Promise<void>;
	selectedNoteId: string | null;
	setSelectedNoteId: (id: string | null) => void;
	isEditMode: boolean;
	setIsEditMode: (isEditMode: boolean) => void;
}

const NotesContext = React.createContext<INotesContext>({
	notes: [],
	selectedNoteId: null,
	setSelectedNoteId: (selectedNoteId: string | null) => {},
	addNote: async () => {
		const newNote: INote = {
			content: "",
			title: "New Note",
			dateEdited: new Date(),
			id: generateId(),
		};
		await addNote(newNote);
	},
	deleteNote: async (id) => {
		if (id) {
			await deleteNote(id);
		}
	},
	setNoteContent,
	isEditMode: false,
	setIsEditMode: (isEditMode: boolean) => {},
});

export default NotesContext;
