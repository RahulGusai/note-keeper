import { NewNote } from './home/newNote';
import './home.css';
import { useEffect, useRef, useState } from 'react';
import { NoteList } from './home/noteList';
import { notes_list } from './data/notes';
import { NavBar } from './menu/navBar';
import { SideBar } from './menu/sideBar';

export default function App() {
  const refs = {
    titleRef: useRef(null),
    contentRef: useRef(null),
  };

  const [isExpanded, setIsExpanded] = useState(false);
  const [notes, setNotes] = useState([]);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  function handleHomeContainerClick(e) {
    const classes = [
      'homeContainer',
      'noteContainer',
      'notesContainer',
      'noteListContainer',
    ];
    if (isExpanded && classes.includes(e.target.className)) {
      const { titleRef, contentRef } = refs;

      //TODO Create a new note with the contents here
      const notesCopy = [...notes];
      const newNote = {
        content: contentRef.current.innerHTML,
      };
      notesCopy.push(newNote);
      setNotes(notesCopy);
      setIsExpanded(false);
    }
  }

  useEffect(() => {
    //TODO fetch the contents from the API here
    setNotes(notes_list);
  }, []);

  return (
    <div className="homeContainer" onClick={handleHomeContainerClick}>
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
            newNoteClickHandler={setIsExpanded}
          ></NewNote>
          <NoteList notes={notes}></NoteList>
        </div>
      </div>
    </div>
  );
}
