import './editNote.css';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { MdOutlineColorLens } from 'react-icons/md';
import { BsImage } from 'react-icons/bs';
import { BiArchiveIn } from 'react-icons/bi';
import { BiUndo } from 'react-icons/bi';
import { BiRedo } from 'react-icons/bi';
import { CgMoreVerticalAlt } from 'react-icons/cg';
import { MdDelete } from 'react-icons/md';
import { archiveNote } from '../utils';

function FunctionComponent(props, ref) {
  const {
    editingNote,
    setEditingNote,
    editNoteDefaultText,
    setEditNoteDefaultText,
    saveEditedNote,
    notes,
    setNotes,
  } = props;

  const { titleElem, contentElem } = ref;

  const [backspaceStack, setBackspaceStack] = useState([]);
  const [backspaceText, setBackspaceText] = useState('');
  const [currentText, setCurrentText] = useState('');
  const [undoStack, setUndoStack] = useState([]);
  const [lastKeyPressTimestamp, setLastKeyPressTimestamp] = useState(null);
  const editNoteContainerRef = useRef(null);
  const imageUploadRef = useRef(null);

  useEffect(() => {
    const { metaData } = editingNote;
    if (metaData.backgroundColor !== 'transparent') {
      editNoteContainerRef.current.style.backgroundColor =
        metaData.backgroundColor;
      editNoteContainerRef.current.style.border = 'none';
    }
  }, [editingNote]);

  useEffect(() => {
    if (editingNote) {
      const { title, content } = editingNote;

      if (content.length > 0) {
        contentElem.current.innerHTML = content;
      } else {
        contentElem.current.innerHTML = 'Note';
        setEditNoteDefaultText((editNoteDefaultText) => {
          return { ...editNoteDefaultText, content: true };
        });
      }

      if (title.length > 0) {
        titleElem.current.innerHTML = title;
      } else {
        titleElem.current.innerHTML = 'Title';
        setEditNoteDefaultText((editNoteDefaultText) => {
          return { ...editNoteDefaultText, title: true };
        });
      }
    }
  }, [contentElem, editingNote, setEditNoteDefaultText, titleElem]);

  function handleKeyPressedTitle(e) {
    if (
      !editNoteDefaultText.title &&
      titleElem.current.innerHTML.length === 0
    ) {
      titleElem.current.innerHTML = 'Title';
      setEditNoteDefaultText((editNoteDefaultText) => {
        return { ...editNoteDefaultText, title: true };
      });
    }
  }

  function handleKeyPressedContent(e) {
    if (lastKeyPressTimestamp && Date.now() - lastKeyPressTimestamp > 500) {
      setUndoStack((undoStack) => {
        return [...undoStack, currentText];
      });
      const updatedCurrentText =
        contentElem.current.innerHTML[contentElem.current.innerHTML.length - 1];
      setCurrentText(updatedCurrentText);
    } else {
      const updatedCurrentText =
        currentText +
        contentElem.current.innerHTML[contentElem.current.innerHTML.length - 1];
      setCurrentText(updatedCurrentText);
    }

    setLastKeyPressTimestamp(Date.now());

    if (
      !editNoteDefaultText.content &&
      contentElem.current.innerHTML.length === 0
    ) {
      contentElem.current.innerHTML = 'Note';
      setEditNoteDefaultText((editNoteDefaultText) => {
        return { ...editNoteDefaultText, content: true };
      });
    }
  }

  function clearDefaultInputTitle() {
    if (editNoteDefaultText.title) {
      titleElem.current.innerHTML = '';
      setEditNoteDefaultText((editNoteDefaultText) => {
        return { ...editNoteDefaultText, title: false };
      });
    }
  }

  function clearDefaultInputContent() {
    if (editNoteDefaultText.content) {
      contentElem.current.innerHTML = '';
      setEditNoteDefaultText((editNoteDefaultText) => {
        return { ...editNoteDefaultText, content: false };
      });
    }
  }

  function deleteImage() {
    setEditingNote((editingNote) => {
      return { ...editingNote, image: null };
    });
  }

  function undoText() {
    let updatedText;

    if (backspaceText.length > 0) {
      contentElem.current.innerHTML += backspaceText;
      setBackspaceText('');
      return;
    }

    if (backspaceStack.length > 0) {
      contentElem.current.innerHTML +=
        backspaceStack[backspaceStack.length - 1];
      setBackspaceStack((backspaceStack) => {
        const updatedBackspaceStack = [...backspaceStack];
        updatedBackspaceStack.pop();
        setBackspaceStack(updatedBackspaceStack);
      });
      return;
    }

    if (undoStack.length === 0) {
      contentElem.current.innerHTML = editingNote.content;
      return;
    }

    updatedText = editingNote.content;
    for (const text of undoStack) {
      updatedText += text;
    }
    contentElem.current.innerHTML = updatedText;

    setUndoStack((undoStack) => {
      const updatedUndoStack = [...undoStack];
      updatedUndoStack.pop();
      return updatedUndoStack;
    });
    setLastKeyPressTimestamp(null);
    setCurrentText('');
  }

  function redoText() {}

  function handleKeyDown(e) {
    if (e.key === 'Backspace') {
      if (lastKeyPressTimestamp && Date.now() - lastKeyPressTimestamp > 500) {
        setBackspaceStack((backspaceStack) => {
          return [...backspaceStack, backspaceText];
        });
        setBackspaceText(
          contentElem.current.innerHTML[
            contentElem.current.innerHTML.length - 1
          ]
        );
      } else {
        const updatedBackspaceText =
          contentElem.current.innerHTML[
            contentElem.current.innerHTML.length - 1
          ] + backspaceText;
        setBackspaceText(updatedBackspaceText);
      }
      setLastKeyPressTimestamp(Date.now());
    }
  }

  function handleImageUpload() {}

  function handleArchiveButtonClick() {
    //TODO disable all menu options here
    const { id } = editingNote;
    archiveNote(id, notes, setNotes);
    setEditingNote(null);
  }

  return (
    <div
      ref={editNoteContainerRef}
      className={editingNote ? 'editNoteContainer active' : 'editNoteContainer'}
    >
      <input
        ref={imageUploadRef}
        type="file"
        style={{ display: 'none' }}
        onChange={handleImageUpload}
      />

      {editingNote && editingNote.image && (
        <div className="imageContainer">
          <MdDelete
            onClick={deleteImage}
            className="deleteImageIcon"
          ></MdDelete>
          <img className="image" src={editingNote.image.src} alt="noteImage" />
        </div>
      )}

      <div className="title-bar">
        <div
          contentEditable
          ref={titleElem}
          className="note-title"
          onKeyUp={handleKeyPressedTitle}
          onBeforeInput={clearDefaultInputTitle}
        ></div>
      </div>
      <div
        contentEditable
        ref={contentElem}
        className="note-content"
        onKeyUp={handleKeyPressedContent}
        onBeforeInput={clearDefaultInputContent}
        onKeyDown={handleKeyDown}
      ></div>
      <div className="note-footer">
        <div className="footerIcons">
          <MdOutlineColorLens />
          <BsImage
            onClick={() => {
              imageUploadRef.current.click();
            }}
          />
          <BiArchiveIn onClick={handleArchiveButtonClick} />
          <CgMoreVerticalAlt />
          <BiUndo onClick={undoText} />
          <BiRedo onClick={redoText} />
        </div>
        <div
          onClick={() => {
            saveEditedNote();
          }}
          className="closeButton"
        >
          Close
        </div>
      </div>
    </div>
  );
}

const EditNote = forwardRef(FunctionComponent);
export { EditNote };
