import Dexie, { Table } from "dexie";
import { INote } from "./types";

const VERSION_NUMBER = 1;

export class NotesDexie extends Dexie {
	notes!: Table<INote>;

	constructor() {
		super("notesDatabase");
		this.version(VERSION_NUMBER).stores({
			notes: "++id, name, age",
		});
	}
}

export const db = new NotesDexie();
