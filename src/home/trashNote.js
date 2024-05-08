import { useEffect, useRef, useState } from 'react';
import { scaleHeightToValues } from '../utils';
import { MdDeleteForever } from 'react-icons/md';
import { MdOutlineRestoreFromTrash } from 'react-icons/md';
import { RiCheckboxCircleFill } from 'react-icons/ri';

import './trashNote.css';
import { NoEncryption } from '@mui/icons-material';

export function TrashNote(props) {
  const { note, selectedNoteIds, setSelectedNoteIds, notes, setNotes } = props;
  const { id, title, content, heightClass, image } = note;

  const noteImageRef = useRef(null);
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const footerRefs = {
    deleteNoteTooltip: useRef(null),
    restoreNoteTooltip: useRef(null),
  };

  const isSelected = selectedNoteIds.has(note.id);

  useEffect(() => {
    if (image) {
      const scaledheight = scaleHeightToValues(image.height);
      noteImageRef.current.style.height = `${scaledheight}px`;
      noteImageRef.current.style.width = '250px';
    }
  }, [image]);

  useEffect(() => {
    titleRef.current.innerHTML = '';
    contentRef.current.innerHTML = '';

    if (title.length === 0 && content.length === 0) {
      titleRef.current.innerHTML = 'Empty Note';
      titleRef.current.style.color = 'grey';
      titleRef.current.style.fontSize = '20px';
      return;
    }

    titleRef.current.style.color = 'white';
    titleRef.current.style.fontSize = '14px';

    if (title.length > 0 && content.length > 0) {
      titleRef.current.innerHTML = title;
      contentRef.current.innerHTML = content;
      return;
    }

    if (title.length > 0) {
      titleRef.current.innerHTML = title;
      return;
    }

    titleRef.current.innerHTML = content;
  }, [content, id, title]);

  function handleNoteClick(e) {}

  function restoreNote() {
    const { others, trash } = notes;

    const updatedTrash = { ...trash };
    delete updatedTrash[id];

    const updatedOthers = { ...others, [id]: note };

    setNotes((notes) => {
      return {
        ...notes,
        others: updatedOthers,
        trash: updatedTrash,
      };
    });
  }

  function deleteNote() {
    const { trash } = notes;

    const updatedTrash = { ...trash };
    delete updatedTrash[id];

    setNotes((notes) => {
      return {
        ...notes,
        trash: updatedTrash,
      };
    });
  }

  function handleSelectIconClick() {
    setSelectedNoteIds((selectedNoteIds) => {
      const updatedSelectedNoteIds = new Set(selectedNoteIds);
      if (updatedSelectedNoteIds.has(note.id)) {
        updatedSelectedNoteIds.delete(note.id);
      } else {
        updatedSelectedNoteIds.add(note.id);
      }
      return updatedSelectedNoteIds;
    });
  }

  return (
    <div className={`outerContainer ${heightClass}`}>
      <div
        onClick={handleNoteClick}
        className={
          isSelected ? 'trashNoteContainer  selected' : 'trashNoteContainer'
        }
      >
        <div
          ref={footerRefs.deleteNoteTooltip}
          className="toolTip"
          style={{ bottom: '-20px', left: '0%' }}
        >
          Delete forever
        </div>
        <div
          ref={footerRefs.restoreNoteTooltip}
          className="toolTip"
          style={{ bottom: '-20px', left: '20%' }}
        >
          Restore
        </div>
        <div
          onClick={handleSelectIconClick}
          className={isSelected ? 'selectIcon show' : 'selectIcon'}
        >
          <RiCheckboxCircleFill
            style={{
              color: '#ffffff',
            }}
          />
        </div>
        {image && (
          <img
            class="trashNoteImage"
            ref={noteImageRef}
            src={image.src}
            alt="noteImage"
          />
        )}
        <div className="trashNoteTitleBar">
          <div ref={titleRef} className="trashNoteTitle"></div>
        </div>
        <div ref={contentRef} className="trashNoteContent"></div>
        <div
          className={isSelected ? 'trashNoteFooter' : 'trashNoteFooter show'}
        >
          <div
            onMouseOver={() => {
              footerRefs.deleteNoteTooltip.current.style.visibility = 'visible';
            }}
            onMouseOut={() => {
              footerRefs.deleteNoteTooltip.current.style.visibility = 'hidden';
            }}
            onClick={deleteNote}
          >
            <MdDeleteForever></MdDeleteForever>
          </div>
          <div
            onMouseOver={() => {
              footerRefs.restoreNoteTooltip.current.style.visibility =
                'visible';
            }}
            onMouseOut={() => {
              footerRefs.restoreNoteTooltip.current.style.visibility = 'hidden';
            }}
            onClick={restoreNote}
          >
            <MdOutlineRestoreFromTrash></MdOutlineRestoreFromTrash>
          </div>
        </div>
      </div>
    </div>
  );
}
