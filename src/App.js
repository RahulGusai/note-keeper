import { Helmet } from 'react-helmet';
import { NewNote } from './home/newNote';
import './home.css';
import { useEffect, useRef, useState } from 'react';
import { NoteList } from './home/noteList';
import { notes_list } from './data/notes';
import { NavBar } from './menu/navBar';
import { SideBar } from './menu/sideBar';
import { EditNote } from './home/editNote';
import { TrashEditingNote } from './home/trashEditNote';
import { ErrorDialog } from './home/errorDialog';
import { getHeightClass } from './utils';
import { SelectedNotesOptions } from './home/selectedNotesOptions';

export default function App(props) {
  const { setIsLoggedIn, userNotes } = props;
  const newNoterefs = {
    titleRef: useRef(null),
    contentRef: useRef(null),
  };

  const editNoteRefs = {
    titleElem: useRef(null),
    contentElem: useRef(null),
  };

  const [isExpanded, setIsExpanded] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [trashEditingNote, setTrashEditingNote] = useState(null);
  const [notes, setNotes] = useState(userNotes);
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
  const [gridView, setGridView] = useState(true);

  const [navBarOptions, setNavBarOptions] = useState({
    showUserProfileDialog: false,
    showSettingsDialog: false,
  });

  function createNote() {
    const { titleRef, contentRef } = newNoterefs;

    if (!isDefaultTextLoaded.title || !isDefaultTextLoaded.content) {
      const newNoteId = Math.floor(Math.random() * 1000) + 1;
      const [heightClassForGridView, heightClassForListView] =
        getHeightClass(contentRef);

      const updatedOthers = {
        ...notes.others,
        [newNoteId]: {
          id: newNoteId,
          heightClass: {
            gridView: heightClassForGridView,
            listView: heightClassForListView,
          },
          title: isDefaultTextLoaded.title ? '' : titleRef.current.innerText,
          content: isDefaultTextLoaded.content
            ? ''
            : contentRef.current.innerText,
          metaData: {
            backgroundColor: 'transparent',
          },
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
    const bodyClasses = [
      'sideBarContainer',
      'navBarContainer',
      'homeContainer',
      'noteContainer',
      'notesContainer',
      'noteListContainer',
      'notes gridView',
      'notes listView',
      'note-content',
    ];

    if (isExpanded && bodyClasses.includes(e.target.className)) {
      createNote();
    }

    if (bodyClasses.includes(e.target.className)) {
      setIsSearchBarActive(false);
      setDefaultFooter(true);
      setNavBarOptions((navBarOptions) => {
        return {
          ...navBarOptions,
          showSettingsDialog: false,
          showUserProfileDialog: false,
        };
      });
    }

    const noteListContainerClasses = [
      'homeContainer',
      'notesContainer',
      'noteListContainer',
      'notes gridView',
      'notes listView',
    ];

    if (noteListContainerClasses.includes(e.target.className)) {
      setSelectedNoteIds(new Set());
    }
  }

  function saveEditedNote() {
    const { id, metaData } = editingNote;
    const { titleElem, contentElem } = editNoteRefs;
    const { others, pinned } = notes;

    setNotes((notes) => {
      let updatedOthers, updatedPinned;
      const title = editNoteDefaultText.title
        ? ''
        : titleElem.current.innerText;
      const content = editNoteDefaultText.content
        ? ''
        : contentElem.current.innerText;

      const [heightClassForGridView, heightClassForListView] = getHeightClass(
        contentElem,
        editingNote.image
      );

      if (others.hasOwnProperty(id)) {
        updatedOthers = {
          ...others,
          [id]: {
            id: id,
            title: title,
            content: content,
            image: editingNote.image,
            heightClass: {
              gridView: heightClassForGridView,
              listView: heightClassForListView,
            },
            metaData,
          },
        };
        updatedPinned = { ...pinned };
      } else {
        updatedPinned = {
          ...pinned,
          [id]: {
            id: id,
            title: title,
            content: content,
            image: editingNote.image,
            heightClass: {
              gridView: heightClassForGridView,
              listView: heightClassForListView,
            },
            metaData,
          },
        };
        updatedOthers = { ...others };
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

  function saveEditedNoteAsCopy() {
    const { metaData } = editingNote;
    const { titleElem, contentElem } = editNoteRefs;
    const { others } = notes;
    const [heightClassForGridView, heightClassForListView] = getHeightClass(
      contentElem,
      editingNote.image
    );
    const title = editNoteDefaultText.title ? '' : titleElem.current.innerText;
    const content = editNoteDefaultText.content
      ? ''
      : contentElem.current.innerText;

    const newNoteId = Math.floor(Math.random() * 1000) + 1;
    const newNote = {
      id: newNoteId,
      title,
      content,
      image: editingNote.image,
      heightClass: {
        gridView: heightClassForGridView,
        listView: heightClassForListView,
      },
      metaData,
    };
    const updatedOthers = { ...others, [newNoteId]: newNote };

    setNotes((notes) => {
      return {
        ...notes,
        others: updatedOthers,
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

  function handleOverlayContainerClick() {
    if (editingNote) {
      saveEditedNote();
    } else {
      setTrashEditingNote(null);
    }
  }

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

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
      <SelectedNotesOptions
        notes={notes}
        setNotes={setNotes}
        selectedNoteIds={selectedNoteIds}
        setSelectedNoteIds={setSelectedNoteIds}
      ></SelectedNotesOptions>
      <NavBar
        sidebarState={isSidebarExpanded}
        changeSidebarState={setIsSidebarExpanded}
        isSearchBarActive={isSearchBarActive}
        setIsSearchBarActive={setIsSearchBarActive}
        setIsLoggedIn={setIsLoggedIn}
        gridView={gridView}
        setGridView={setGridView}
        setDefaultFooter={setDefaultFooter}
        navBarOptions={navBarOptions}
        setNavBarOptions={setNavBarOptions}
      ></NavBar>

      <SideBar
        isSidebarExpanded={isSidebarExpanded}
        setIsSidebarExpanded={setIsSidebarExpanded}
        setNotesListOptions={setNotesListOptions}
      ></SideBar>

      <div
        className={
          isSidebarExpanded
            ? 'notesContainer sidebarExpanded'
            : 'notesContainer'
        }
      >
        <NewNote
          ref={newNoterefs}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          isDefaultTextLoaded={isDefaultTextLoaded}
          setisDefaultTextLoaded={setisDefaultTextLoaded}
        ></NewNote>
        <NoteList
          setEditingNote={setEditingNote}
          setTrashEditingNote={setTrashEditingNote}
          notes={notes}
          latestNoteId={latestNoteId}
          setLatestNoteId={setLatestNoteId}
          selectedNoteIds={selectedNoteIds}
          setSelectedNoteIds={setSelectedNoteIds}
          setNotes={setNotes}
          defaultFooter={defaultFooter}
          setDefaultFooter={setDefaultFooter}
          setErrorMessage={setErrorMessage}
          notesListOptions={notesListOptions}
          gridView={gridView}
        ></NoteList>
      </div>

      <div
        className={
          editingNote || trashEditingNote
            ? 'overlayContainer active'
            : 'overlayContainer'
        }
        onClick={handleOverlayContainerClick}
      ></div>

      {editingNote && (
        <EditNote
          ref={editNoteRefs}
          editingNote={editingNote}
          setEditingNote={setEditingNote}
          editNoteDefaultText={editNoteDefaultText}
          setEditNoteDefaultText={setEditNoteDefaultText}
          saveEditedNote={saveEditedNote}
          notes={notes}
          setNotes={setNotes}
          setErrorMessage={setErrorMessage}
          saveEditedNoteAsCopy={saveEditedNoteAsCopy}
          setLatestNoteId={setLatestNoteId}
        ></EditNote>
      )}

      {trashEditingNote && (
        <TrashEditingNote
          ref={editNoteRefs}
          trashEditingNote={trashEditingNote}
          setTrashEditingNote={setTrashEditingNote}
          setErrorMessage={setErrorMessage}
          notes={notes}
          setNotes={setNotes}
        ></TrashEditingNote>
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
