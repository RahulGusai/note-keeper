import { Helmet } from 'react-helmet';
import { NewNote } from './home/newNote';
import './home.css';
import { useEffect, useRef, useState } from 'react';
import { NoteList } from './home/noteList';
import { notes_list } from './data/notes';
import { NavBar } from './menu/navBar';
import { SideBar } from './menu/sideBar';
import { EditNote } from './home/editNote';

export default function App() {
  const refs = {
    titleRef: useRef(null),
    contentRef: useRef(null),
  };

  const editNoterefs = {
    titleRef: useRef(null),
    contentRef: useRef(null),
  };

  const [isExpanded, setIsExpanded] = useState(false);
  const [editingNote, setEditingNote] = useState(false);
  const [notes, setNotes] = useState([]);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isDefaultTextLoaded, setisDefaultTextLoaded] = useState({
    content: true,
    title: true,
  });

  function getHeightClass(contentRef) {
    console.log(contentRef.current.innerHTML);

    if (contentRef.current.textContent.length <= 40) return 'short';
    if (
      contentRef.current.textContent.length > 40 &&
      contentRef.current.textContent.length <= 90
    )
      return 'tall';

    if (
      contentRef.current.textContent.length > 90 &&
      contentRef.current.textContent.length <= 140
    )
      return 'taller';

    if (contentRef.current.textContent.length > 140) return 'tallest';
  }

  function handleHomeContainerClick(e) {
    const classes = [
      'homeContainer',
      'noteContainer',
      'notesContainer',
      'noteListContainer',
    ];
    if (isExpanded && classes.includes(e.target.className)) {
      const { titleRef, contentRef } = refs;

      if (!isDefaultTextLoaded.title || !isDefaultTextLoaded.content) {
        const newNoteId = Math.floor(Math.random() * 1000) + 1;
        const updatedNotes = {
          ...notes,
          [newNoteId]: {
            heightClass: getHeightClass(contentRef),
            id: newNoteId,
            title: isDefaultTextLoaded.title ? '' : titleRef.current.innerHTML,
            content: isDefaultTextLoaded.content
              ? ''
              : contentRef.current.innerHTML,
          },
        };
        setNotes(updatedNotes);
      }

      setIsExpanded(false);
    }
  }

  function saveEditedNote() {
    const noteId = editingNote.id;

    setNotes((notes) => {
      return {
        ...notes,
        [noteId]: {
          id: noteId,
          title: editNoterefs.titleRef.current.innerHTML,
          content: editNoterefs.contentRef.current.innerHTML,
          heightClass: getHeightClass(editNoterefs.contentRef),
        },
      };
    });

    setEditingNote(null);
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
      ></NavBar>
      <div className="scrollableContent">
        <SideBar expanded={isSidebarExpanded}></SideBar>
        <div className="notesContainer">
          <NewNote
            ref={refs}
            isExpanded={isExpanded}
            setIsExpanded={setIsExpanded}
            isDefaultTextLoaded={isDefaultTextLoaded}
            setisDefaultTextLoaded={setisDefaultTextLoaded}
          ></NewNote>
          <NoteList setEditingNote={setEditingNote} notes={notes}></NoteList>
        </div>
      </div>
      {editingNote && (
        <>
          <div class="overlayContainer" onClick={saveEditedNote}></div>
          <EditNote ref={editNoterefs} editingNote={editingNote}></EditNote>
        </>
      )}
    </div>
  );
}
