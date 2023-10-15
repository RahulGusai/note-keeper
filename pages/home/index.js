import { NewNote } from '@/components/home/newNote';
import classes from '../../styles/home.module.css';
import { useEffect, useRef, useState } from 'react';
import { NoteList } from '@/components/home/noteList';
import { notes_list } from '@/data/notes';

export default function HomePage() {
  const refs = {
    titleRef: useRef(null),
    contentRef: useRef(null),
  };

  const [isExpanded, setIsExpanded] = useState(false);
  const [notes, setNotes] = useState([]);

  function handleHomeContainerClick(e) {
    if (e.target == e.currentTarget) {
      const { titleRef, contentRef } = refs;
      console.log(titleRef.current.innerHTML);
      console.log(contentRef.current.innerHTML);
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
    <div className={classes.homeContainer} onClick={handleHomeContainerClick}>
      <NewNote
        ref={refs}
        isExpanded={isExpanded}
        newNoteClickHandler={setIsExpanded}
      ></NewNote>
      <NoteList notes={notes}></NoteList>
    </div>
  );
}
