import { Helmet } from 'react-helmet';
import { NewNote } from './home/newNote';
import './home.css';
import { useEffect, useRef, useState } from 'react';
import { NoteList } from './home/noteList';
import { notes_list } from './data/notes';
import { NavBar } from './menu/navBar';
import { SideBar } from './menu/sideBar';
import { EditNote } from './home/editNote';
import { ErrorDialog } from './home/errorDialog';
import { getHeightClass } from './utils';

export default function App(props) {
  const { setIsLoggedIn } = props;
  const newNoterefs = {
    titleRef: useRef(null),
    contentRef: useRef(null),
  };

  const editNoteRefs = {
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
  const [defaultFooter, setDefaultFooter] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [notesListOptions, setNotesListOptions] = useState({
    showArchives: false,
    showTrash: false,
  });

  function createNote() {
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

  function handleHomeContainerClick(e) {
    const classes = [
      'navBarContainer',
      'homeContainer',
      'noteContainer',
      'notesContainer',
      'noteListContainer',
      'notes',
    ];

    if (isExpanded && classes.includes(e.target.className)) {
      createNote();
    }

    if (classes.includes(e.target.className)) {
      setIsSearchBarActive(false);
      setDefaultFooter(true);
    }
  }

  function saveEditedNote() {
    const noteId = editingNote.id;
    const { titleElem, contentElem } = editNoteRefs;

    setNotes((notes) => {
      let updatedOthers, updatedPinned;
      const title = editNoteDefaultText.title
        ? ''
        : titleElem.current.innerHTML;
      const content = editNoteDefaultText.content
        ? ''
        : contentElem.current.innerHTML;

      if (notes.others.hasOwnProperty(noteId)) {
        updatedOthers = {
          ...notes.others,
          [noteId]: {
            id: noteId,
            title: title,
            content: content,
            image: editingNote.image,
            heightClass: getHeightClass(contentElem, editingNote.image),
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
            image: editingNote.image,
            heightClass: getHeightClass(contentElem, editingNote.image),
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

  const handleKeyUp = (event) => {
    if (event.keyCode === 27) {
      if (isExpanded) {
        createNote();
      }
      if (editingNote) {
        saveEditedNote();
      }
      setIsSearchBarActive(false);
      setDefaultFooter(true);
    }
  };

  useEffect(() => {
    //TODO fetch the contents from the API here
    setNotes(notes_list);
  }, []);

  return (
    <div
      className="homeContainer"
      onClick={handleHomeContainerClick}
      onKeyUp={handleKeyUp}
      tabIndex="0"
    >
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
        setIsLoggedIn={setIsLoggedIn}
      ></NavBar>
      <div className="scrollableContent">
        <SideBar
          expanded={isSidebarExpanded}
          setNotesListOptions={setNotesListOptions}
        ></SideBar>
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
            defaultFooter={defaultFooter}
            setDefaultFooter={setDefaultFooter}
            setErrorMessage={setErrorMessage}
            notesListOptions={notesListOptions}
          ></NoteList>
        </div>
      </div>

      <div
        className={editingNote ? 'overlayContainer active' : 'overlayContainer'}
        onClick={saveEditedNote}
      ></div>

      {editingNote && (
        <EditNote
          ref={editNoteRefs}
          editingNote={editingNote}
          setEditingNote={setEditingNote}
          editNoteDefaultText={editNoteDefaultText}
          setEditNoteDefaultText={setEditNoteDefaultText}
        ></EditNote>
      )}

      {errorMessage && (
        <ErrorDialog
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        ></ErrorDialog>
      )}
    </div>
  );
}
