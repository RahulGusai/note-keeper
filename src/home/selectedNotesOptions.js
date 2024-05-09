import { IoCloseSharp } from 'react-icons/io5';
import { TbPinned } from 'react-icons/tb';
import { TbPinnedFilled } from 'react-icons/tb';
import { MdOutlineColorLens } from 'react-icons/md';
import { BiArchiveIn } from 'react-icons/bi';
import { CgMoreVerticalAlt } from 'react-icons/cg';
import './selectedNotesOptions.css';
import { useEffect, useState } from 'react';

export function SelectedNotesOptions(props) {
  const { notes, setNotes, selectedNoteIds, setSelectedNoteIds } = props;
  const [allNotesPinned, setAllNotesPinned] = useState(false);

  useEffect(() => {
    const { others } = notes;
    let isNoteIdPresentInOthers = false;

    for (const noteId of selectedNoteIds) {
      if (others.hasOwnProperty(noteId)) {
        isNoteIdPresentInOthers = true;
        break;
      }
    }
    if (!isNoteIdPresentInOthers) {
      setAllNotesPinned(true);
    } else {
      setAllNotesPinned(false);
    }
  }, [notes, selectedNoteIds]);

  function handleCloseBarIconClick() {
    setSelectedNoteIds(new Set());
  }

  function archiveNotes() {
    const { others, pinned, archives } = notes;
    const updatedOthers = { ...others };
    const updatedPinned = { ...pinned };
    let updatedArchives = { ...archives };

    for (const noteId of selectedNoteIds) {
      if (others.hasOwnProperty(noteId)) {
        updatedArchives = {
          ...updatedArchives,
          [noteId]: updatedOthers[noteId],
        };
        delete updatedOthers[noteId];
      } else {
        updatedArchives = {
          ...updatedArchives,
          [noteId]: updatedPinned[noteId],
        };
        delete updatedPinned[noteId];
      }
    }

    setNotes((notes) => {
      return {
        ...notes,
        others: updatedOthers,
        pinned: updatedPinned,
        archives: updatedArchives,
      };
    });
    setSelectedNoteIds(new Set());
  }

  function pinNotes() {
    const { others, pinned } = notes;
    const updatedOthers = { ...others };
    let updatedPinned = { ...pinned };

    for (const noteId of selectedNoteIds) {
      if (others.hasOwnProperty(noteId)) {
        updatedPinned = {
          ...updatedPinned,
          [noteId]: updatedOthers[noteId],
        };
        delete updatedOthers[noteId];
      }
    }

    setNotes((notes) => {
      return {
        ...notes,
        others: updatedOthers,
        pinned: updatedPinned,
      };
    });
    setSelectedNoteIds(new Set());
  }

  function unPinNotes() {
    const { others, pinned } = notes;
    const updatedPinned = { ...pinned };
    let updatedOthers = { ...others };

    for (const noteId of selectedNoteIds) {
      updatedOthers = {
        ...updatedOthers,
        [noteId]: updatedPinned[noteId],
      };
      delete updatedPinned[noteId];
    }

    setNotes((notes) => {
      return {
        ...notes,
        others: updatedOthers,
        pinned: updatedPinned,
      };
    });
    setSelectedNoteIds(new Set());
  }

  return (
    <div
      className={`${
        selectedNoteIds.size === 0
          ? 'selectedNotesOptions'
          : 'selectedNotesOptions active'
      }`}
    >
      <IoCloseSharp
        onClick={handleCloseBarIconClick}
        className="closeBarIcon"
      ></IoCloseSharp>
      <div className="info">{`${selectedNoteIds.size} selected`}</div>
      <div className="noteOptions">
        {allNotesPinned ? (
          <TbPinnedFilled onClick={unPinNotes}></TbPinnedFilled>
        ) : (
          <TbPinned onClick={pinNotes}></TbPinned>
        )}
        <MdOutlineColorLens></MdOutlineColorLens>
        <BiArchiveIn onClick={archiveNotes}></BiArchiveIn>
        <CgMoreVerticalAlt></CgMoreVerticalAlt>
      </div>
    </div>
  );
}
