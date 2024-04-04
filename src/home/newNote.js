import './newNote.css';
import { forwardRef, useEffect, useState } from 'react';

function ComponentHandler(props, ref) {
  const { titleRef, contentRef } = ref;
  const { isExpanded, newNoteClickHandler } = props;
  const [isDefaultTextLoaded, setisDefaultTextLoaded] = useState({
    content: true,
    title: true,
  });

  function handleNewNoteClick(e) {
    if (!isExpanded) {
      newNoteClickHandler(true);
    }
  }

  useEffect(() => {
    if (isExpanded) {
      contentRef.current.focus();
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(contentRef.current);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }, [contentRef, isExpanded]);

  const handleKeyPressedOnContent = (e) => {
    if (isDefaultTextLoaded.content) {
      contentRef.current.innerHTML = '';
      setisDefaultTextLoaded((isDefaultTextLoaded) => {
        return { ...isDefaultTextLoaded, content: false };
      });
    }
  };

  const handleKeyPressedOntTitle = (e) => {
    if (isDefaultTextLoaded.title) {
      titleRef.current.innerHTML = '';
      setisDefaultTextLoaded((isDefaultTextLoaded) => {
        return { ...isDefaultTextLoaded, title: false };
      });
    }
  };

  const contentClassesName = `content ${isExpanded ? 'expanded' : 'default'}`;
  const titleClassesname = `title ${isExpanded ? 'show' : 'hide'}`;
  const footerClassesName = `footerContainer ${isExpanded ? 'show' : 'hide'}`;

  return (
    <div
      id="new_note"
      className="newNoteContainer"
      onClick={handleNewNoteClick}
    >
      <div
        contentEditable
        ref={titleRef}
        className={titleClassesname}
        onKeyDown={handleKeyPressedOntTitle}
      >
        Title
      </div>
      <div
        contentEditable
        ref={contentRef}
        className={contentClassesName}
        onKeyDown={handleKeyPressedOnContent}
      >
        Take a note...
      </div>

      <div className={footerClassesName}></div>
    </div>
  );
}

const NewNote = forwardRef(ComponentHandler);
export { NewNote };
