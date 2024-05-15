import './trashEditNote.css';
import { MdOutlineRestoreFromTrash } from 'react-icons/md';
import { MdDeleteForever } from 'react-icons/md';
import { forwardRef, useEffect, useRef } from 'react';
import { restoreNoteFromTrash, deleteNoteFromTrash } from '../utils';

function FunctionComponent(props, ref) {
  const {
    trashEditingNote,
    setTrashEditingNote,
    gridView,
    setErrorMessage,
    notes,
    setNotes,
  } = props;

  const { titleElem, contentElem } = ref;
  const editNoteOuterContainerRef = useRef(null);
  const trashEditNoteImageRef = useRef(null);

  const { id, metaData, image } = trashEditingNote;

  useEffect(() => {
    if (image) {
      if (gridView)
        trashEditNoteImageRef.current.style.maxHeight = `${image.maxHeightForGridView}px`;
      else
        trashEditNoteImageRef.current.style.maxHeight = `${image.maxHeightForListView}px`;
    }
  }, [gridView, image]);

  useEffect(() => {
    if (metaData.backgroundColor !== 'transparent') {
      editNoteOuterContainerRef.current.style.backgroundColor =
        metaData.backgroundColor;
      editNoteOuterContainerRef.current.style.border = 'none';
    }
  }, [metaData]);

  useEffect(() => {
    if (trashEditingNote) {
      const { title, content } = trashEditingNote;
      contentElem.current.innerText = content;
      titleElem.current.innerText = title;
    }
  }, [contentElem, titleElem, trashEditingNote]);

  function processTrashEditNoteContainerClick() {
    setErrorMessage(`Can't edit in Trash`);
  }

  function processDeleteIconClick() {
    deleteNoteFromTrash(id, notes, setNotes);
    setTrashEditingNote(null);
  }

  function processRestoreIconClick() {
    restoreNoteFromTrash(id, notes, setNotes);
    setTrashEditingNote(null);
  }

  return (
    <div
      ref={editNoteOuterContainerRef}
      className="trashEditNoteOuterContainer"
    >
      <div className="trashEditNoteContainer">
        {trashEditingNote && trashEditingNote.image && (
          <img
            ref={trashEditNoteImageRef}
            className="image"
            src={trashEditingNote.image.src}
            alt="noteImage"
          />
        )}
        <div
          onClick={processTrashEditNoteContainerClick}
          ref={titleElem}
          className="noteTitle"
        ></div>
        <div
          onClick={processTrashEditNoteContainerClick}
          ref={contentElem}
          className="noteContent"
        ></div>
        <div className="noteFooter">
          <div>
            <MdDeleteForever onClick={processDeleteIconClick}></MdDeleteForever>
          </div>
          <div>
            <MdOutlineRestoreFromTrash
              onClick={processRestoreIconClick}
            ></MdOutlineRestoreFromTrash>
          </div>
        </div>
      </div>
    </div>
  );
}

const TrashEditingNote = forwardRef(FunctionComponent);
export { TrashEditingNote };
