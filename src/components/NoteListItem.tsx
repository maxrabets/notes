import { FC } from "react";
import { INote } from "../types";

interface INoteListItemProps {
	note: INote;
}

const NoteListItem: FC<INoteListItemProps> = ({ note }) => {
	return <div>{note.title}</div>;
};

export default NoteListItem;
