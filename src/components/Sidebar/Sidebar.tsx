import { Button, Modal } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useLiveQuery } from "dexie-react-hooks";
import { useCallback, useState } from "react";
import NoteListItem from "../NoteListItem/NoteListItem";
import { generateId } from "../../utils";
import { db } from "../../db";

import "./Sidebar.scss";

const Sidebar = () => {
	const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
	const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] =
		useState(false);
	const notes = useLiveQuery(() => db.notes.toArray(), []);

	const onAdd = useCallback(async () => {
		const newNote = {
			title: "New note",
			dateEdited: new Date(),
			id: generateId(),
		};

		await db.notes.add(newNote);
	}, []);

	const onDelete = useCallback(async () => {
		if (selectedNoteId) {
			await db.notes.where("id").equals(selectedNoteId).delete();
			setSelectedNoteId(null);
		}
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
			{notes?.map((note) => (
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
					notes?.find((note) => note.id === selectedNoteId)?.title
				}`}
			</Modal>
		</div>
	);
};

export default Sidebar;
