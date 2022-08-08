import SimpleMDE from "react-simplemde-editor";
import {
	ChangeEvent,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import EasyMDE from "easymde";
import { marked } from "marked";
import { Position } from "codemirror";
import NotesContext from "../../NotesContext";
import { setNoteTitle } from "../../notesService";
import { Highlighter } from "../../Highliter";

import "./Workspace.scss";

const Workspace = () => {
	const { notes, selectedNoteId, setNoteContent, isEditMode } =
		useContext(NotesContext);
	const selectedNote = useMemo(
		() => notes.find((note) => note.id === selectedNoteId),
		[notes, selectedNoteId]
	);
	const selectedNoteContent = useMemo(
		() => selectedNote?.content || "",
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
	const [content, setContent] = useState(selectedNoteContent);
	const [title, setTitle] = useState(selectedNote?.title);
	const [searchValue, setSearchValue] = useState("");
	const [cursor, setCursor] = useState<Position | null>(null);
	const highlighter = new Highlighter(".contentArea");

	useEffect(() => {
		setContent(selectedNoteContent);
		if (selectedNote) {
			setTitle(selectedNote.title);
		}
	}, [selectedNoteId]);

	const onContentChange = useCallback(
		async (value: string) => {
			setContent(value);
			await setNoteContent(selectedNoteId, value);
		},
		[selectedNoteId]
	);

	const onTitleChange = useCallback(
		async (e: ChangeEvent<HTMLInputElement>) => {
			setTitle(e.target.value);
			await setNoteTitle(selectedNoteId, e.target.value);
		},
		[selectedNoteId]
	);

	const onSearchValueChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value;
			setSearchValue(value);
			highlighter.apply(value);
		},
		[selectedNoteId]
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

	return (
		<div className="workspace">
			<div className="title-and-search">
				<div className="title">
					<label>Title: </label>
					<Input value={title} onChange={onTitleChange} />
				</div>
				<div className="search">
					<label>Search: </label>
					<Input
						value={searchValue}
						onChange={onSearchValueChange}
						prefix={<SearchOutlined />}
					/>
				</div>
			</div>
			<div className="contentArea">
				{isEditMode ? (
					<SimpleMDE
						className="editor"
						value={content}
						onChange={onContentChange}
						options={editorOptions}
						getMdeInstance={getMdeInstanceCallback}
						getLineAndCursor={getLineAndCursorCallback}
					/>
				) : (
					<div
						className="content"
						dangerouslySetInnerHTML={{
							__html: marked.parse(selectedNoteContent),
						}}
					/>
				)}
			</div>
		</div>
	);
};

export default Workspace;
