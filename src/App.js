import { Helmet } from 'react-helmet';
import { NewNote } from './home/newNote';
import './home.css';
import { useEffect, useRef, useState } from 'react';
import { NoteList } from './home/noteList';
import { NavBar } from './menu/navBar';
import { SideBar } from './menu/sideBar';
import { EditNote } from './home/editNote';
import { TrashEditingNote } from './home/trashEditNote';
import { ErrorDialog } from './home/errorDialog';
import { getHeightClass } from './utils';
import { SelectedNotesOptions } from './home/selectedNotesOptions';
import { updateNotesForUser } from './utils';
import { DEFAULT_NOTE_COLOR } from './constants/colors';

export default function App(props) {
  const { notes, setNotes, userDetails, setUserDetails } = props;
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
  const [filteredNotes, setFilteredNotes] = useState({});
  const [notesListOptions, setNotesListOptions] = useState({
    showArchives: false,
    showTrash: false,
    showFiltered: false,
  });
  const [gridView, setGridView] = useState(true);

  const [navBarOptions, setNavBarOptions] = useState({
    showUserProfileDialog: false,
    showSettingsDialog: false,
  });

  const [newNoteData, setNewNoteData] = useState({
    newNoteId: Math.floor(Math.random() * 1000) + 1,
    backgroundColor: '#202124',
    image: null,
  });

  const [newNoteFooterOptions, setNewNoteFooterOptions] = useState({
    showColorSelector: false,
  });

  async function createNote(isArchived = false) {
    const { titleRef, contentRef } = newNoterefs;
    const { newNoteId, image, backgroundColor } = newNoteData;
    // const newNoteId = Math.floor(Math.random() * 1000) + 1;

    if (!isDefaultTextLoaded.title || !isDefaultTextLoaded.content || image) {
      const [heightClassForGridView, heightClassForListView] = getHeightClass(
        contentRef,
        image
      );

      if (isArchived) {
        const updatedArchives = {
          ...notes.archives,
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
              backgroundColor: backgroundColor,
            },
            image: image,
          },
        };
        setNotes((notes) => {
          return {
            ...notes,
            archives: updatedArchives,
          };
        });
      } else {
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
              backgroundColor: backgroundColor,
            },
            image: image,
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
    }

    setIsExpanded(false);
    setNewNoteFooterOptions((newNoteFooterIcons) => {
      return {
        ...newNoteFooterIcons,
        showColorSelector: false,
      };
    });

    setNewNoteData((newNoteData) => {
      return {
        ...newNoteData,
        newNoteId: Math.floor(Math.random() * 1000) + 1,
        backgroundColor: DEFAULT_NOTE_COLOR,
        image: null,
      };
    });
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
      'sideBarContainer',
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
    const { id, metaData, image } = editingNote;
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
        image
      );

      if (others.hasOwnProperty(id)) {
        updatedOthers = {
          ...others,
          [id]: {
            id: id,
            title: title,
            content: content,
            image:
              others[id].image || image
                ? { ...image, ...others[id].image }
                : null,
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
            image:
              others[id].image || image
                ? { ...image, ...others[id].image }
                : null,
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
    async function updateNotes() {
      const { id } = userDetails;
      await updateNotesForUser(id, notes);
    }
    updateNotes();
  }, [notes, userDetails]);

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
        notesListOptions={notesListOptions}
        latestNoteId={latestNoteId}
        setLatestNoteId={setLatestNoteId}
      ></SelectedNotesOptions>
      <NavBar
        notes={notes}
        sidebarState={isSidebarExpanded}
        changeSidebarState={setIsSidebarExpanded}
        isSearchBarActive={isSearchBarActive}
        setIsSearchBarActive={setIsSearchBarActive}
        userDetails={userDetails}
        setUserDetails={setUserDetails}
        gridView={gridView}
        setGridView={setGridView}
        setDefaultFooter={setDefaultFooter}
        navBarOptions={navBarOptions}
        setNavBarOptions={setNavBarOptions}
        setFilteredNotes={setFilteredNotes}
        notesListOptions={notesListOptions}
        setNotesListOptions={setNotesListOptions}
      ></NavBar>
      <SideBar
        isSidebarExpanded={isSidebarExpanded}
        setNotesListOptions={setNotesListOptions}
        setIsSidebarExpanded={setIsSidebarExpanded}
        setSelectedNoteIds={setSelectedNoteIds}
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
          setErrorMessage={setErrorMessage}
          newNoteData={newNoteData}
          setNewNoteData={setNewNoteData}
          newNoteFooterOptions={newNoteFooterOptions}
          setNewNoteFooterOptions={setNewNoteFooterOptions}
          createNote={createNote}
          notes={notes}
          setNotes={setNotes}
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
          filteredNotes={filteredNotes}
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
          notesListOptions={notesListOptions}
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
