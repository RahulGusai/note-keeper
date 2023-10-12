import { NewNote } from '@/components/newNote';
import classes from '../../styles/home.module.css';
import { useEffect, useRef, useState } from 'react';

export default function HomePage() {
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);

  function handleHomeContainerClick(e) {
    if (e.target == e.currentTarget) {
      //fetch title and content of note here

      console.log(titleRef.current.innerHTML);
      console.log(contentRef.current.innerHTML);
      setIsExpanded(false);
    }
  }

  return (
    <div className={classes.homeContainer} onClick={handleHomeContainerClick}>
      <NewNote
        ref={(titleRef, contentRef)}
        isExpanded={isExpanded}
        newNoteClickHandler={setIsExpanded}
      ></NewNote>
    </div>
  );
}
