import { Helmet } from 'react-helmet';
import { NewNote } from './home/newNote';
import './home.css';
import { useEffect, useRef, useState } from 'react';
import { NoteList } from './home/noteList';
import { notes_list } from './data/notes';
import { NavBar } from './menu/navBar';
import { SideBar } from './menu/sideBar';
import { EditNote } from './home/editNote';
import { countLines } from './utils';

export default function App() {
  const newNoterefs = {
    titleRef: useRef(null),
    contentRef: useRef(null),
  };

  const editNoterefs = {
    titleElem: useRef(null),
    contentElem: useRef(null),
  };

  const [isExpanded, setIsExpanded] = useState(false);
  const [editingNote, setEditingNote] = useState(false);
  const [notes, setNotes] = useState([]);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isDefaultTextLoaded, setisDefaultTextLoaded] = useState({
    content: true,
    title: true,
  });
  const [editNoteDefaultText, setEditNoteDefaultText] = useState({
    content: false,
    title: false,
  });
  const [latestNoteId, setLatestNoteId] = useState(null);
  const [selectedNoteIds, setSelectedNoteIds] = useState(new Set());
  const [isSearchBarActive, setIsSearchBarActive] = useState(false);

  function getHeightClass(contentRef) {
    const numberOfLines = countLines(contentRef.current.innerHTML);

    if (numberOfLines <= 2) return 'short';
    if (numberOfLines > 2 && numberOfLines <= 5) return 'tall';
    if (numberOfLines > 5 && numberOfLines <= 8) return 'taller';
    if (numberOfLines > 8) return 'tallest';
  }

  function handleHomeContainerClick(e) {
    const classes = [
      'navBarContainer',
      'homeContainer',
      'noteContainer',
      'notesContainer',
      'noteListContainer',
    ];

    if (isExpanded && classes.includes(e.target.className)) {
      const { titleRef, contentRef } = newNoterefs;

      if (!isDefaultTextLoaded.title || !isDefaultTextLoaded.content) {
        const newNoteId = Math.floor(Math.random() * 1000) + 1;
        const updatedOthers = {
          ...notes.others,
          [newNoteId]: {
            heightClass: getHeightClass(contentRef),
            id: newNoteId,
            title: isDefaultTextLoaded.title ? '' : titleRef.current.innerHTML,
            content: isDefaultTextLoaded.content
              ? ''
              : contentRef.current.innerHTML,
          },
        };
        setNotes((notes) => {
          return {
            ...notes,
            others: updatedOthers,
          };
        });
        setLatestNoteId(newNoteId);
      }

      setIsExpanded(false);
    }

    if (classes.includes(e.target.className)) {
      setIsSearchBarActive(false);
    }
  }

  function saveEditedNote() {
    const noteId = editingNote.id;

    setNotes((notes) => {
      let updatedOthers, updatedPinned;
      const title = editNoteDefaultText.title
        ? ''
        : editNoterefs.titleElem.current.innerHTML;
      const content = editNoteDefaultText.content
        ? ''
        : editNoterefs.contentElem.current.innerHTML;

      if (notes.others.hasOwnProperty(noteId)) {
        updatedOthers = {
          ...notes.others,
          [noteId]: {
            id: noteId,
            title: title,
            content: content,
            heightClass: getHeightClass(editNoterefs.contentElem),
          },
        };
        updatedPinned = { ...notes.pinned };
      } else {
        updatedPinned = {
          ...notes.pinned,
          [noteId]: {
            id: noteId,
            title: title,
            content: content,
            heightClass: getHeightClass(editNoterefs.contentElem),
          },
        };
        updatedOthers = { ...notes.others };
      }

      return {
        ...notes,
        others: updatedOthers,
        pinned: updatedPinned,
      };
    });

    setEditingNote(null);
    setEditNoteDefaultText((editNoteDefaultText) => {
      return {
        ...editNoteDefaultText,
        content: false,
        title: false,
      };
    });
  }

  useEffect(() => {
    //TODO fetch the contents from the API here
    setNotes(notes_list);
  }, []);

  return (
    <div className="homeContainer" onClick={handleHomeContainerClick}>
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossorigin
        ></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Slab&display=swap"
          rel="stylesheet"
        ></link>
      </Helmet>
      <NavBar
        sidebarState={isSidebarExpanded}
        changeSidebarState={setIsSidebarExpanded}
        isSearchBarActive={isSearchBarActive}
        setIsSearchBarActive={setIsSearchBarActive}
      ></NavBar>
      <div className="scrollableContent">
        <SideBar expanded={isSidebarExpanded}></SideBar>
        <div className="notesContainer">
          <NewNote
            ref={newNoterefs}
            isExpanded={isExpanded}
            setIsExpanded={setIsExpanded}
            isDefaultTextLoaded={isDefaultTextLoaded}
            setisDefaultTextLoaded={setisDefaultTextLoaded}
          ></NewNote>
          <NoteList
            setEditingNote={setEditingNote}
            notes={notes}
            latestNoteId={latestNoteId}
            selectedNoteIds={selectedNoteIds}
            setSelectedNoteIds={setSelectedNoteIds}
            setNotes={setNotes}
          ></NoteList>
        </div>
      </div>

      <div
        className={editingNote ? 'overlayContainer active' : 'overlayContainer'}
        onClick={saveEditedNote}
      ></div>
      <EditNote
        ref={editNoterefs}
        editingNote={editingNote}
        editNoteDefaultText={editNoteDefaultText}
        setEditNoteDefaultText={setEditNoteDefaultText}
      ></EditNote>
    </div>
  );
}
