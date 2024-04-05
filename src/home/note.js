import { useEffect, useRef } from 'react';
import './note.css';
import { TextIncrease } from '@mui/icons-material';

export function Note(props) {
  const { title, content } = props;

  const titleRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (title.length > 0 && content.length > 0) {
      titleRef.current.innerHTML = title;
      contentRef.current.innerHTML = content;
      return;
    }

    if (title.length > 0) {
      titleRef.current.innerHTML = title;
      return;
    }

    titleRef.current.innerHTML = content;
  }, [content, title]);

  return (
    <div className="noteContainer">
      <div contentEditable ref={titleRef} className="title"></div>
      <div contentEditable ref={contentRef} className="content"></div>
    </div>
  );
}
