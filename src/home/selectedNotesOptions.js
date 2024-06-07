import { IoCloseSharp } from 'react-icons/io5';
import { TbPinned } from 'react-icons/tb';
import { TbPinnedFilled } from 'react-icons/tb';
import { MdOutlineColorLens } from 'react-icons/md';
import { BiArchiveIn } from 'react-icons/bi';
import { CgMoreVerticalAlt } from 'react-icons/cg';
import './selectedNotesOptions.css';
import { useEffect, useState } from 'react';
import { GiPlainCircle } from 'react-icons/gi';
import { MdInvertColorsOff } from 'react-icons/md';
import { MdOutlineUnarchive } from 'react-icons/md';
import { MdDeleteForever } from 'react-icons/md';
import { MdOutlineRestoreFromTrash } from 'react-icons/md';
import { deleteNoteFromTrash } from '../utils';

export function SelectedNotesOptions(props) {
  const {
    notes,
    setNotes,
    selectedNoteIds,
    setSelectedNoteIds,
    notesListOptions,
    latestNoteId,
    setLatestNoteId,
  } = props;
  const { showArchives, showTrash } = notesListOptions;
  const [allNotesPinned, setAllNotesPinned] = useState(false);
  const [noteOptions, setNoteOptions] = useState({
    showColorPicker: false,
    showMoreOptions: false,
  });

  useEffect(() => {
    if (selectedNoteIds.size === 0) {
      setNoteOptions((noteOptions) => {
        return {
          ...noteOptions,
          showColorPicker: false,
          showMoreOptions: false,
        };
      });
    }
  }, [selectedNoteIds]);

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
        if (latestNoteId) setLatestNoteId(null);
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

  function unArchiveNotes() {
    const { others, archives } = notes;
    let updatedOthers = { ...others };
    const updatedArchives = { ...archives };

    for (const noteId of selectedNoteIds) {
      updatedOthers = { ...updatedOthers, [noteId]: updatedArchives[noteId] };
      delete updatedArchives[noteId];
    }

    setNotes((notes) => {
      return {
        ...notes,
        others: updatedOthers,
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
        if (latestNoteId) setLatestNoteId(null);
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

  function updateBackgroundColor(color) {
    const { others, pinned } = notes;
    let updatedOthers = { ...others };
    let updatedPinned = { ...pinned };

    for (const noteId of selectedNoteIds) {
      if (others.hasOwnProperty(noteId)) {
        const updatedNote = {
          ...others[noteId],
          metaData: {
            backgroundColor: color,
          },
        };
        updatedOthers = { ...updatedOthers, [noteId]: updatedNote };
      } else {
        const updatedNote = {
          ...pinned[noteId],
          metaData: {
            backgroundColor: color,
          },
        };
        updatedPinned = { ...updatedPinned, [noteId]: updatedNote };
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

  function toggleColorPicker() {
    setNoteOptions((noteOptions) => {
      return {
        ...noteOptions,
        showColorPicker: !noteOptions.showColorPicker,
        showMoreOptions: false,
      };
    });
  }

  function toggleMoreOptions() {
    setNoteOptions((noteOptions) => {
      return {
        ...noteOptions,
        showColorPicker: false,
        showMoreOptions: !noteOptions.showMoreOptions,
      };
    });
  }

  function deleteNotes() {
    const { others, pinned, archives, trash } = notes;
    let updatedOthers = { ...others };
    let updatedPinned = { ...pinned };
    let updatedArchives = { ...archives };
    let updatedTrash = { ...trash };

    for (const noteId of selectedNoteIds) {
      if (others.hasOwnProperty(noteId)) {
        updatedTrash = { ...updatedTrash, [noteId]: updatedOthers[noteId] };
        delete updatedOthers[noteId];
        if (latestNoteId) setLatestNoteId(null);
      } else if (pinned.hasOwnProperty(noteId)) {
        updatedTrash = { ...updatedTrash, [noteId]: updatedPinned[noteId] };
        delete updatedPinned[noteId];
      } else {
        updatedTrash = { ...updatedTrash, [noteId]: updatedArchives[noteId] };
        delete updatedArchives[noteId];
      }
    }

    setNotes((notes) => {
      return {
        ...notes,
        others: updatedOthers,
        pinned: updatedPinned,
        archives: updatedArchives,
        trash: updatedTrash,
      };
    });
    setSelectedNoteIds(new Set());
  }

  function createNotesCopy() {
    const { others, pinned, archives } = notes;
    let updatedOthers = { ...others };
    let newNote;

    for (const noteId of selectedNoteIds) {
      const newNoteId = Math.floor(Math.random() * 1000) + 1;
      if (others.hasOwnProperty(noteId)) {
        newNote = { ...others[noteId], id: newNoteId };
      } else if (pinned.hasOwnProperty(noteId)) {
        newNote = { ...pinned[noteId], id: newNoteId };
      } else {
        newNote = { ...archives[noteId], id: newNoteId };
      }

      updatedOthers = { ...updatedOthers, [newNoteId]: newNote };
    }

    setNotes((notes) => {
      return {
        ...notes,
        others: updatedOthers,
      };
    });
    setSelectedNoteIds(new Set());
  }

  function deleteNotesForever() {
    for (const noteId of selectedNoteIds) {
      deleteNoteFromTrash(noteId, setNotes);
      // delete updatedTrash[noteId];
    }

    // setNotes((notes) => {
    //   return {
    //     ...notes,
    //     trash: updatedTrash,
    //   };
    // });

    setSelectedNoteIds(new Set());
  }

  function restoreNotes() {
    const { others, trash } = notes;

    const updatedTrash = { ...trash };
    let updatedOthers = { ...others };

    for (const noteId of selectedNoteIds) {
      updatedOthers = { ...updatedOthers, [noteId]: updatedTrash[noteId] };
      delete updatedTrash[noteId];
    }

    setNotes((notes) => {
      return {
        ...notes,
        others: updatedOthers,
        trash: updatedTrash,
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
      <div
        className={
          noteOptions.showColorPicker ? 'colorPicker active' : 'colorPicker'
        }
      >
        <MdInvertColorsOff></MdInvertColorsOff>
        <GiPlainCircle
          onClick={() => updateBackgroundColor('coral')}
          style={{ color: 'coral' }}
        ></GiPlainCircle>
        <GiPlainCircle
          onClick={() => updateBackgroundColor('white')}
          style={{ color: 'white' }}
        ></GiPlainCircle>
        <GiPlainCircle
          onClick={() => updateBackgroundColor('red')}
          style={{ color: 'red' }}
        ></GiPlainCircle>
        <GiPlainCircle
          onClick={() => {
            updateBackgroundColor('brown');
          }}
          style={{ color: 'brown' }}
        ></GiPlainCircle>
        <GiPlainCircle
          onClick={() => updateBackgroundColor('teal')}
          style={{ color: 'teal' }}
        ></GiPlainCircle>
        <GiPlainCircle
          onClick={() => updateBackgroundColor('purple')}
          style={{ color: 'purple' }}
        ></GiPlainCircle>
        <GiPlainCircle
          onClick={() => updateBackgroundColor('pink')}
          style={{ color: 'pink' }}
        ></GiPlainCircle>
        <GiPlainCircle
          onClick={() => updateBackgroundColor('blue')}
          style={{ color: 'blue' }}
        ></GiPlainCircle>
        <GiPlainCircle
          onClick={() => updateBackgroundColor('skyblue')}
          style={{ color: 'skyblue' }}
        ></GiPlainCircle>
      </div>

      <div
        className={`${
          noteOptions.showMoreOptions
            ? 'moreOptionsMenu show'
            : 'moreOptionsMenu'
        }`}
      >
        <div onClick={deleteNotes}>{`Delete note${
          selectedNoteIds.size > 1 ? 's' : ''
        }`}</div>
        <div onClick={createNotesCopy}>Make a copy</div>
      </div>

      <IoCloseSharp
        onClick={handleCloseBarIconClick}
        className="closeBarIcon"
      ></IoCloseSharp>
      <div className="info">{`${selectedNoteIds.size} selected`}</div>
      <div className="noteOptions">
        {!showTrash ? (
          <>
            {allNotesPinned ? (
              <TbPinnedFilled onClick={unPinNotes}></TbPinnedFilled>
            ) : (
              <TbPinned onClick={pinNotes}></TbPinned>
            )}
            <MdOutlineColorLens
              onClick={toggleColorPicker}
            ></MdOutlineColorLens>
            {showArchives ? (
              <MdOutlineUnarchive onClick={unArchiveNotes}></MdOutlineUnarchive>
            ) : (
              <BiArchiveIn onClick={archiveNotes} />
            )}
            <CgMoreVerticalAlt onClick={toggleMoreOptions}></CgMoreVerticalAlt>
          </>
        ) : (
          <>
            <MdDeleteForever onClick={deleteNotesForever}></MdDeleteForever>
            <MdOutlineRestoreFromTrash
              onClick={restoreNotes}
            ></MdOutlineRestoreFromTrash>
          </>
        )}
      </div>
    </div>
  );
}
