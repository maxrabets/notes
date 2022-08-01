import { Button, Modal } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useCallback, useState } from "react";
import { INote } from "../../types";
import NoteListItem from "../NoteListItem/NoteListItem";
import { generateId } from "../../utils";
import "./Sidebar.scss";

const Sidebar = () => {
	const [notes, setNotes] = useState<INote[]>([]);
	const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
	const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] =
		useState(false);

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
		setSelectedNoteId(null);
		setIsDeleteConfirmationModalOpen(false);
	}, [selectedNoteId]);

	const openDeleteConfirmationModal = useCallback(() => {
		if (selectedNoteId) {
			setIsDeleteConfirmationModalOpen(true);
		}
	}, [selectedNoteId]);

	const closeDeleteConfirmationModal = useCallback(() => {
		setIsDeleteConfirmationModalOpen(false);
	}, []);

	return (
		<div className="sidebar">
			<div className="sidebar-buttons">
				<Button
					type="primary"
					shape="circle"
					icon={<PlusOutlined />}
					onClick={onAdd}
				/>
				{selectedNoteId && (
					<Button
						type="primary"
						shape="circle"
						icon={<DeleteOutlined />}
						onClick={openDeleteConfirmationModal}
					/>
				)}
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
			<Modal
				title="Confirmation"
				visible={isDeleteConfirmationModalOpen}
				onOk={onDelete}
				onCancel={closeDeleteConfirmationModal}
			>
				{`Confirm you want to delete note	${
					notes.find((note) => note.id === selectedNoteId)?.title
				}`}
			</Modal>
		</div>
	);
};

export default Sidebar;
