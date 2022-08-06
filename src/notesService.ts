import { INote } from "./types";
import { db } from "./db";

export const addNote = async (note: INote) => {
	await db.notes.add(note);
};

export const deleteNote = async (id: string) => {
	await db.notes.where("id").equals(id).delete();
};

export const setNoteContent = async (id: string | null, content: string) => {
	if (id) {
		await db.notes
			.where("id")
			.equals(id)
			.modify({ content, dateEdited: new Date() });
	}
};
