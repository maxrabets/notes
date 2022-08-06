import React, { FC } from "react";
import NotesContext from "../../NotesContext";
import { INote } from "../../types";
import "./NoteListItem.scss";

interface INoteListItemProps {
	note: INote;
	isSelected: boolean;
}

const NoteListItem: FC<INoteListItemProps> = ({ note, isSelected }) => {
	return (
		<NotesContext.Consumer>
			{({ setSelectedNoteId }) => (
				<div
					className={`note-list-item ${isSelected ? "selected" : ""}`}
					onClick={() => {
						if (setSelectedNoteId) setSelectedNoteId(note.id);
					}}
				>
					<p>{note.title}</p>
					<p>{note.dateEdited.toLocaleString()}</p>
				</div>
			)}
		</NotesContext.Consumer>
	);
};

export default NoteListItem;
