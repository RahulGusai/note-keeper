import { Helmet } from 'react-helmet';
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
  const [isDefaultTextLoaded, setisDefaultTextLoaded] = useState({
    content: true,
    title: true,
  });

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
        console.log(isDefaultTextLoaded);
        const updatedNotes = [
          ...notes,
          {
            title: isDefaultTextLoaded.title ? '' : titleRef.current.innerHTML,
            content: isDefaultTextLoaded.content
              ? ''
              : contentRef.current.innerHTML,
          },
        ];
        setNotes(updatedNotes);
      }

      setIsExpanded(false);
    }
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
            newNoteClickHandler={setIsExpanded}
            isDefaultTextLoaded={isDefaultTextLoaded}
            setisDefaultTextLoaded={setisDefaultTextLoaded}
          ></NewNote>
          <NoteList notes={notes}></NoteList>
        </div>
      </div>
    </div>
  );
}
