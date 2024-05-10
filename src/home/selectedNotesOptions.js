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

export function SelectedNotesOptions(props) {
  const { notes, setNotes, selectedNoteIds, setSelectedNoteIds } = props;
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

  function deleteNotes() {}

  function createNotesCopy() {}

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
        {allNotesPinned ? (
          <TbPinnedFilled onClick={unPinNotes}></TbPinnedFilled>
        ) : (
          <TbPinned onClick={pinNotes}></TbPinned>
        )}
        <MdOutlineColorLens onClick={toggleColorPicker}></MdOutlineColorLens>
        <BiArchiveIn onClick={archiveNotes}></BiArchiveIn>
        <CgMoreVerticalAlt onClick={toggleMoreOptions}></CgMoreVerticalAlt>
      </div>
    </div>
  );
}