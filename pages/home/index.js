import { NewNote } from '@/components/home/newNote';
import classes from '../../styles/home.module.css';
import { useEffect, useRef, useState } from 'react';
import { NoteList } from '@/components/home/noteList';

export default function HomePage() {
  const refs = {
    titleRef: useRef(null),
    contentRef: useRef(null),
  };

  const [isExpanded, setIsExpanded] = useState(false);

  function handleHomeContainerClick(e) {
    if (e.target == e.currentTarget) {
      //fetch title and content of note here
      const { titleRef, contentRef } = refs;
      console.log(titleRef.current.innerHTML);
      console.log(refs.contentRef.current.innerHTML);
      //Create a new note with the contents here
      setIsExpanded(false);
    }
  }

  return (
    <div className={classes.homeContainer} onClick={handleHomeContainerClick}>
      <NewNote
        ref={refs}
        isExpanded={isExpanded}
        newNoteClickHandler={setIsExpanded}
      ></NewNote>
      <NoteList></NoteList>
    </div>
  );
}
