import { Button } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useCallback, useState } from "react";
import { INote } from "../../types";
import NoteListItem from "../NoteListItem/NoteListItem";
import "./Sidebar.scss";
import { generateId } from "../../utils";

const Sidebar = () => {
	const [notes, setNotes] = useState<INote[]>([]);
	const [selectedNoteId, setSelectedNoteId] = useState<string>();

	const onAdd = useCallback(() => {
		setNotes((notes) =>
			notes.concat({
				title: "New note",
				dateEdited: new Date(),
				id: generateId(),
			})
		);
	}, []);

	const onDelete = useCallback(() => {
		if (selectedNoteId) {
			setNotes((notes) => {
				const deleteCount = 1;
				const newNotes = notes.slice();
				const index = newNotes.findIndex((note) => note.id === selectedNoteId);
				newNotes.splice(index, deleteCount);

				return newNotes;
			});
		}
	}, [selectedNoteId]);

	return (
		<div className="sidebar">
			<div className="sidebar-buttons">
				<Button
					type="primary"
					shape="circle"
					icon={<PlusOutlined />}
					onClick={onAdd}
				/>
				<Button
					type="primary"
					shape="circle"
					icon={<DeleteOutlined />}
					onClick={onDelete}
				/>
			</div>
			{notes.map((note) => (
				<NoteListItem
					note={note}
					key={note.id}
					isSelected={selectedNoteId === note.id}
					onClick={() => {
						setSelectedNoteId(note.id);
					}}
				/>
			))}
		</div>
	);
};

export default Sidebar;
