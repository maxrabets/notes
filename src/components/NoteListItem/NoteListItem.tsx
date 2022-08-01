import { FC } from "react";
import { INote } from "../../types";
import "./NoteListItem.scss";

interface INoteListItemProps {
	note: INote;
	isSelected: boolean;
	onClick: () => void;
}

const NoteListItem: FC<INoteListItemProps> = ({
	note,
	isSelected,
	onClick,
}) => {
	return (
		<div
			className={`note-list-item ${isSelected ? "selected" : ""}`}
			onClick={onClick}
		>
			<p>{note.title}</p>
			<p>{note.dateEdited.toLocaleString()}</p>
		</div>
	);
};

export default NoteListItem;
