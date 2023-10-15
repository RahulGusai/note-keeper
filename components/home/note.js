import { useEffect, useRef } from 'react';
import classes from './note.module.css';

export function Note(props) {
  const { height, content } = props;
  const noteRef = useRef(null);

  useEffect(() => {
    noteRef.current.innerHTML = content;
  }, []);

  return (
    <div
      ref={noteRef}
      style={{ '--custom-height': `${height}px` }}
      className={classes.noteContainer}
    ></div>
  );
}
