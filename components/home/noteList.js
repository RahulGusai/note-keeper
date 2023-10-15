import { Note } from './note';
import classes from './noteList.module.css';

export function NoteList(props) {
  const { notes } = props;

  return (
    <div className={classes.noteListContainer}>
      {notes.map((note) => {
        return <Note height="200" content={note.content}></Note>;
      })}
    </div>
  );
}
