import { useEffect, useRef, useState } from 'react';
import { MdOutlineColorLens } from 'react-icons/md';
import { BsImage } from 'react-icons/bs';
import { BiArchiveIn } from 'react-icons/bi';
import { BiUndo } from 'react-icons/bi';
import { BiRedo } from 'react-icons/bi';
import { CgMoreVerticalAlt } from 'react-icons/cg';
import { TbPinned } from 'react-icons/tb';
import { RiCheckboxCircleFill } from 'react-icons/ri';

import './note.css';

export function Note(props) {
  const {
    note,
    setEditingNote,
    selectedNoteIds,
    setSelectedNoteIds,
    notes,
    setNotes,
  } = props;
  const { id, title, content, heightClass } = note;

  const titleRef = useRef(null);
  const contentRef = useRef(null);

  const rowSpanToHeight = {
    short: 'short-height',
    tall: 'tall-height',
    taller: 'taller-height',
    tallest: 'tallest-height',
  };
  const isSelected = selectedNoteIds.has(note.id);

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

  function handleNoteClick(e) {
    if (isSelected) {
      setSelectedNoteIds((selectedNoteIds) => {
        const updatedSelectedNoteIds = new Set(selectedNoteIds);
        updatedSelectedNoteIds.delete(note.id);
        return updatedSelectedNoteIds;
      });
      return;
    }

    if (selectedNoteIds.size > 0) {
      setSelectedNoteIds((selectedNoteIds) => {
        const updatedSelectedNoteIds = new Set(selectedNoteIds);
        updatedSelectedNoteIds.add(note.id);
        return updatedSelectedNoteIds;
      });
      return;
    }

    setEditingNote((editingNote) => {
      return {
        ...editingNote,
        id: id,
        title: title,
        content: content,
        defaultText: {
          title: false,
          content: false,
        },
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

  function handlePinIconClick(e) {
    const { others, pinned } = notes;
    if (others.hasOwnProperty(id)) {
      const pinnedNote = others[id];
      const updatedOthers = { ...others };
      const updatedPinned = { ...pinned };
      delete updatedOthers[id];
      updatedPinned[id] = pinnedNote;
      setNotes({ others: updatedOthers, pinned: updatedPinned });
    } else {
      const otherNote = pinned[id];
      const updatedOthers = { ...others };
      const updatedPinned = { ...pinned };
      delete updatedPinned[id];
      updatedOthers[id] = otherNote;
      setNotes({ others: updatedOthers, pinned: updatedPinned });
    }
    e.stopPropagation();
  }

  return (
    <div className={`outerContainer ${heightClass}`}>
      <div className={isSelected ? 'noteContainer selected' : 'noteContainer'}>
        <div
          className={isSelected ? 'selectIcon show' : 'selectIcon'}
          style={{
            backgroundColor: 'transparent',
          }}
          onClick={handleSelectIconClick}
        >
          <RiCheckboxCircleFill
            style={{
              color: '#ffffff',
            }}
          />
        </div>
        <div className="title-bar" onClick={handleNoteClick}>
          <div ref={titleRef} className="note-title"></div>
          <div
            className={isSelected ? 'pinIcon' : 'pinIcon show'}
            style={{
              backgroundColor: '#202124',
            }}
            onClick={handlePinIconClick}
          >
            <TbPinned
              style={{
                color: '#ffffff',
              }}
            />
          </div>
        </div>
        <div
          ref={contentRef}
          className={`note-content ${rowSpanToHeight[heightClass]}`}
          onClick={handleNoteClick}
        ></div>
        <div className={isSelected ? 'noteFooter' : 'noteFooter show'}>
          <div
            style={{
              backgroundColor: '#202124',
            }}
          >
            <MdOutlineColorLens
              style={{
                color: '#ffffff',
              }}
            />
          </div>
          <div
            style={{
              backgroundColor: '#202124',
            }}
          >
            <BsImage
              style={{
                color: '#ffffff',
              }}
            />
          </div>
          <div
            style={{
              backgroundColor: '#202124',
            }}
          >
            <BiArchiveIn
              style={{
                color: '#ffffff',
              }}
            />
          </div>
          <div
            style={{
              backgroundColor: '#202124',
            }}
          >
            <CgMoreVerticalAlt
              style={{
                color: '#ffffff',
              }}
            />
          </div>
          <div
            style={{
              backgroundColor: '#202124',
            }}
          >
            <BiUndo
              style={{
                color: '#ffffff',
              }}
            />
          </div>
          <div
            style={{
              backgroundColor: '#202124',
            }}
          >
            <BiRedo
              style={{
                color: '#ffffff',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
