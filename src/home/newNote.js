import './newNote.css';
import { forwardRef, useEffect } from 'react';
import { MdOutlineColorLens } from 'react-icons/md';
import { BsImage } from 'react-icons/bs';
import { BiArchiveIn } from 'react-icons/bi';
import { BiUndo } from 'react-icons/bi';
import { BiRedo } from 'react-icons/bi';
import { CgMoreVerticalAlt } from 'react-icons/cg';

function ComponentHandler(props, ref) {
  const { titleRef, contentRef } = ref;
  const {
    isExpanded,
    setIsExpanded,
    isDefaultTextLoaded,
    setisDefaultTextLoaded,
  } = props;

  function handleNewNoteClick(e) {
    if (!isExpanded) {
      setIsExpanded(true);
    }
  }

  useEffect(() => {
    if (isExpanded) {
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(contentRef.current);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      titleRef.current.innerHTML = 'Title';
      contentRef.current.innerHTML = 'Take a note...';
      setisDefaultTextLoaded((isDefaultTextLoaded) => {
        return { ...isDefaultTextLoaded, content: true, title: true };
      });
    }
  }, [contentRef, isExpanded, setisDefaultTextLoaded, titleRef]);

  const handleKeyPressedOnContent = (e) => {
    if (e.key === 'Tab' || e.target.className.includes('title')) {
      return;
    }

    if (!isExpanded) {
      setIsExpanded(true);
    }

    if (isDefaultTextLoaded.content) {
      contentRef.current.innerHTML = '';
      setisDefaultTextLoaded((isDefaultTextLoaded) => {
        return { ...isDefaultTextLoaded, content: false };
      });
    }
  };

  const handleKeyPressedOnTitle = (e) => {
    if (e.key === 'Tab') {
      return;
    }
    if (isDefaultTextLoaded.title) {
      titleRef.current.innerHTML = '';
      setisDefaultTextLoaded((isDefaultTextLoaded) => {
        return { ...isDefaultTextLoaded, title: false };
      });
    }
  };

  const handleTitleClick = (e) => {
    if (isDefaultTextLoaded.title) {
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(titleRef.current);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    titleRef.current.focus();
  };

  const handleContentClick = (e) => {
    if (isDefaultTextLoaded.content) {
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(contentRef.current);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    contentRef.current.focus();
  };

  const contentClassesName = `content ${isExpanded ? 'expanded' : 'default'}`;
  const titleClassesname = `title ${isExpanded ? 'show' : 'hide'}`;
  const footerClassesName = `${!isExpanded ? 'hide' : 'footerContainer'}`;

  return (
    <div
      id="new_note"
      className="newNoteContainer"
      onClick={handleNewNoteClick}
      onKeyDown={handleKeyPressedOnContent}
    >
      <div
        contentEditable
        ref={titleRef}
        className={titleClassesname}
        onKeyDown={handleKeyPressedOnTitle}
        onClick={handleTitleClick}
      >
        Title
      </div>
      <div
        contentEditable
        ref={contentRef}
        className={contentClassesName}
        onKeyDown={handleKeyPressedOnContent}
        onClick={handleContentClick}
      ></div>

      <div className={footerClassesName}>
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

const NewNote = forwardRef(ComponentHandler);
export { NewNote };
