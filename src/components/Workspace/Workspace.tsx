import SimpleMDE from "react-simplemde-editor";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import EasyMDE from "easymde";
import { marked } from "marked";
import NotesContext from "../../NotesContext";
import { Position } from "codemirror";

import "./Workspace.scss";

const Workspace = () => {
	const { notes, selectedNoteId, setNoteContent, isEditMode } =
		useContext(NotesContext);
	const selectedNoteContent = useMemo(
		() => notes.find((note) => note.id === selectedNoteId)?.content || "",
		[notes, selectedNoteId]
	);
	const editorOptions: EasyMDE.Options = useMemo(() => {
		return {
			autofocus: false,
			previewRender() {
				return marked.parse(selectedNoteContent);
			},
		};
	}, [selectedNoteContent]);
	const [value, setValue] = useState(selectedNoteContent);
	const [cursor, setCursor] = useState<Position | null>(null);

	useEffect(() => {
		setValue(selectedNoteContent);
	}, [selectedNoteId]);

	const onChange = useCallback(
		async (value: string) => {
			setValue(value);
			await setNoteContent(selectedNoteId, value);
		},
		[selectedNoteId, cursor]
	);

	const getLineAndCursorCallback = useCallback(
		(position: Position) => {
			if (
				!(
					position.line === 0 &&
					position.ch === 0 &&
					position.sticky === null &&
					cursor
				)
			) {
				setCursor(position);
			}
		},
		[cursor]
	);

	const getMdeInstanceCallback = useCallback(
		(simpleMde: EasyMDE) => {
			if (!simpleMde?.codemirror.hasFocus()) {
				simpleMde?.codemirror.focus();
				if (cursor) {
					simpleMde?.codemirror.setCursor(cursor);
				}
			}
		},
		[cursor]
	);

	if (!isEditMode) {
		return (
			<div className="workspace">
				<div
					className="content"
					dangerouslySetInnerHTML={{
						__html: marked.parse(selectedNoteContent),
					}}
				/>
			</div>
		);
	}

	return (
		<div className="workspace">
			<SimpleMDE
				value={value}
				onChange={onChange}
				options={editorOptions}
				getMdeInstance={getMdeInstanceCallback}
				getLineAndCursor={getLineAndCursorCallback}
			/>
		</div>
	);
};

export default Workspace;
