import './editNote.css';
import { forwardRef, useEffect, useRef } from 'react';
import { MdOutlineColorLens } from 'react-icons/md';
import { BsImage } from 'react-icons/bs';
import { BiArchiveIn } from 'react-icons/bi';
import { BiUndo } from 'react-icons/bi';
import { BiRedo } from 'react-icons/bi';
import { CgMoreVerticalAlt } from 'react-icons/cg';

function FunctionComponent(props, ref) {
  const { editingNote } = props;
  const { title, content } = editingNote;

  const { titleRef, contentRef } = ref;

  useEffect(() => {
    titleRef.current.innerHTML = title.length > 0 ? title : 'Title';
    contentRef.current.innerHTML = content.length > 0 ? content : 'Note';
    contentRef.current.focus();
  }, [content, contentRef, title, titleRef]);

  return (
    <div className="editNoteContainer">
      <div className="title-bar">
        <div contentEditable ref={titleRef} className="note-title"></div>
      </div>
      <div contentEditable ref={contentRef} className="note-content"></div>
      <div className="note-footer">
        <div className="footerIcons">
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
        <div className="closeButton">Close</div>
      </div>
    </div>
  );
}

const EditNote = forwardRef(FunctionComponent);
export { EditNote };
