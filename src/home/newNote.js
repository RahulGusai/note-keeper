import './newNote.css';
import { forwardRef, useEffect, useState } from 'react';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

function ComponentHandler(props, ref) {
  const { titleRef, contentRef } = ref;
  const { isExpanded, newNoteClickHandler } = props;
  const [bulletEnabled, setBulletEnabled] = useState(false);

  function handleNewNoteClick(e) {
    if (!isExpanded) {
      newNoteClickHandler(true);
    }
  }

  function insertBulletPoint() {
    if (bulletEnabled) {
      //TODO Handle true case
      setBulletEnabled(false);
    } else {
      const currentContent = contentRef.current.innerHTML;
      contentRef.current.innerHTML = `${currentContent}<p>&#8226;&nbsp;</p>`;
      setBulletEnabled(true);
    }
  }

  useEffect(() => {
    if (!isExpanded) {
      contentRef.current.innerHTML =
        'Take a note. You can click anywhere on the screen to save it';
    } else {
      contentRef.current.innerHTML = '';
    }
  }, [contentRef, isExpanded]);

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
        role="textbox"
        className={titleClassesname}
      >
        Title
      </div>
      <div
        contentEditable
        ref={contentRef}
        role="textbox"
        className={contentClassesName}
      ></div>

      <div className={footerClassesName}>
        <div className="icons">
          <FormatListBulletedIcon
            style={{ color: 'white' }}
            onClick={insertBulletPoint}
            className="bulletIcon"
          ></FormatListBulletedIcon>
        </div>
        <div className="button">Close</div>
      </div>
    </div>
  );
}

const NewNote = forwardRef(ComponentHandler);
export { NewNote };
