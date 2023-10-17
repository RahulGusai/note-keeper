import { func } from 'prop-types';
import classes from './newNote.module.css';
import { forwardRef, useEffect, useState } from 'react';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

function componentHandler(props, ref) {
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
    contentRef.current.innerHTML = 'Take a note...';
  }, [isExpanded]);

  const contentClassesName = `${classes.content} ${
    isExpanded ? classes.expanded : classes.default
  }`;

  const titleClassesname = `${classes.title} ${
    isExpanded ? classes.show : classes.hide
  }`;

  const footerClassesName = `${classes.footerContainer} ${
    isExpanded ? classes.show : classes.hide
  }`;

  return (
    <div
      id="new_note"
      className={classes.newNoteContainer}
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
        <div className={classes.icons}>
          <FormatListBulletedIcon
            onClick={insertBulletPoint}
            className={classes.bulletIcon}
          ></FormatListBulletedIcon>
        </div>
        <div className={classes.button}>Close</div>
      </div>
    </div>
  );
}

const NewNote = forwardRef(componentHandler);
export { NewNote };
