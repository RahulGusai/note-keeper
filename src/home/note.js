import { useEffect, useRef } from 'react';
import { MdOutlineColorLens } from 'react-icons/md';
import { BsImage } from 'react-icons/bs';
import { BiArchiveIn } from 'react-icons/bi';
import { BiUndo } from 'react-icons/bi';
import { BiRedo } from 'react-icons/bi';
import { CgMoreVerticalAlt } from 'react-icons/cg';
import { TbPinned } from 'react-icons/tb';
import { RiCheckboxCircleFill } from 'react-icons/ri';

import './note.css';

export function Note(props) {
  const { title, content, heightClass } = props;

  const titleRef = useRef(null);
  const contentRef = useRef(null);

  const rowSpanToHeight = {
    short: 'short-height',
    tall: 'tall-height',
    taller: 'taller-height',
    tallest: 'tallest-height',
  };

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
    <div className={`outer-container ${heightClass}`}>
      <div className="noteContainer" onClick={handleNoteClick}>
        <div
          className="select-icon"
          style={{
            backgroundColor: 'transparent',
          }}
        >
          <RiCheckboxCircleFill
            style={{
              color: '#ffffff',
            }}
          />
        </div>
        <div className="title-bar">
          <div ref={titleRef} className="note-title"></div>
          <div
            className="pin-icon"
            style={{
              backgroundColor: '#202124',
            }}
          >
            <TbPinned
              style={{
                color: '#ffffff',
              }}
            />
          </div>
        </div>
        <div
          ref={contentRef}
          className={`note-content ${rowSpanToHeight[heightClass]}`}
        ></div>
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
    </div>
  );
}
