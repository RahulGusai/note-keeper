import { useEffect, useRef } from 'react';
import { MdOutlineColorLens } from 'react-icons/md';
import { BsImage } from 'react-icons/bs';
import { BiArchiveIn } from 'react-icons/bi';
import { BiUndo } from 'react-icons/bi';
import { BiRedo } from 'react-icons/bi';
import { CgMoreVerticalAlt } from 'react-icons/cg';
import './note.css';

export function Note(props) {
  const { title, content, heightClass } = props;

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

  function handleNoteClick(e) {}

  return (
    <div className={`noteContainer ${heightClass}`} onClick={handleNoteClick}>
      <div ref={titleRef} className="note-title"></div>
      <div ref={contentRef} className={`note-content ${heightClass}`}></div>
      <div className="note-footer">
        <div
          style={{
            backgroundColor: '#202124',
          }}
        >
          <MdOutlineColorLens
            style={{
              color: '#ffffff',
            }}
          />
        </div>
        <div
          style={{
            backgroundColor: '#202124',
          }}
        >
          <BsImage
            style={{
              color: '#ffffff',
            }}
          />
        </div>
        <div
          style={{
            backgroundColor: '#202124',
          }}
        >
          <BiArchiveIn
            style={{
              color: '#ffffff',
            }}
          />
        </div>
        <div
          style={{
            backgroundColor: '#202124',
          }}
        >
          <CgMoreVerticalAlt
            style={{
              color: '#ffffff',
            }}
          />
        </div>
        <div
          style={{
            backgroundColor: '#202124',
          }}
        >
          <BiUndo
            style={{
              color: '#ffffff',
            }}
          />
        </div>
        <div
          style={{
            backgroundColor: '#202124',
          }}
        >
          <BiRedo
            style={{
              color: '#ffffff',
            }}
          />
        </div>
      </div>
    </div>
  );
}
