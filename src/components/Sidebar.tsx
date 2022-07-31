import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useCallback, useState } from "react";
import { INote } from "../types";
import NoteListItem from "./NoteListItem";

const Sidebar = () => {
	const [notes, setNotes] = useState<INote[]>([]);

	const onAdd = useCallback(() => {
		setNotes((notes) => notes.concat({ title: notes.length.toString() }));
	}, []);

	return (
		<div>
			<Button
				type="primary"
				shape="circle"
				icon={<PlusOutlined />}
				onClick={onAdd}
			/>
			{notes.map((note) => (
				<NoteListItem note={note} key={note.title} />
			))}
		</div>
	);
};

export default Sidebar;
