import { useEffect, useRef } from 'react';
import './note.css';

export function Note(props) {
  const { height, content } = props;
  const noteRef = useRef(null);

  useEffect(() => {
    noteRef.current.innerHTML = content;
  }, [content, noteRef]);

  return (
    <div
      ref={noteRef}
      style={{ '--custom-height': `${height}px` }}
      className="noteContainer"
    ></div>
  );
}
