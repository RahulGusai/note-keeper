import { func } from 'prop-types';
import classes from './newNote.module.css';
import { useState } from 'react';

export function NewNote(props) {
  const { isExpanded, newNoteClickHandler } = props;

  function handleNewNoteClick(e) {
    if (!isExpanded) {
      newNoteClickHandler(true);
    }
  }

  function handleLineChange(e) {
    if (e.key == 'Enter') {
      // console.log(e.target.scrollHeight + 30 + 'px');
      // e.target.style.height = e.target.scrollHeight + 30 + 'px';
      e.target.style.cssText = 'height:auto; padding:0';
      e.target.cssText = 'height:' + e.target.scrollHeight + 30 + 'px';
    }
  }

  const contentClassesName = `${classes.content} ${
    isExpanded ? classes.expanded : classes.default
  }`;

  const titleClassesname = `${classes.title} ${
    isExpanded ? classes.showTitle : classes.hideTitle
  }`;

  return (
    <div className={classes.newNoteContainer} onClick={handleNewNoteClick}>
      <div contentEditable role="textbox" className={titleClassesname}>
        Title
      </div>
      <div contentEditable role="textbox" className={classes.content}>
        Take a note...
      </div>
    </div>
  );
}
