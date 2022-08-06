import { Button, Modal } from "antd";
import {
	PlusOutlined,
	DeleteOutlined,
	EditOutlined,
	EyeOutlined,
} from "@ant-design/icons";
import { useCallback, useContext, useState } from "react";
import NoteListItem from "../NoteListItem/NoteListItem";
import NotesContext from "../../NotesContext";

import "./Sidebar.scss";

const Sidebar = () => {
	const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] =
		useState(false);
	const {
		notes,
		selectedNoteId,
		addNote,
		deleteNote,
		isEditMode,
		setIsEditMode,
	} = useContext(NotesContext);

	const toggleEdit = useCallback(() => {
		setIsEditMode(!isEditMode);
	}, [isEditMode]);

	const onDeleteNote = useCallback(async () => {
		await deleteNote(selectedNoteId);
		setIsDeleteConfirmationModalOpen(false);
	}, [selectedNoteId]);

	const openDeleteConfirmationModal = useCallback(() => {
		setIsDeleteConfirmationModalOpen(true);
	}, []);

	const closeDeleteConfirmationModal = useCallback(() => {
		setIsDeleteConfirmationModalOpen(false);
	}, []);

	return (
		<div className="sidebar">
			<div className="sidebar-buttons">
				<Button shape="circle" icon={<PlusOutlined />} onClick={addNote} />
				{selectedNoteId && (
					<Button
						shape="circle"
						icon={<DeleteOutlined />}
						onClick={openDeleteConfirmationModal}
					/>
				)}
				{selectedNoteId && (
					<Button
						shape="circle"
						icon={isEditMode ? <EyeOutlined /> : <EditOutlined />}
						onClick={toggleEdit}
					/>
				)}
			</div>
			<div className="notes-list">
				{notes
					?.sort(
						(note1, note2) =>
							note2.dateEdited.getTime() - note1.dateEdited.getTime()
					)
					.map((note) => (
						<NoteListItem
							note={note}
							key={note.id}
							isSelected={selectedNoteId === note.id}
						/>
					))}
			</div>
			<Modal
				title="Confirmation"
				visible={isDeleteConfirmationModalOpen}
				onOk={onDeleteNote}
				onCancel={closeDeleteConfirmationModal}
			>
				{`Confirm you want to delete note	${
					notes?.find((note) => note.id === selectedNoteId)?.title
				}`}
			</Modal>
		</div>
	);
};

export default Sidebar;
