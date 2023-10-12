import { func } from 'prop-types';
import classes from './newNote.module.css';
import { forwardRef, useRef, useState } from 'react';

function componentHandler(props, ref) {
  const { titleRef, contentRef } = ref;
  const { isExpanded, newNoteClickHandler } = props;

  function handleNewNoteClick(e) {
    if (!isExpanded) {
      newNoteClickHandler(true);
    }
  }

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
      >
        Take a note...
      </div>
      <div className={footerClassesName}>
        <div className={classes.icons}></div>
        <div className={classes.button}>Close</div>
      </div>
    </div>
  );
}

const NewNote = forwardRef(componentHandler);
export { NewNote };
