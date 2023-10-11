import { NewNote } from '@/components/newNote';
import classes from '../../styles/home.module.css';
import { useState } from 'react';
import { func } from 'prop-types';
import autosize from 'autosize';

export default function HomePage() {
  const [isExpanded, setIsExpanded] = useState(false);

  function handleHomeContainerClick(e) {
    if (e.target == e.currentTarget) {
      setIsExpanded(false);
    }
  }
  function handleKeyStroke(e) {
    if (e.key == 'Enter') {
      console.log('Enter');
      autosize.update(e);
    }
  }

  return (
    <div className={classes.homeContainer} onClick={handleHomeContainerClick}>
      <NewNote
        isExpanded={isExpanded}
        newNoteClickHandler={setIsExpanded}
      ></NewNote>
    </div>
  );
}
